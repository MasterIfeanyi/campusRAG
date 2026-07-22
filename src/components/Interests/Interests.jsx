"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslate } from "@/hooks/useTranslate";
import { useUpdateInterests } from "@/hooks/useReviewQueries";
import MascotState from "@/components/ui/Mascot/Mascot";
import Icon from "@/icons/Icon";
import { cn } from "@/lib/utils";

const INTEREST_TAGS = [
  { key: "Life", icon: "life" },
  { key: "Drama", icon: "drama" },
  { key: "Science", icon: "science" },
  { key: "Sports", icon: "sports" },
  { key: "Tech", icon: "tech" },
  { key: "Security", icon: "security" },
  { key: "Travel", icon: "travel" },
  { key: "Blogging", icon: "blogging" },
  { key: "Health", icon: "health" },
];

const MIN_INTERESTS = 2;

export default function InterestsPage() {
  const [selected, setSelected] = useState([]);
  const router = useRouter();
  const dictionary = useTranslate();
  const t = dictionary.onboarding.interests;
  const { mutate: saveInterests } = useUpdateInterests();

  // Guards against firing twice if state updates rapidly
  const hasSubmitted = useRef(false);

  useEffect(() => {
    if (selected.length >= MIN_INTERESTS && !hasSubmitted.current) {
      hasSubmitted.current = true;
      saveInterests(selected, {
        onSuccess: () => router.push("/"),
        onError: () => {
          hasSubmitted.current = false; // let them try again on failure
        },
      });
    }
  }, [selected, saveInterests, router]);

  const toggleTag = (key) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((tag) => tag !== key) : [...prev, key]
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <MascotState title={t.title} message={t.subtitle} />

      <div className="grid grid-cols-3 gap-4 max-w-2xl w-full mt-4">
        {INTEREST_TAGS.map(({ key, icon }) => {
          const isSelected = selected.includes(key);
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggleTag(key)}
              className={cn(
                "relative flex flex-col items-start gap-3 rounded-xl border p-5 text-left transition-colors",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <Icon
                name={icon}
                size={22}
                className={isSelected ? "text-primary" : "text-gray-700"}
              />
              <span
                className={cn(
                  "font-medium",
                  isSelected ? "text-primary" : "text-gray-900"
                )}
              >
                {t.tags[key]}
              </span>

              {isSelected && (
                <Icon
                  name="checkCircle"
                  size={20}
                  className="absolute top-3 right-3 text-primary"
                />
              )}
            </button>
          );
        })}
      </div>

      {selected.length === 1 && (
        <p className="text-xs text-gray-400 mt-4">{t.minRequired}</p>
      )}
    </div>
  );
}