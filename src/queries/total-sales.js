"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchTotalSales = async() => {
    try {
        const res = await axios.get("/api/admin/total-sales");
        return res.data.sales ?? [];
    } catch (error) {
        console.error("Error fetching total sales", error);
        throw error;
    }
}

export const useFetchTotalSales = () => {
    return useQuery({
        queryKey: ["total-sales"],
        queryFn: fetchTotalSales,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10
    });
}