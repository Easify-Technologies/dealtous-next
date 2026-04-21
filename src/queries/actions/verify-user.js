"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const verifyUser = async (data) => {
    try {
        const res = await axios.post("/api/admin/verify-user", data);

        return res.data;
    } catch (error) {
        console.error("Error verifying this user", error);
        throw new Error(
            error.response?.data?.error || "An error occurred while verifying this user."
        );
    }
}

export const useVerifyUser = () => {
    return useMutation({
        mutationFn: verifyUser
    })
}
