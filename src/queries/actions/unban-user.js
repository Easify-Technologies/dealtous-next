"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const unBanUser = async (data) => {
    try {
        const res = await axios.post("/api/admin/unban-user", data);

        return res.data;
    } catch (error) {
        console.error("Error unbanning this user", error);
        throw new Error(
            error.response?.data?.error || "Message cannot be sent"
        );
    }
}

export const useUnbanUser = () => {
    return useMutation({
        mutationFn: unBanUser
    });
}