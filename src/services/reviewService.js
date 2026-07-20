import dbConnect from "@/lib/dbConnect";
import Review from "@/models/Review";
import { embedText } from "@/lib/ai";
import { sanitizeText, normalizeCategories, validateTextLength } from "@/helpers/fn";

export async function createReview({ title, body, categories, userId }) {
  await dbConnect();

  if (!userId) {
    const err = new Error("You must be logged in to post a review.");
    err.name = "ValidationError";
    throw err;
  }

  const bodyCheck = validateTextLength(body, { min: 10, max: 3000, fieldName: "Review body" });


  if (!bodyCheck.valid) {
    const err = new Error(bodyCheck.error);
    err.name = "ValidationError";
    throw err;
  }

  const cleanTitle = sanitizeText(title || "").slice(0, 150);
  const categoryList = normalizeCategories(categories);

  const textToEmbed = `${cleanTitle}\n${bodyCheck.cleaned}`.trim();
  const embedding = await embedText(textToEmbed);

  const review = await Review.create({
    title: cleanTitle,
    body: bodyCheck.cleaned,
    categories: categoryList,
    userId,
    embedding,
  });

  return review;
}

export async function getReviews(userInterests = []) {
  await dbConnect();

  const reviews = await Review.find({ status: "visible" })
    .populate("userId", "displayName")
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const scored = reviews.map((r) => {
    const overlap = r.categories.filter((tag) => userInterests.includes(tag)).length;
    return { ...r, _matchScore: overlap };
  });

  // Sort by match score first (higher overlap wins), then by recency
  scored.sort((a, b) => {
    if (b._matchScore !== a._matchScore) return b._matchScore - a._matchScore;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return scored.map((r) => ({
    id: r._id,
    title: r.title,
    body: r.body,
    categories: r.categories,
    authorDisplayName: r.userId?.displayName || "Unknown",
    createdAt: r.createdAt,
  }));
}