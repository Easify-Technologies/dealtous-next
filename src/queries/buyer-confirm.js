"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const buyerConfirm = async(orderId) => {
    try {
        const res = await axios.post("/api/orders/buyer-confirm", { orderId });
        return res.data;
    } catch (error) {
        console.error(error);
        throw new Error(
            error.response?.data?.error || "Seller transfer not completed"
        );
    }
}

export const useBuyerConfirm = () => {
    return useMutation({
        mutationFn: buyerConfirm
    });
}
