"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUserProducts = async (userId) => {
  try {
    const res = await axios.get(`/api/products/fetch/${userId}`);
    return res.data.products ?? [];
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch product"
    );
  }
};

export const useFetchUserProducts = (userId) => {
  return useQuery({
    queryKey: ["user-products", userId],
    queryFn: () => fetchUserProducts(userId),
    enabled: !!userId,
    refetchOnWindowFocus: false,
    retry: false,
  });
};