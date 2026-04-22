'use client';

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const reviewProduct = async (data) => {
    try {
        const res = await axios.post("/api/products/review", data);

        return res.data;
    } catch (error) {
        console.error("Error reviewing this product", error);
        throw new Error(
            error.response?.data?.error || "An error occurred while reviewing this product."
        );
    }
}

export const useReviewProduct = () => {
    return useMutation({
        mutationFn: reviewProduct
    })
}