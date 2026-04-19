"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const verifyCryptoPayment = async({ orderId, action }) => {
    try {
        const res = await axios.post("/api/admin/crypto/verify", { orderId, action });
        return res.data;
    } catch (error) {
        console.error("Error verifying crypto payment", error);
        throw new Error("Failed to verify crypto payment");
    }
}

export const useVerifyCryptoPayment = () => {
    return useMutation({
        mutationFn: verifyCryptoPayment
    });
}