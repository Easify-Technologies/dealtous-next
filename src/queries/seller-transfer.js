"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const markTransferStatus = async(data) => {
    try {
        const res = await axios.post("/api/seller/seller-transfer", data);
        return res.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.error || "Failed to mark transfer status"
        );
    }
}

export const useMarkTransferStatus = () => {
    return useMutation({
        mutationFn: markTransferStatus,
        onSuccess: (data) => {
            alert(data.message);
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    });
} 