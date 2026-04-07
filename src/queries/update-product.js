"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";

const updateProduct = async ({ formData, productId }) => {
  try {
    const res = await axios.put(
      `/api/products/${productId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Product cannot be updated"
    );
  }
};

export const useUpdateProduct = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      setTimeout(() => {
        router.push("/user/products");
      }, 1500);
    }
  });
}