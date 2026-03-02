"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const loginUser = async (data) => {
  try {
    const res = await axios.post("/api/auth/login", data);
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Login failed"
    );
  }
};

export const useLoginUser = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};