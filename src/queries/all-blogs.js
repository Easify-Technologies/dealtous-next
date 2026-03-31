"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchBlogs = async() => {
    try {
        const res = await axios.get("/api/admin/fetch-blogs");
        return res.data.blogs ?? [];
    } catch (error) {
        console.error("Error fetching blogs", error);
        throw new Error("Failed to fetch blogs");
    }
}

export const useFetchBlogs = () => {
    return useQuery({
        queryKey: ["admin-blogs"],
        queryFn: fetchBlogs,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
        staleTime: 5000
    });
}