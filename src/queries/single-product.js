"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchProductById = async (productId) => {
  try {
    const res = await axios.get(`/api/products/${productId}`);
    return res.data.product;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch product"
    );
  }
};

export const useFetchProductById = (productId) => {
  return useQuery({
    queryKey: ["single-product", productId],
    queryFn: () => fetchProductById(productId),
    enabled: !!productId,
    refetchOnWindowFocus: false,
    retry: false,
  });
};