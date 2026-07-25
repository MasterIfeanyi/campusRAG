"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslate } from "@/hooks/useTranslate";
import { showMascotToast } from "@/components/ui/Mascot/MascotToast";

// ---- Fetch functions ----

async function updateInterests(interests) {
    const res = await fetch("/api/user/interests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests }),
    });
    const data = await res.json();
    if (!res.ok) {
        const err = new Error(data.error || "Something went wrong.");
        err.status = res.status;
        throw err;
    }
    return data;
}

async function fetchReviewById(id) {
    const res = await fetch(`/api/reviews/${id}`);
    const data = await res.json();
    if (!res.ok) {
        const err = new Error(data.error || "Something went wrong.");
        err.status = res.status;
        throw err;
    }
    return data.review;
}

async function flagReview({ reviewId, reasonCategory, reasonDetail }) {
    const res = await fetch(`/api/reviews/${reviewId}/flag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reasonCategory, reasonDetail }),
    });
    const data = await res.json();
    if (!res.ok) {
        const err = new Error(data.error || "Something went wrong.");
        err.status = res.status;
        throw err;
    }
    return data;
}

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
    if (!res.ok) {
        const err = new Error(data.error || "Something went wrong.");
        err.status = res.status;
        throw err;
    }
    return data;
}

async function createReview({ title, body, categories }) {
    const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, categories }),
    });
    const data = await res.json();
    if (!res.ok) {
        const err = new Error(data.error || "Something went wrong.");
        err.status = res.status;
        throw err;
    }
    return data;
}

async function fetchUserReviews() {
    const res = await fetch("/api/reviews/user");
    const data = await res.json();
    if (!res.ok) {
        const err = new Error(data.error || "Something went wrong.");
        err.status = res.status;
        throw err;
    }
    return data.reviews || [];
}

async function putReview({ id, title, body, categories }) {
    const res = await fetch(`/api/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, categories }),
    });
    const data = await res.json();
    if (!res.ok) {
        const err = new Error(data.error || "Something went wrong.");
        err.status = res.status;
        throw err;
    }
    return data.review;
}

async function removeReview(id) {
    const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
        const err = new Error(data.error || "Something went wrong.");
        err.status = res.status;
        throw err;
    }
    return data;
}

// ---- Shared error handling ----

// Status codes where the server's message was written for the end user
// and is safe to show as-is (validation, auth, forbidden, not-found, rate-limit).
// 500 (and anything unlisted) falls back to a generic message.
const SAFE_STATUS_CODES = [400, 401, 403, 404, 429];

/** handleMutationError is a small shared helper: if the status is in SAFE_STATUS_CODES,
 * it shows the server's actual message (e.g. "You have already flagged this review,"
 * "Question must be at least 5 characters") via showMascotToast;
 * otherwise it shows your generic fallback. */

function handleMutationError(error, dictionary) {
    const message = SAFE_STATUS_CODES.includes(error.status)
        ? error.message
        : dictionary.toasts.genericError;

    showMascotToast(message, { variant: "error" });
}

// ---- Hooks ----

export function useReviews() {
    return useQuery({
        queryKey: ["reviews"],
        queryFn: fetchReviews,
    });
}

export function useAskQuestion() {
    const dictionary = useTranslate();

    return useMutation({
        mutationFn: postQuestion,
        onError: (error) => handleMutationError(error, dictionary),
    });
}

export function useFlagReview() {
    const dictionary = useTranslate();

    return useMutation({
        mutationFn: flagReview,
        onError: (error) => handleMutationError(error, dictionary),
    });
}

export function useCreateReview() {
    const queryClient = useQueryClient();
    const dictionary = useTranslate();

    return useMutation({
        mutationFn: createReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
            showMascotToast(dictionary.toasts.postCreated);
        },
        onError: (error) => handleMutationError(error, dictionary),
    });
}

export function useUpdateInterests() {
    const dictionary = useTranslate();

    return useMutation({
        mutationFn: updateInterests,
        onError: (error) => handleMutationError(error, dictionary),
    });
}

export function useFetchReview(id) {
    return useQuery({
        queryKey: ["review", id],
        queryFn: () => fetchReviewById(id),
        enabled: !!id,
    });
}

export function useUserReviews() {
    return useQuery({
        queryKey: ["userReviews"],
        queryFn: fetchUserReviews,
    });
}

export function useUpdateReview() {
    const queryClient = useQueryClient();
    const dictionary = useTranslate();

    return useMutation({
        mutationFn: putReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userReviews"] });
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
            showMascotToast(dictionary.toasts.postUpdated);
        },
        onError: (error) => handleMutationError(error, dictionary),
    });
}

export function useDeleteReview() {
    const queryClient = useQueryClient();
    const dictionary = useTranslate();

    return useMutation({
        mutationFn: removeReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userReviews"] });
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
            showMascotToast(dictionary.toasts.postDeleted);
        },
        onError: (error) => handleMutationError(error, dictionary),
    });
}