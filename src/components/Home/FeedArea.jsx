"use client";

import { useFeedStore } from "@/store/useFeedStore";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import Button from "@/components/ui/Button";
import Icon from "@/icons/Icon";
import FeedList from "./FeedList";
import AnswerView from "./AnswerView";
import CreatePost from "./CreatePost";

const VIEWS = {
  feed: FeedList,
  answer: AnswerView,
  createPost: CreatePost,
};

export default function FeedArea() {
  const view = useFeedStore((state) => state.view);
  const showCreatePost = useFeedStore((state) => state.showCreatePost);
  const { requireAuth } = useRequireAuth();
  const ActiveView = VIEWS[view] || FeedList;

  const handleCreatePost = requireAuth(showCreatePost);

  return (
    <div className="relative min-h-full">
      <ActiveView />

      {view !== "createPost" && view !=="answer" && (
        <div className="sticky bottom-2 flex justify-end pointer-events-none">
          <Button
            bare
            onClick={handleCreatePost}
            icon={<Icon name="edit" size={20} className="text-white" />}
            className="pointer-events-auto w-14 h-14 rounded-full bg-primary hover:bg-primary-dark shadow-lg flex items-center justify-center"
          />
        </div>
      )}
    </div>
  );
}