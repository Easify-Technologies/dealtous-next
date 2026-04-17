"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const removeProduct = async (productId) => {
  const res = await axios.delete(`/api/products/${productId}`);
  return res.data;
};

export const useRemoveProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });
};