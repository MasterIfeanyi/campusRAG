import { create } from "zustand";

export const useFeedStore = create((set) => ({
  view: "feed", // "feed" | "answer"
  question: "",
  answer: "",
  sources: [],

  showAnswer: (question, answer, sources) =>
    set({ view: "answer", question, answer, sources }),

  showCreatePost: () => set({ view: "createPost" }),

  backToFeed: () => set({ view: "feed", question: "", answer: "", sources: [] }),
}));