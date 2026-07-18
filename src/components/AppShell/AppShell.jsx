"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import SessionWatcher from "./SessionWatcher";
import NetworkStatusBanner from "./NetworkStatusBanner";
import ScrollToTop from "./ScrollToTop";


export default function AppShell({ children }) {
  const { data: session } = useSession();

  // Dynamic document title based on who's logged in
  useEffect(() => {
    document.title =
      session?.user?.role === "superadmin"
        ? "GIST — Superadmin"
        : "GIST — The most real place on the internet.";
  }, [session]);



  return (
    <>
      <NetworkStatusBanner />
      <SessionWatcher />
      <ScrollToTop />
      {children}
    </>
  );
}