import dbConnect from "@/lib/dbConnect";
import Review from "@/models/Review";
import { embedText, generateAnswer } from "@/lib/ai";
import { validateTextLength } from "@/helpers/fn";

export async function askQuestion(question) {
  await dbConnect();

  const check = validateTextLength(question, { min: 5, max: 500, fieldName: "Question" });
  if (!check.valid) {
    const err = new Error(check.error);
    err.name = "ValidationError";
    throw err;
  }

  // 1. Turn the question into an embedding
  const questionEmbedding = await embedText(check.cleaned);

  // 2. Search Atlas for the most relevant reviews using our vector index
  const results = await Review.aggregate([
    {
      $vectorSearch: {
        index: "vector_index",
        path: "embedding",
        queryVector: questionEmbedding,
        numCandidates: 100,
        limit: 5,
      },
    },
    // show only certain fields and the relevance score
    {
      $project: {
        title: 1,
        body: 1,
        categories: 1,
        author: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ]);

  if (results.length === 0) {
    return {
      answer: "I don't have any reviews or stories that relate to this question yet.",
      sources: [],
    };
  }

  // 3. Build context chunks for Gemma from the top matches
  const contextChunks = results.map((r) => `${r.title}\n${r.body}`);

  // 4. Ask Gemma to answer using only that retrieved context
  const answer = await generateAnswer(check.cleaned, contextChunks);

  return {
    answer,
    sources: results.map((r) => ({
      id: r._id,
      title: r.title,
      categories: r.categories,
      author: r.author,
      score: r.score,
    })),
  };
}