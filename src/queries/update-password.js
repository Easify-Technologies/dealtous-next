"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const verifyUserEmail = async (data) => {
    try {
        const res = await axios.post("/api/update-password", data);
        return res.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.error || "Failed to verify email"
        );
    }
}

const updateUserPassword = async (data) => {
    try {
        const res = await axios.put("/api/update-password", data);
        return res.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.error || "Failed to update password"
        );
    }
}

export const useVerifyUserEmail = () => {
  return useMutation({
    mutationFn: verifyUserEmail,
  });
};

export const useUpdateUserPassword = () => {
  return useMutation({
    mutationFn: updateUserPassword,
  });
};