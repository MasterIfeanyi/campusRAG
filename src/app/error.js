"use client";

import MascotState from "@/components/ui/Mascot/Mascot";
import { useTranslate } from "@/hooks/useTranslate";

export default function Error({ error, reset }) {
  const dictionary = useTranslate();
  const t = dictionary.errorBoundary;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <MascotState
        title={t.title}
        message={t.message}
        actionLabel={t.refresh}
        onAction={() => reset()}
      />
    </div>
  );
}