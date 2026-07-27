import dbConnect from "@/lib/dbConnect";
import Review from "@/models/Review";
import { embedText, generateAnswer } from "@/lib/ai";
import { validateTextLength } from "@/helpers/fn";

export const RELEVANCE_BENCHMARK_THRESHOLD = 0.78;
export const MAX_SCORE_DELTA = 0.08;

/**
 * Evaluates candidates against the relevance benchmark.
 * Requires candidate score to be:
 * 1) >= 0.78 absolute similarity score
 * 2) Within 0.08 of the top matching candidate score (relative gap)
 * Removes all weak or unrelated posts.
 */
export function filterByRelevanceBenchmark(candidates) {
  if (!Array.isArray(candidates) || candidates.length === 0) return [];

  const validCandidates = candidates.filter((item) => typeof item?.score === "number");
  if (validCandidates.length === 0) return [];

  const topScore = Math.max(...validCandidates.map((c) => c.score));
  const effectiveThreshold = Math.max(RELEVANCE_BENCHMARK_THRESHOLD, topScore - MAX_SCORE_DELTA);

  return validCandidates.filter((item) => item.score >= effectiveThreshold);
}

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
        filter: { status: "visible" },
      },
    },
    // show only certain fields and the relevance score
    {
      $project: {
        title: 1,
        body: 1,
        categories: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ]);

  // 3. Relevance Benchmark Evaluation: Filter out posts failing the benchmark threshold (0.68)
  const relevantResults = filterByRelevanceBenchmark(results, RELEVANCE_BENCHMARK_THRESHOLD);

  if (relevantResults.length === 0) {
    return {
      answer: "I don't have any reviews or stories that relate to this question yet.",
      sources: [],
    };
  }

  // 4. Build context chunks for Gemma/LLM from top benchmark-passing matches
  const contextChunks = relevantResults.map((r) => `${r.title}\n${r.body}`);

  // 5. Ask AI to answer using only that retrieved context
  const answer = await generateAnswer(check.cleaned, contextChunks);

  return {
    answer,
    sources: relevantResults.map((r) => ({
      id: r._id,
      title: r.title,
      categories: r.categories,
      author: r.author,
      score: r.score,
    })),
  };
}