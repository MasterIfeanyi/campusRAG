"use client";

import { useParams, useRouter } from "next/navigation";
import { useFetchReview } from "@/hooks/useReviewQueries";
import { useTranslate } from "@/hooks/useTranslate";
import Icon from "@/icons/Icon";
import Button from "@/components/ui/Button";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import MascotState from "@/components/ui/Mascot/Mascot";

export default function ReviewDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const dictionary = useTranslate();
    const t = dictionary.reviewDetail;

    const { data: review, isLoading, isError } = useFetchReview(id);

    if (isLoading) return <LoadingIndicator text="Loading story" />;

    if (isError || !review) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <MascotState title={t.notFoundTitle} message={t.notFoundMessage} />
            </div>
        );
    }


    const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(review.createdAt));


    return (
        <div className="min-h-screen bg-white">
            <div className="sticky top-0 z-10 flex items-center justify-end px-4 py-3 bg-white">
                <Button
                    bare
                    onClick={() => router.back()}
                    icon={<Icon name="close" size={20} className="text-foreground" />}
                />
            </div>

            <article className="max-w-2xl mx-auto px-6 py-12">
                <div className="intro-heading border-b border-gray-100  mb-10">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                        {review.title}
                    </h1>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                            {review.authorDisplayName?.charAt(0) || "?"}
                        </div>

                        <div className="flex flex-col gap-0.5">
                            <p className="text-sm font-medium leading-none text-gray-900">
                                {review.authorDisplayName}
                            </p>
                            <p className="text-xs text-gray-400 leading-none">{formattedDate}</p>
                        </div>
                    </div>

                    <div>
                        {review.categories?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {review.categories.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center text-sm text-white bg-primary rounded-full px-3 py-1"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>




                <div className="font-serif text-lg md:text-xl text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {review.body}
                </div>
            </article>
        </div>
    );
}