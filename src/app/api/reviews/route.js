import { NextResponse } from "next/server";
import { createReview } from "@/services/reviewService";
import { submitReviewLimiter } from "@/helpers/rateLimiter";

export async function POST(req) {
    try {

        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const { allowed } = submitReviewLimiter(ip);

        if (!allowed) {
            return NextResponse.json(
                { error: "Too many requests, please try again later." },
                { status: 429 }
            );
        }

        const { title, body, categories, author } = await req.json();

        if (!body || body.trim().length === 0) {
            return NextResponse.json(
                { error: "Review content is required." },
                { status: 400 }
            );
        }

        const review = await createReview({ title, body, categories, author });

        return NextResponse.json({
            success: true,
            id: review._id,
        });
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