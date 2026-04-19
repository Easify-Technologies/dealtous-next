"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const publishBlog = async ({ blogId }) => {
    try {
        const res = await axios.post("/api/admin/publish-blog", { blogId });

        return res.data;
    } catch (error) {
        console.error("Error publishing blog", error);
        throw new Error(
            error.response?.data?.error || "Blog cannot be published"
        );
    }
}

export const usePublishBlog = () => {
    return useMutation({
        mutationFn: publishBlog,
        
    });
}