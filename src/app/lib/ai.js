const GOOGLE_GENERATIVE_AI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Turns text into a list of numbers representing its "meaning"
export async function embedText(text) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${GOOGLE_GENERATIVE_AI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: { parts: [{ text }] },
        outputDimensionality: 3072,
      }),
    }
  );

  const data = await response.json();
  return data.embedding.values;
}

// Takes a question + relevant review snippets, returns Gemma's answer via OpenRouter
export async function generateAnswer(question, contextChunks) {
  const context = contextChunks.join("\n\n");

  const prompt = `You are a helpful campus assistant. Answer the student's question using ONLY the reviews/stories below. If the reviews don't contain enough information, say so honestly instead of guessing.

Reviews/Stories:
${context}

Question: ${question}

Answer:`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "Campus RAG",
    },
    body: JSON.stringify({
      model: "google/gemma-4-26b-a4b-it:free",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 1024,
    }),
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content;

  if (!reply) {
    throw new Error("Empty response from model.");
  }

  return reply;
}