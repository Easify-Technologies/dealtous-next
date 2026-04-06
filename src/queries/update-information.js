"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const updateUserInformation = async (data) => {
    try {
        const res = await axios.post("/api/update-information", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (error) {
        console.error(error);
        throw new Error(
            error.response?.data?.error
        );
    }
}

export const useUpdateUserInformation = () => {
    return useMutation({
        mutationFn: updateUserInformation,
    });
}