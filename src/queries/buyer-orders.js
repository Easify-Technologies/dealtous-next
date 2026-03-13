"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchBuyerOrders = async (buyerId) => {
    try {
        const res = await axios.get(`/api/orders?buyerId=${buyerId}`);
        return res.data.orders ?? [];
    } catch (error) {
        throw new Error(
            error.response?.data?.error || "No Orders Found"
        );
    }
}

export const useFetchBuyerOrders = (buyerId) => {
  return useQuery({
    queryKey: ["buyer-orders", buyerId],
    queryFn: () => fetchBuyerOrders(buyerId),
    enabled: !!buyerId,
    refetchOnWindowFocus: false,
    retry: false,
  });
}