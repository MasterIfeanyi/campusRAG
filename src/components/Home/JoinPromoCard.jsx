"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useTranslate } from "@/hooks/useTranslate";
import { parseHighlight } from "@/lib/parseHighlight.jsx";

export default function JoinPromoCard() {
  const { status } = useSession();
  const router = useRouter();
  const dictionary = useTranslate();
  const t = dictionary.promoCard;

  if (status === "authenticated") return null;

  return (
    <div className="relative rounded-2xl overflow-hidden min-h-85">
      {/* Background image layer */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/images/people-laughing.jpg')" }}
      />

      {/* Dark overlay layer */}
      <div
        className="absolute inset-0 z-0"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.89)" }}
      />

      {/* Content layer */}
      <div className="relative z-10 p-6 flex flex-col justify-between h-full min-h-85">
        <div>
          <h2
            className="text-xl font-semibold leading-snug mb-4"
            style={{ color: "var(--primary-foreground)" }}
          >
            {parseHighlight(t.title)}
          </h2>
          <ul className="space-y-2 text-sm" style={{ color: "var(--muted)" }}>
            {t.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <span style={{ color: "var(--primary)" }}>—</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <Button
          onClick={() => router.push("/signup")}
          variant="primary"
          size="large"
          className="mt-6 rounded-full"
        >
          {t.signUpButton}
        </Button>
      </div>
    </div>
  );
}