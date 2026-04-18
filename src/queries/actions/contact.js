"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const sendContactMessage = async (data) => {
    try {
        const res = await axios.post("/api/admin/send-message", data);

        return res.data;
    } catch (error) {
        console.error("Error sending contact message", error);
        throw new Error(
            error.response?.data?.error || "Message cannot be sent"
        );
    }
}

export const useSendContactMessage = () => {
    return useMutation({
        mutationFn: sendContactMessage
    });
}