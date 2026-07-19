"use client";

import { useState } from "react";
import { useFeedStore } from "@/store/useFeedStore";
import { useCreateReview } from "@/hooks/useReviewQueries";
import { useTranslate } from "@/hooks/useTranslate";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import Icon from "@/icons/Icon";
import TagPopover from "../ui/Tags/Popover";

export default function CreatePost() {
    const backToFeed = useFeedStore((state) => state.backToFeed);
    const { mutate: createReview, isPending } = useCreateReview();
    const dictionary = useTranslate();

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [tags, setTags] = useState([]); // wired up fully in step 3

    const canSubmit =
        title.trim().length > 0 && body.trim().length > 0 && tags.length > 0;

    function handleSubmit() {
        if (!canSubmit) return;
        createReview(
            { title: title.trim(), body: body.trim(), categories: tags },
            { onSuccess: backToFeed }
        );
    }

    return (
        <div className="py-1 px-6">
            <Button
                type="button"
                bare
                onClick={backToFeed}
                icon={<Icon name="back" size={16} className="text-gray-400" />}
                className="mb-4"
            >
                <span className="text-sm text-gray-400">Back</span>
            </Button>

            <div className="border border-border rounded-2xl p-3 flex flex-col min-h-[500px]">
                <Input
                    id="post-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    bare
                    className="text-lg px-3 font-medium text-foreground placeholder:text-muted-foreground"
                />

                <TextArea
                    id="post-body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write about your experience"
                    rows={12}
                    className="flex-1 border-0 scrollbar-hide focus:ring-0! focus:border-border! px-0 resize-none mt-0"
                />

                <div className="flex items-center justify-between mt-4">
                    <TagPopover tags={tags} setTags={setTags} />

                    {/* Submit button — needs a "send" icon added to the registry first */}
                    <Button
                        bare
                        onClick={handleSubmit}
                        disabled={!canSubmit || isPending}
                        loading={isPending}
                        className="w-11 h-11 rounded-full bg-primary hover:bg-primary-dark flex items-center justify-center"
                        icon={<Icon name="send" size={18} className="text-white" />}
                    />
                </div>
            </div>
        </div>
    );
}