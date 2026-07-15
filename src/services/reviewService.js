import dbConnect from "@/lib/dbConnect";
import Review from "@/models/Review";
import { embedText } from "@/lib/ai";
import { normalizeCategories } from "@/helpers/fn";


// Creates a new review: embeds it, then saves it via the strict Review model
export async function createReview({ title, body, categories, author }) {
  await dbConnect();

  const categoryList = normalizeCategories(categories);
  const textToEmbed = `${title || ""}\n${body}`.trim();
  const embedding = await embedText(textToEmbed);

  const review = await Review.create({
    title: title || "",
    body,
    categories: categoryList,
    author: author || "Anonymous",
    embedding,
  });

  return review;
}