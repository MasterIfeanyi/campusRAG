"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
// ---- Fetch functions (kept separate from the hooks for clarity) ----

async function fetchReviews() {
    const res = await fetch("/api/reviews");
    if (!res.ok) throw new Error("Failed to load stories.");
    const data = await res.json();
    return data.reviews || [];
}

async function postQuestion(question) {
    const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error("Something went wrong.");
    return data;
}

// ---- Hooks ----

export function useReviews() {
    return useQuery({
        queryKey: ["reviews"],
        queryFn: fetchReviews,
    });
}

export function useAskQuestion() {
    return useMutation({
        mutationFn: postQuestion,
        onError: (error) => {
            toast.error(error.message);
        },
    });
}