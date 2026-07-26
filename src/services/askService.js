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

  // 3. Filter vector search results by minimum relevance similarity threshold (0.65)
  const MIN_SIMILARITY_SCORE = 0.65;
  const relevantResults = results.filter((r) => (r.score ?? 1) >= MIN_SIMILARITY_SCORE);

  if (relevantResults.length === 0) {
    return {
      answer: "I don't have any reviews or stories that relate to this question yet.",
      sources: [],
    };
  }

  // 4. Build context chunks for Gemma/LLM from top relevant matches
  const contextChunks = relevantResults.map((r) => `${r.title}\n${r.body}`);

  // 5. Ask AI to answer using only that retrieved context
  const answer = await generateAnswer(check.cleaned, contextChunks);

  // 6. Extract cited source numbers (e.g. [1], [2]) from the AI answer
  const citedIndices = new Set(
    [...answer.matchAll(/\[(\d+)\]/g)].map((m) => parseInt(m[1], 10))
  );

  // 7. Only return sources that were actually cited in the generated answer
  const citedResults = citedIndices.size > 0
    ? relevantResults.filter((_, idx) => citedIndices.has(idx + 1))
    : [];

  return {
    answer,
    sources: citedResults.map((r) => {
      const origIdx = relevantResults.indexOf(r);
      return {
        index: origIdx + 1,
        id: r._id,
        title: r.title,
        categories: r.categories,
        author: r.author,
        score: r.score,
      };
    }),
  };
}