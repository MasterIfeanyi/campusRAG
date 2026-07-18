"use client";

import { useFeedStore } from "@/store/useFeedStore";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import Button from "../ui/Button";
import SourcesPanel from "./SourcesPanel";
import Icon from "@/icons/Icon"


export default function AnswerView({ isAsking, askError }) {
  const { question, answer, backToFeed } = useFeedStore();

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
      <p className="text-sm text-gray-500 mb-2">{question}</p>

      {isAsking && <LoadingIndicator text="Thinking" />}
      {askError && <p className="text-red-500">{askError}</p>}
      {!isAsking && answer && <p className="text-gray-800 leading-relaxed">{answer}</p>}

      {/* Inline sources, only shown below the lg breakpoint where the sidebar is hidden */}
      <div className="lg:hidden mt-8 pt-6 border-t border-border">
        <SourcesPanel />
      </div>
    </div>
  );
}