"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const startOnboarding = async (data) => {
    try {
        const res = await axios.post("/api/seller/create-onboard", data);
        return res.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.error || "Failed to start the onboarding"
        );
    }
}

const getOnboardingDetails = async (email) => {
    try {
        const res = await axios.get(`/api/seller/create-onboard?seller_id=${email}`);
        return res.data ?? [];
    } catch (error) {
        throw new Error(
            error.response?.data?.error || "Failed to fetch the onboarding details"
        );
    }
}

export const useStartOnboardingProcess = () => {
    return useMutation({
        mutationFn: startOnboarding
    });
}

export const useFetchOnboardingDetails = (email) => {
    return useQuery({
        queryKey: ["seller-onboarding", email],
        queryFn: () => getOnboardingDetails(email),
        enabled: !!email,
        refetchOnWindowFocus: false,
    });
}