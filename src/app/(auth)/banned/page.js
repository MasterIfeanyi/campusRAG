"use client";

import MascotState from "@/components/ui/MascotState";
import { useTranslate } from "@/hooks/useTranslate";

export default function BannedPage() {
  const dictionary = useTranslate();
  const t = dictionary.mascotStates.banned;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <MascotState title={t.title} message={t.message} size={200} />
    </div>
  );
}