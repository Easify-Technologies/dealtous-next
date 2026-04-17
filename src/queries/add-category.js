"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";

const addCategory = async (data) => {
    try {
        const res = await axios.post("/api/categories/add", data);
        return res.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.error || "Category cannot be created"
        );
    }
}

export const useAddCategory = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: addCategory,
        onSuccess: () => {
            setTimeout(() => {
                router.push("/admin/categories");
            }, 2000);
        }
    });
}