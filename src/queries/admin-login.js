"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";

const adminLogin = async (data) => {
    try {
        const res = await axios.post("/api/admin/login", data);
        return res.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.error || "Login failed"
        );
    }
};

export const useAdminLogin = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: adminLogin,
        onSuccess: (data) => {
            localStorage.setItem("adminToken", data.token);

            router.push("/admin/dashboard");
        }
    });
};