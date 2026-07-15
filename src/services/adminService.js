import dbConnect from "@/lib/dbConnect";
import Review from "@/models/Review";

// Fetch all reviews that need admin attention
export async function getFlaggedReviews() {
  await dbConnect();

  return Review.find({ status: "under_review" })
    .populate("userId", "displayName") // pulls in the poster's anonymous name only
    .sort({ updatedAt: -1 })
    .lean();
}

// Admin removes a review entirely (soft delete — we keep the record, just hide it)
export async function removeReview(reviewId) {
  await dbConnect();

  const review = await Review.findByIdAndUpdate(
    reviewId,
    { status: "removed" },
    { new: true }
  );

  if (!review) {
    const err = new Error("Review not found.");
    err.name = "NotFoundError";
    throw err;
  }

  return review;
}

// Admin dismisses flags on a review (false alarm — restore to visible)
export async function dismissFlags(reviewId) {
  await dbConnect();

  const review = await Review.findByIdAndUpdate(
    reviewId,
    { status: "visible", flags: [] },
    { new: true }
  );

  if (!review) {
    const err = new Error("Review not found.");
    err.name = "NotFoundError";
    throw err;
  }

  return review;
}