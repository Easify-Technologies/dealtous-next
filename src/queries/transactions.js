"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchTransactions = async() => {
    try {
        const res = await axios.get("/api/admin/transactions");
        return res.data.transactions ?? [];
    } catch (error) {
        console.error("Error fetching transactions", error);
        throw error;
    }
}

export const useOrderTransactions = () => {
    return useQuery({
        queryKey: ["transactions"],
        queryFn: fetchTransactions,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
        staleTime: 5000
    });
}