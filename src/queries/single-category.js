"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchCategoryById = async (categoryId) => {
  try {
    const res = await axios.post("/api/categories/single", {
      categoryId,
    });
    return res.data.category;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch category"
    );
  }
};

export const useFetchCategoryById = (categoryId) => {
  return useQuery({
    queryKey: ["single-category", categoryId],
    queryFn: () => fetchCategoryById(categoryId),
    enabled: !!categoryId,
    refetchOnWindowFocus: false,
    retry: false,
  });
};