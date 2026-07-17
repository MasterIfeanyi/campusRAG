import { create } from "zustand";

export const useFeedStore = create((set) => ({
  view: "feed", // "feed" | "answer"
  question: "",
  answer: "",
  sources: [],
  isAsking: false,
  error: null,

  askQuestion: async (question) => {
    set({ view: "answer", question, isAsking: true, error: null, answer: "", sources: [] });

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();

      if (!res.ok) {
        set({ error: data.error || "Something went wrong.", isAsking: false });
        return;
      }

      set({ answer: data.answer, sources: data.sources, isAsking: false });
    } catch (err) {
      set({ error: "Network error. Please try again.", isAsking: false });
    }
  },

  backToFeed: () => set({ view: "feed", question: "", answer: "", sources: [], error: null }),
}));