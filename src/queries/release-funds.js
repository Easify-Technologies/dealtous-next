"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const releaseFunds = async(orderId) => {
    try {
        const res = await axios.post("/api/stripe/release-funds", { orderId });
        return res.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.error || "Failed to release the fund"
        );
    }
}

export const useReleaseFunds = () => {
    return useMutation({
        mutationFn: releaseFunds,
        onSuccess: (data) => {
            alert(data.message);
        }
    });
}
