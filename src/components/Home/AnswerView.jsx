"use client";

import { useFeedStore } from "@/store/useFeedStore";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import Button from "../ui/Button";
import SourcesPanel from "./SourcesPanel";
import Icon from "@/icons/Icon"
import { useTranslate } from "@/hooks/useTranslate";
import MascotState from "@/components/ui/Mascot/Mascot";



import { renderFormattedAnswer } from "@/lib/parseMarkdown";

export default function AnswerView({ isAsking, askError }) {
  const { question, answer, sources, backToFeed } = useFeedStore();
  const dictionary = useTranslate();

  return (
    <div className="py-1 px-6">
      <Button
        type="button"
        bare
        onClick={backToFeed}
        icon={<Icon name="back" size={16} className="text-gray-400 dark:text-gray-500" />}
        className="mb-4"
      >
        <span className="text-sm text-gray-400 dark:text-gray-400">Back</span>
      </Button>
      <p className="text-sm text-muted-foreground mb-3">{question}</p>

      {isAsking && <LoadingIndicator text="Thinking" />}

      {askError && (
        <MascotState
          title={dictionary.mascotStates.askError.title}
          message={dictionary.mascotStates.askError.message}
        />
      )}

      {!isAsking && answer && (
        <div className="text-foreground dark:text-gray-100 leading-relaxed">
          {renderFormattedAnswer(answer)}
        </div>
      )}

      {/* Inline sources, only shown below the lg breakpoint where the sidebar is hidden */}
      <div className="lg:hidden mt-8 pt-6 border-t border-border">
        <SourcesPanel />
      </div>
    </div>
  );
}