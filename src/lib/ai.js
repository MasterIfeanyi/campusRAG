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
  const context = contextChunks
    .map((chunk, i) => `[Source ${i + 1}]:\n${chunk}`)
    .join("\n\n");

  const prompt = `You are a helpful campus assistant. Answer the student's question using ONLY the reviews/stories below. If the reviews don't contain enough information, say so honestly instead of guessing.

CRITICAL CITATION RULE:
Whenever you state a fact or point from a source, cite it inline using the exact source number in brackets, e.g. [1], [2]. If multiple sources apply, use [1][2].

Reviews/Stories:
${context}

Question: ${question}

Answer:`;

  // Primary Provider: Direct Google Gemini 2.0 Flash API using GOOGLE_GENERATIVE_AI_API_KEY
  if (GOOGLE_GENERATIVE_AI_API_KEY) {
    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_GENERATIVE_AI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 1024,
            },
          }),
        }
      );

      const geminiData = await geminiRes.json();
      if (!geminiData.error) {
        const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) return reply;
      }
    } catch (e) {
      console.warn("Direct Gemini API fallback trigger due to:", e.message);
    }
  }

  // Fallback Provider: OpenRouter
  const candidateModels = [
    process.env.OPENROUTER_MODEL,
    "google/gemini-2.0-flash-001",
    "deepseek/deepseek-r1:free",
    "meta-llama/llama-3.3-70b-instruct",
  ].filter(Boolean);

  let lastError = null;

  for (const model of candidateModels) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Campus RAG",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.5,
          max_tokens: 1024,
        }),
      });

      const data = await response.json();
      if (data.error) {
        lastError = new Error(`OpenRouter (${model}): ${data.error.message || JSON.stringify(data.error)}`);
        continue;
      }

      const reply = data.choices?.[0]?.message?.content;
      if (reply) return reply;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("All AI generation providers failed to respond.");
}