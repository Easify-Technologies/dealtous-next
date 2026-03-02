"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const userRegister = async(data) => {
    try {
        const res = await axios.post("/api/auth/register", data);
        return res.data;
    } catch (error) {
        throw error.response?.data?.message || "Registration failed";
    }
}

export const useUserRegister = () => {
    return useMutation({
        mutationFn: userRegister
    });
}