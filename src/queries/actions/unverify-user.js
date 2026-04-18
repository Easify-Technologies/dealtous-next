"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const unVerifyUser = async(data) => {
    try {
        const res = await axios.post("/api/admin/unverify-user", data);

        return res.data;
    } catch (error) {
        console.error("Error unverifying this user", error);
        throw new Error(
            error.response?.data?.error || "An error occurred while unverifying this user."
        );
    }
}

export const useUnverifyUser = () => {
    return useMutation({
        mutationFn: unVerifyUser
    })
}
