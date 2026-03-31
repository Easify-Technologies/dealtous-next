"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const deleteBlog = async (blogId) => {
    try {
        const res = await axios.delete("/api/admin/delete-blog", {
            data: { blogId }
        });
        return res.data;
    } catch (error) {
        console.error("Error deleting the blog:", error);
        throw new Error("Failed to delete the blog");
    }
}

export const useDeleteBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteBlog,
        onSuccess: () => {
            queryClient.invalidateQueries(["admin-blogs"]);
        }
    });
}