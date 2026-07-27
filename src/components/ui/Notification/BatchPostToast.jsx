"use client";

import Image from "next/image";
import { FiArrowUp, FiX } from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";
import { useNotificationBatchStore } from "@/store/useNotificationBatchStore";

export default function BatchPostToast() {
  const queryClient = useQueryClient();
  const activeBatchToast = useNotificationBatchStore(
    (state) => state.activeBatchToast
  );
  const dismissBatchToast = useNotificationBatchStore(
    (state) => state.dismissBatchToast
  );

  if (!activeBatchToast) return null;

  const { title, avatars } = activeBatchToast;

  const handleRefresh = (e) => {
    e.stopPropagation();
    queryClient.invalidateQueries({ queryKey: ["reviews"] });
    
    // Smooth scroll main container or window to top
    const mainContainer = document.querySelector("main");
    if (mainContainer) {
      mainContainer.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });

    dismissBatchToast();
  };

  const handleDismiss = (e) => {
    e.stopPropagation();
    dismissBatchToast();
  };

  return (
    <div
      onClick={handleRefresh}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-primary text-primary-foreground font-semibold px-4 py-2 rounded-full shadow-lg border border-primary/20 backdrop-blur-md cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 animate-in fade-in slide-in-from-top-4"
    >
      {/* Overlapping Avatar Stack */}
      <div className="flex -space-x-2 overflow-hidden shrink-0">
        {avatars && avatars.length > 0 ? (
          avatars.map((avatar, idx) => (
            <Image
              key={idx}
              src={avatar || "/images/gist-mascot.png"}
              alt="User avatar"
              width={24}
              height={24}
              className="inline-block rounded-full ring-2 ring-primary object-cover w-6 h-6"
            />
          ))
        ) : (
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-sm">
            {title.split(" ")[0].charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Notification Text */}
      <span className="text-xs md:text-sm font-semibold tracking-tight text-white whitespace-nowrap">
        {title}
      </span>

      {/* Up Arrow Icon */}
      <FiArrowUp className="w-4 h-4 text-white/90 shrink-0 ml-0.5" />

      {/* Close Button */}
      <button
        onClick={handleDismiss}
        className="ml-1 text-white/70 hover:text-white p-0.5 rounded-full hover:bg-white/20 transition-colors shrink-0 cursor-pointer"
        aria-label="Dismiss notification"
      >
        <FiX className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
