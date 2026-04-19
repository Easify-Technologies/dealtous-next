"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const updateBlog = async (data) => {
    try {
        const res = await axios.post("/api/admin/update-blog", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return res.data;
    } catch (error) {
        console.error("Error updating blog", error);
        throw new Error(
            error.response?.data?.error || "Blog cannot be updated"
        );
    }
}

export const useUpdateBlog = () => {
    return useMutation({
        mutationFn: updateBlog
    });
}