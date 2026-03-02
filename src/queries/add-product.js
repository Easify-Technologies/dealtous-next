"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const addProduct = async (formData) => {
    try {
        const res = await axios.post("/api/products", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.error || "Product cannot be created"
        );
    }
};

export const useAddProduct = () => {
    return useMutation({
        mutationFn: addProduct
    });
}