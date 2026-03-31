"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const releaseCryptoPayment = async(orderId) => {
    try {
        const res = await axios.post("/api/admin/crypto/release", { orderId });
        return res.data;
    } catch (error) {
        console.error("Error releasing crypto payment", error);
        throw new Error("Failed to release crypto payment");
    }
}

export const useReleaseCryptoPayment = () => {
    return useMutation({
        mutationFn: releaseCryptoPayment,
        onSuccess: () => {
            alert("Crypto payment released successfully");
        }
    });
}