"use client";

import { useFeedStore } from "@/store/useFeedStore";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useRouter } from "next/navigation";
import { useTranslate } from "@/hooks/useTranslate";

export default function SourcePanel() {
  const { view, sources } = useFeedStore();
  const { requireAuth } = useRequireAuth();
  const router = useRouter();
  const dictionary = useTranslate();
  const t = dictionary.sourcePanel;

  if (view !== "answer" || sources.length === 0) return null;

  const count = sources.length;
  const label = (count === 1 ? t.basedOnStory : t.basedOnStories).replace(
    "{count}",
    count
  );

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">{label}</p>

      <div className="flex flex-row gap-8 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
        {sources.map((source, idx) => (
          <div
            key={source.id}
            onClick={requireAuth(() => router.push(`/reviews/${source.id}`))}
            className="shrink-0 w-48 lg:w-auto lg:shrink text-sm py-2 px-3 lg:px-0 rounded-lg lg:rounded-none border border-border lg:border-0 lg:border-b lg:border-border cursor-pointer hover:text-primary flex items-center gap-2"
          >
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary dark:bg-primary/25 dark:text-primary shrink-0">
              [{source.index || idx + 1}]
            </span>
            <span className="truncate text-foreground dark:text-gray-200">{source.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}