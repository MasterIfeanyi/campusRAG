"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslate } from "@/hooks/useTranslate";

export default function NetworkStatusBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const dictionary = useTranslate();

  useEffect(() => {
    function goOffline() { setIsOffline(true); }
    function goOnline() { setIsOffline(false); }
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-yellow-500 text-black text-sm text-center py-1.5 fixed top-0 left-0 right-0 z-[200] flex items-center justify-center gap-2">
      <Image
        src="/images/gist-mascot.png"
        alt=""
        width={20}
        height={20}
      />
      {dictionary.networkStatus.offline}
    </div>
  );
}