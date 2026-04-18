"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const banUser = async (data) => {
    try {
        const res = await axios.post("/api/admin/ban-user", data);

        return res.data;
    } catch (error) {
        console.error("Error banning this user", error);
        throw new Error(
            error.response?.data?.error || "Message cannot be sent"
        );
    }
}

export const useBanUser = () => {
    return useMutation({
        mutationFn: banUser
    });
}