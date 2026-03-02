"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const addCategory = async (data) => {
    try {
        const res = await axios.post("/api/categories/add", data);
        return res.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.error || "Category cannot be created"
        );
    }
}

export const useAddCategory = () => {
    return useMutation({
        mutationFn: addCategory
    });
}