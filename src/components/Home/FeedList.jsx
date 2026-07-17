"use client";

import { useReviews } from "@/hooks/useReviewQueries";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useRouter } from "next/navigation";
import LoadingIndicator from "@/components/ui/LoadingIndicator";

export default function FeedList() {
  const { data: reviews, isLoading, isError } = useReviews();
  const { requireAuth } = useRequireAuth();
  const router = useRouter();

  if (isLoading) return <LoadingIndicator text="Loading stories" />;
  if (isError) return <p className="text-red-500 p-6">Could not load stories. Try refreshing.</p>;

  return (
    <div className="divide-y divide-gray-100">
      {reviews.map((review) => (
        <StoryCard key={review.id} review={review} requireAuth={requireAuth} router={router} />
      ))}
    </div>
  );
}

function StoryCard({ review, requireAuth, router }) {
  const openStory = requireAuth(() => router.push(`/reviews/${review.id}`));

  return (
    <div onClick={openStory} className="py-4 px-6 cursor-pointer hover:bg-gray-50">
      <p className="text-xs text-gray-400">{review.authorDisplayName}</p>
      <h3 className="font-semibold text-gray-900">{review.title}</h3>
      <p className="text-gray-600 text-sm line-clamp-3 mt-1">{review.body}</p>
    </div>
  );
}