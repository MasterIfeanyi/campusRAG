import dbConnect from "@/lib/dbConnect";
import Review from "@/models/Review";
import { sanitizeText } from "@/helpers/fn";

const FLAG_THRESHOLD = 3;

const VALID_REASONS = ["spam", "hate_speech", "impersonation", "false_accusations", "harassment", "other"];

export async function flagReview({ reviewId, userId, reasonCategory, reasonDetail }) {
    await dbConnect();

    if (!VALID_REASONS.includes(reasonCategory)) {
        const err = new Error("A valid flag reason is required.");
        err.name = "ValidationError";
        throw err;
    }

    const review = await Review.findById(reviewId);
    if (!review) {
        const err = new Error("Review not found.");
        err.name = "NotFoundError";
        throw err;
    }

    const alreadyFlagged = review.flags.some((f) => f.userId.toString() === userId);
    if (alreadyFlagged) {
        const err = new Error("You have already flagged this review.");
        err.name = "ValidationError";
        throw err;
    }

    review.flags.push({
        userId,
        reasonCategory,
        reasonDetail: sanitizeText(reasonDetail || "").slice(0, 300),
    });

    if (review.flags.length >= FLAG_THRESHOLD && review.status === "visible") {
        review.status = "under_review";
    }

    await review.save();

    return {
        flagCount: review.flags.length,
        status: review.status,
    };
}