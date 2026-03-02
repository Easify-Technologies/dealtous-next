"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const removeCategory = async (data) => {
    try {
        const res = await axios.post("/api/categories/remove", data);
        return res.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.error || "Category cannot be removed"
        );
    }
}

export const useRemoveCategory = () => {
    return useMutation({
        mutationFn: removeCategory,
    });
}