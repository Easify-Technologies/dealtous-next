"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchProducts = async() => {
    try {
        const res = await axios.get("/api/products/fetch");
        return res.data.products;
    } catch (error) {
        throw new Error(
            error.response?.data?.error || "Products cannot be fetched"
        );
    }
}

export const useFetchProducts = () => {
    return useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
        staleTime: 5000
    });
}