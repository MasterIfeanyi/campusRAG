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