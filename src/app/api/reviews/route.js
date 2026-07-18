import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createReview, getReviews } from "@/services/reviewService";
import { submitReviewLimiter } from "@/helpers/rateLimiter";
import { authOptions } from "@/lib/authOptions";

export async function POST(req) {
    try {

        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "You must be logged in to post a review." },
                { status: 401 }
            );
        }

        // 1. Rate limiting — protects our AI quota from being spammed
        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const { allowed, remaining } = submitReviewLimiter(ip);

        if (!allowed) {
            return NextResponse.json(
                { error: "Too many requests, please try again later." },
                { status: 429 }
            );
        }

        // 2. Check presence — routes only check presence, not quality
        const { title, body, categories } = await req.json();

        if (!body || typeof body !== "string" || body.trim().length === 0) {
            return NextResponse.json(
                { error: "Review content is required." },
                { status: 400 }
            );
        }

        // 3. call the service `createReview` (sanitizing, validating, embedding, saving) lives in the service
        const review = await createReview({ title, body, categories, userId: session.user.id, });

        return NextResponse.json({
            success: true,
            id: review._id,
            remainingRequests: remaining,
        },
            { status: 201 }
        );
    } catch (err) {
        console.error("Submit review error:", err);

        // Mongoose validation errors are worth surfacing clearly
        if (err.name === "ValidationError") {
            return NextResponse.json(
                { error: "Validation failed.", detail: err.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}

export async function GET() {
  const reviews = await getReviews();
  return NextResponse.json({ success: true, reviews });
}