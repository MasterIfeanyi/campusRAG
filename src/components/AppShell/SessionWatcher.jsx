"use client";

import { useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SessionWatcher() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const wasAuthenticated = useRef(false);

  useEffect(() => {
    if (status === "authenticated") {
      wasAuthenticated.current = true;

      // Banned flag caught while still "authenticated" for one cycle
      if (session?.user?.banned) {
        signOut({ redirect: false }).then(() => {
          router.replace("/banned");
        });
      }
      return;
    }

    if (status === "unauthenticated" && wasAuthenticated.current) {
      wasAuthenticated.current = false;
      router.replace("/login");
    }
  }, [status, session, router]);

  return null;
}