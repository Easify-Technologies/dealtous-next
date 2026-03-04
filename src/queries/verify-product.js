"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const verifyProduct = async ({ productId }) => {
  const token = localStorage.getItem("adminToken") ?? "";

  if (!token) {
    throw new Error("Admin token not found");
  }

  const response = await axios.put(
    `/api/admin/products/${productId}/publish`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useVerifyProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
    onError: (error) => {
      console.error("Publish failed:", error.response?.data);
    },
  });
};