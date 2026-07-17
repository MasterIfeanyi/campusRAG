"use client";

import { useFeedStore } from "@/store/useFeedStore";
import FeedList from "./FeedList";
import AnswerView from "./AnswerView";

const VIEWS = {
  feed: FeedList,
  answer: AnswerView,
};

export default function FeedArea() {
  const view = useFeedStore((state) => state.view);
  const ActiveView = VIEWS[view] || FeedList;

  return <ActiveView />;
}