"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useUserReviews, useUpdateReview, useDeleteReview } from "@/hooks/useReviewQueries";
import { useTranslate } from "@/hooks/useTranslate";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import Modal from "@/components/ui/Modal";
import Icon from "@/icons/Icon";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import MascotState from "@/components/ui/Mascot/Mascot";
import TagPopover from "@/components/ui/Tags/Popover";

export default function Profile() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const dictionary = useTranslate();
    const t = dictionary.profile;

    const { data: reviews, isLoading, isError } = useUserReviews();

    // Redirect will be performed after data hooks via useEffect
    useEffect(() => {
      if (status === "unauthenticated") {
        router.push("/login");
      }
    }, [status, router]);

    if (status === "unauthenticated") {
      return null;
    }

    if (status === "loading" || isLoading) {
        return <LoadingIndicator text="Loading your stories" />;
    }

    if (isError) {
        const errT = dictionary.mascotStates.loadError;
        return <MascotState title={errT.title} message={errT.message} />;
    }

    const displayName = session?.user?.displayName || "User";
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Profile header */}
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
                    <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xl font-bold shrink-0">
                        {initial}
                    </div>
                    <div>
                        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">{displayName}</h1>
                        <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                            {reviews?.length || 0} {reviews?.length === 1 ? "story" : "stories"}
                        </p>
                    </div>
                </div>

                {/* Section title */}
                <h2 className="text-lg font-semibold text-foreground mb-4">{t.title}</h2>

                {/* Posts */}
                {!reviews?.length ? (
                    <MascotState title={t.emptyTitle} message={t.emptyMessage} />
                ) : (
                    <div className="divide-y divide-border">
                        {reviews.map((review) => (
                            <ProfilePostCard key={review.id} review={review} t={t} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ProfilePostCard({ review, t }) {
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const { mutate: updateReview, isPending: isUpdating } = useUpdateReview();
    const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview();

    const [editTitle, setEditTitle] = useState(review.title);
    const [editBody, setEditBody] = useState(review.body);
    const [editTags, setEditTags] = useState(review.categories || []);

    const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(review.createdAt));

    function handleStartEdit() {
        setEditTitle(review.title);
        setEditBody(review.body);
        setEditTags(review.categories || []);
        setIsEditing(true);
    }

    function handleCancelEdit() {
        setIsEditing(false);
    }

    function handleSave() {
        if (!editBody.trim()) return;
        updateReview(
            { id: review.id, title: editTitle.trim(), body: editBody.trim(), categories: editTags },
            { onSuccess: () => setIsEditing(false) }
        );
    }

    function handleDelete() {
        deleteReview(review.id, {
            onSuccess: () => setShowDeleteConfirm(false),
        });
    }

    const canSave = editBody.trim().length > 0 && editTags.length > 0;

    if (isEditing) {
        return (
            <div className="py-5">
                <div className="border border-border rounded-2xl p-4">
                    <Input
                        id={`edit-title-${review.id}`}
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Title"
                        bare
                        className="text-lg px-1 font-medium text-foreground placeholder:text-muted-foreground"
                    />

                    <TextArea
                        id={`edit-body-${review.id}`}
                        value={editBody}
                        onChange={(e) => setEditBody(e.target.value)}
                        placeholder="Write about your experience"
                        rows={8}
                        className="flex-1 border-0 scrollbar-hide focus:ring-0! focus:border-border! px-0 resize-none mt-0"
                    />

                    <div className="flex items-center justify-between mt-2">
                        <TagPopover tags={editTags} setTags={setEditTags} />

                        <div className="flex items-center gap-2">
                            <Button
                                variant="secondary"
                                size="small"
                                className="rounded-full"
                                onClick={handleCancelEdit}
                                disabled={isUpdating}
                            >
                                {t.cancel}
                            </Button>
                            <Button
                                variant="primary"
                                size="small"
                                className="rounded-full"
                                onClick={handleSave}
                                disabled={!canSave || isUpdating}
                                loading={isUpdating}
                            >
                                {isUpdating ? t.saving : t.save}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-5 group">
            <div className="flex items-start justify-between">
                <p className="text-xs text-muted-foreground">{formattedDate}</p>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        bare
                        onClick={handleStartEdit}
                        icon={<Icon name="edit" size={14} className="text-muted-foreground" />}
                        className="p-1.5 rounded-md hover:bg-muted"
                    />
                    <Button
                        bare
                        onClick={() => setShowDeleteConfirm(true)}
                        icon={<Icon name="trash" size={14} className="text-destructive" />}
                        className="p-1.5 rounded-md hover:bg-destructive/10"
                    />
                </div>
            </div>

            <h3 className="font-semibold text-foreground mt-1">{review.title}</h3>

            <p className="text-muted-foreground text-sm mt-1.5 line-clamp-4 leading-relaxed">
                {review.body}
            </p>

            {review.categories?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                    {review.categories.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center text-xs text-white bg-primary rounded-full px-2.5 py-0.5"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Delete confirmation modal */}
            <Modal isShown={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
                <div className="bg-card rounded-2xl p-6 max-w-sm mx-auto mt-20 shadow-xl border border-border">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                            <Icon name="trash" size={18} className="text-destructive" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">{t.deleteConfirmTitle}</h3>
                    </div>

                    <p className="text-sm text-muted-foreground mb-6">
                        {t.deleteConfirmMessage}
                    </p>

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            size="medium"
                            className="rounded-full"
                            onClick={() => setShowDeleteConfirm(false)}
                            disabled={isDeleting}
                        >
                            {t.cancel}
                        </Button>
                        <Button
                            variant="danger"
                            size="medium"
                            className="rounded-full"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            loading={isDeleting}
                        >
                            {isDeleting ? t.deleting : t.deleteConfirm}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}