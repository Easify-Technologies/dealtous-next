"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchAllUsers = async() => {
    try {
        const res = await axios.get("/api/admin/users");
        return res.data.users ?? [];
    } catch (error) {
        console.error("Error: fetching users", error);
        throw error;
    }
}

export const useFetchAllUsers = () => {
    return useQuery({
        queryKey: ["admin-users"],
        queryFn: fetchAllUsers,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
        staleTime: 5000
    });
}