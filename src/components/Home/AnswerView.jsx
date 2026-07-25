"use client";

import { useFeedStore } from "@/store/useFeedStore";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import Button from "../ui/Button";
import SourcesPanel from "./SourcesPanel";
import Icon from "@/icons/Icon"
import { useTranslate } from "@/hooks/useTranslate";
import MascotState from "@/components/ui/Mascot/Mascot";



import Link from "next/link";

function renderAnswerWithCitations(answerText, sources = []) {
  if (!answerText) return null;

  // Matches citation tags like [1], [2], [3]
  const regex = /\[(\d+)\]/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(answerText)) !== null) {
    const textBefore = answerText.substring(lastIndex, match.index);
    if (textBefore) parts.push(textBefore);

    const sourceNum = parseInt(match[1], 10);
    const source = sources.find(
      (s) => s.index === sourceNum || sources.indexOf(s) + 1 === sourceNum
    );

    if (source) {
      parts.push(
        <Link
          key={`${match.index}-${sourceNum}`}
          href={`/reviews/${source.id}`}
          title={source.title}
          className="inline-flex items-center justify-center px-1.5 py-0.5 mx-0.5 text-xs font-semibold rounded bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/25 dark:text-primary dark:hover:bg-primary/35 transition-colors"
        >
          [{sourceNum}]
        </Link>
      );
    } else {
      parts.push(match[0]);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < answerText.length) {
    parts.push(answerText.substring(lastIndex));
  }

  return parts;
}

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
        <div className="text-foreground dark:text-gray-100 leading-relaxed whitespace-pre-wrap">
          {renderAnswerWithCitations(answer, sources)}
        </div>
      )}

      {/* Inline sources, only shown below the lg breakpoint where the sidebar is hidden */}
      <div className="lg:hidden mt-8 pt-6 border-t border-border">
        <SourcesPanel />
      </div>
    </div>
  );
}