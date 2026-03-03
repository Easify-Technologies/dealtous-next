"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

const removeProduct = async (productId) => {
  const res = await axios.delete(`/api/products/${productId}`);
  return res.data;
};

export const useRemoveProduct = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: removeProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      setTimeout(() => {
        router.push("/user/products");
      }, 1000);
    },
  });
};