"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const capturePayment = async(orderId) => {
    try {
        const res = await axios.post("/api/stripe/capture-payment", { orderId });
        return res.data;
    } catch (error) {
        console.error(error);
        throw new Error(
            error.response?.data?.error || "Payment Capture Failed"
        );
    }
}

export const useCapturePayment = () => {
    return useMutation({
        mutationFn: capturePayment,
        onSuccess: (data) => {
            alert(data.message);
        }
    });
}