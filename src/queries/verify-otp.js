"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const userVerifyOtp = async (data) => {
    try {
        const res = await axios.post("/api/auth/verify", data);
        return res.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.error ||
            error.response?.data?.message ||
            "Verification failed"
        );
    }
}

export const useUserVerifyOtp = () => {
    return useMutation({
        mutationFn: userVerifyOtp
    });
}