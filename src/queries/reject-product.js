"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const rejectProduct = async ({ productId }) => {
    try {
        const token = localStorage.getItem("adminToken") ?? "";

        if (!token) {
            throw new Error("Admin token not found");
        }

        const res = await axios.delete("/api/admin/products/reject", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                productId
            }
        });

        return res.data;
    }
    catch (error) {
        throw new Error("Admin token not found");
    }
}

export const useRejectProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: rejectProduct,
        onSuccess: () => {
            queryClient.invalidateQueries(["products"]);
        },
        onError: (error) => {
            console.error("Rejection failed:", error.response?.data);
        },
    });
}