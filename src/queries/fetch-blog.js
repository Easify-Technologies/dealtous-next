"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchBlog = async(blogId) => {
    try {
        const res = await axios.get(`/api/blog/${blogId}`);
        return res.data.blog ?? [];
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch the blog");
    }
}

export const useFetchBlogById = (blogId) => {
    return useQuery({
        queryKey: ["single-blog", blogId],
        queryFn: () => fetchBlog(blogId),
        enabled: !!blogId,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
        staleTime: 5000
    });
}