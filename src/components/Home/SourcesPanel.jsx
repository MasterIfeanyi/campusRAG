"use client";

import { useFeedStore } from "@/store/useFeedStore";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useRouter } from "next/navigation";

export default function SourcePanel() {
  const { view, sources } = useFeedStore();
  const { requireAuth } = useRequireAuth();
  const router = useRouter();

  // Only show once we actually have an answer with sources
  if (view !== "answer" || sources.length === 0) return null;

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">
        Based on {sources.length} stories
      </p>
      {sources.map((source) => (
        <div
          key={source.id}
          onClick={requireAuth(() => router.push(`/reviews/${source.id}`))}
          className="text-sm py-2 border-b border-border cursor-pointer hover:text-primary"
        >
          {source.title}
        </div>
      ))}
    </div>
  );
}