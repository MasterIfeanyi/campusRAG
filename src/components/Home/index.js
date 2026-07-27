"use client";

import { Suspense } from "react";
import FeedArea from "./FeedArea";
import JoinPromoCard from "./JoinPromoCard";
import SourcesPanel from "./SourcesPanel";
import ErrorBoundary from "@/app/_components/ErrorBoundary";
import BatchPostToast from "@/components/ui/Notification/BatchPostToast";
import { useReviewRealtime } from "@/hooks/useReviewRealtime";

export default function Home() {
  // Listen to real-time post notifications across all users via SSE stream
  useReviewRealtime();

  return (
    <Suspense fallback={null}>
      <div className="mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr_280px] gap-8 px-6 h-[calc(100vh-5rem)]">
        {/* Left sidebar: independent scroll */}
        <aside className="hidden md:block overflow-y-auto h-full py-8">
          <JoinPromoCard />
        </aside>

        {/* Center: page routing / home feed, independent scroll */}
        <main className="overflow-y-auto h-full py-8 scrollbar-hide">
          <div className="max-w-150 mx-auto">
            <ErrorBoundary>
              <FeedArea />
            </ErrorBoundary>
          </div>
        </main>

        {/* Right sidebar: sources for the current answer, independent scroll */}
        <aside className="hidden lg:block overflow-y-auto h-full py-8">
          <SourcesPanel />
        </aside>
      </div>

      {/* Batch In-App Post Notification Pill (Mounted on Home page) */}
      <BatchPostToast />
    </Suspense>
  );
}