"use client";

import { useFeedStore } from "@/store/useFeedStore";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useRouter } from "next/navigation";
import LoadingIndicator from "@/components/ui/LoadingIndicator";

export default function AnswerView({ isAsking, askError }) {
  const { question, answer, sources, backToFeed } = useFeedStore();
  const { requireAuth } = useRequireAuth();
  const router = useRouter();

  return (
    <div className="flex gap-6 p-6">
      <div className="flex-1">
        <button onClick={backToFeed} className="text-sm text-gray-400 mb-4">
          ← Back to feed
        </button>
        <p className="text-sm text-gray-500 mb-2">You asked:</p>
        <h2 className="text-xl font-semibold mb-4">{question}</h2>

        {isAsking && <LoadingIndicator text="Thinking" />}
        {askError && <p className="text-red-500">{askError}</p>}
        {!isAsking && answer && <p className="text-gray-800 leading-relaxed">{answer}</p>}
      </div>

      {sources.length > 0 && (
        <aside className="w-64 border-l border-gray-100 pl-6">
          <p className="text-xs text-gray-400 mb-2">Based on {sources.length} stories</p>
          {sources.map((source) => (
            <div
              key={source.id}
              onClick={requireAuth(() => router.push(`/reviews/${source.id}`))}
              className="text-sm py-2 border-b border-gray-50 cursor-pointer hover:text-green-600"
            >
              {source.title}
            </div>
          ))}
        </aside>
      )}
    </div>
  );
}