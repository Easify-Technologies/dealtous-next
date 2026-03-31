"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const addBlog = async (data) => {
    try {
        const res = await axios.post("/api/admin/add-blog", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (error) {
        console.error("Error adding blog", error);
        throw new Error(
            error.response?.data?.error || "Blog cannot be created"
        );
    }
}

export const useAddBlog = () => {
    return useMutation({
        mutationFn: addBlog
    });
}