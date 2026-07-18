"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useTranslate } from "@/hooks/useTranslate";

export default function WelcomeScreen() {
  const dictionary = useTranslate();
  const t = dictionary.auth.landing;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      {/* Left: full-bleed image */}
      <div className="relative hidden md:block">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right: centered content */}
      <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
        <Image
          src="/images/gist-logo.png"
          alt="GIST"
          width={140}
          height={140}
          priority
        />

        <p className="text-lg text-foreground mt-3 mb-8">{t.tagline}</p>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="primary" size="medium" className="rounded-full px-8">
              {t.nav.logIn}
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              variant="ghost"
              size="medium"
              className="rounded-full px-8 border border-primary"
            >
              {t.nav.signUp}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}