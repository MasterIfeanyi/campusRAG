"use client";

import { useState } from "react";
import { useReviews } from "@/hooks/useReviewQueries";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useRouter } from "next/navigation";
import { useTranslate } from "@/hooks/useTranslate";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import ActionMenu from "@/components/ui/ActionMenu/ActionMenu";
import ReportModal from "@/components/Flag/ReportModal";

export default function FeedList() {
  const { data: reviews, isLoading, isError } = useReviews();
  const { requireAuth } = useRequireAuth();
  const router = useRouter();

  if (isLoading) return <LoadingIndicator text="Loading stories" />;
  if (isError) return <p className="text-red-500 py-6 text-center">Could not load stories. Try refreshing.</p>;
  if (!reviews?.length) return <p className="text-gray-400 py-6">No stories yet. Be the first to share one.</p>;

  return (
    <div className="divide-y divide-gray-100">
      {reviews.map((review) => (
        <StoryCard key={review.id} review={review} requireAuth={requireAuth} router={router} />
      ))}
    </div>
  );
}

function StoryCard({ review, requireAuth, router }) {
  const dictionary = useTranslate();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const openStory = requireAuth(() => router.push(`/reviews/${review.id}`));

  // const handleReport = requireAuth(() => setIsReportOpen(true));

  const handleReport = () => setIsReportOpen(true);

  return (
    <div onClick={openStory} className="py-5 px-1 cursor-pointer group">
      <div className="flex items-start justify-between">
        <p className="text-xs text-gray-400">{review.authorDisplayName}</p>

        <div onClick={(e) => e.stopPropagation()}>
          <ActionMenu
            actions={[
              {
                key: "report",
                icon: "flag",
                label: dictionary.actionMenu.report,
                danger: true,
                onClick: handleReport,
              },
            ]}
          />
          <ReportModal
            isShown={isReportOpen}
            onClose={() => setIsReportOpen(false)}
            reviewId={review.id}
          />
        </div>
      </div>
      <h3 className="font-semibold text-gray-900 mt-1 group-hover:text-green-600 transition-colors">
        {review.title}
      </h3>
      <p className="text-gray-500 text-sm mt-1.5 line-clamp-4 leading-relaxed">
        {review.body}
      </p>
    </div>
  );
}