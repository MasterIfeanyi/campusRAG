"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SessionWatcher() {
  const { status } = useSession();
  const router = useRouter();
  const wasAuthenticated = useRef(false);

  useEffect(() => {
    if (status === "authenticated") {
      wasAuthenticated.current = true;
      return;
    }

    if (status === "unauthenticated" && wasAuthenticated.current) {
      wasAuthenticated.current = false;
      router.replace("/login");
    }
  }, [status, router]);

  return null;
}