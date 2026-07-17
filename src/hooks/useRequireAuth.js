"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useRequireAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Wrap any action in this. If logged in, it runs normally.
  // If not, the user gets sent to sign up instead, with a `next`
  // param so we can send them back to what they were trying to do.
  function requireAuth(action) {
    return (...args) => {
      if (status === "loading") return; // session still resolving, don't act yet

      if (!session) {
        const next = encodeURIComponent(window.location.pathname);
        router.push(`/signup?next=${next}`);
        return;
      }

      action(...args);
    };
  }

  return { session, isLoggedIn: !!session, requireAuth };
}