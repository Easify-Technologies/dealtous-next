"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchCategories = async() => {
    try {
        const res = await axios.get("/api/categories/fetch");
        return res.data.category;
    } catch (error) {
        throw new Error(
            error.response?.data?.error || "Category cannot be created"
        );
    }
}

export const useFetchCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
        staleTime: 5000
    });
}