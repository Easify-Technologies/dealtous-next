"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const updateCategory = async (data) => {
    try {
        const res = await axios.post("/api/categories/update", data);
        return res.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.error || "Category cannot be created"
        );
    }
}

export const useUpdateCategory = () => {
    return useMutation({
        mutationFn: updateCategory,
    });
}