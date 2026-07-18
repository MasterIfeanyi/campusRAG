"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function useRequireAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Wrap any action in this. If logged in, it runs normally.
  // If not, the user gets sent to sign up instead, with a `next`
  // param so we can send them back to what they were trying to do.
  function requireAuth(action) {
    return (...args) => {
      if (status === "loading") return;

      if (!session) {
        const query = searchParams.toString();
        const fullPath = query ? `${pathname}?${query}` : pathname;
        const next = encodeURIComponent(fullPath);
        router.push(`/login?next=${next}`);
        return;
      }

      action(...args);
    };
  }

  return { session, isLoggedIn: !!session, requireAuth };
}