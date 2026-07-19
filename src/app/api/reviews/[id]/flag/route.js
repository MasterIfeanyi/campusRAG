import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { flagReview } from "@/services/flagService";
import { apiLimiter } from "@/helpers/rateLimiter";
import { authOptions } from "@/lib/authOptions";

export async function POST(req, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "You must be logged in to flag a review." },
                { status: 401 }
            );
        }

        const ip = req.headers.get("x-forwarded-for") || "unknown";
        const { allowed } = apiLimiter(ip);

        if (!allowed) {
            return NextResponse.json(
                { error: "Too many requests, please try again later." },
                { status: 429 }
            );
        }

        const { reasonCategory, reasonDetail } = await req.json();
        const { id } = await params;

        const result = await flagReview({
            reviewId: id,
            userId: session.user.id,
            reasonCategory,
            reasonDetail,
        });

        return NextResponse.json({ success: true, ...result });
    } catch (err) {
        console.error("Flag review error:", err);

        if (err.name === "NotFoundError") {
            return NextResponse.json({ error: err.message }, { status: 404 });
        }
        if (err.name === "ValidationError") {
            return NextResponse.json({ error: err.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}