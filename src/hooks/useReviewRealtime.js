"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useNotificationBatchStore } from "@/store/useNotificationBatchStore";

/**
 * Hook to listen to real-time post creation events over Server-Sent Events (SSE).
 * Automatically enqueues new post notifications into the batch store.
 */
export function useReviewRealtime() {
  const { data: session } = useSession();
  const enqueuePostNotification = useNotificationBatchStore(
    (state) => state.enqueuePostNotification
  );

  const currentUserId = session?.user?.id;
  const currentUserName = session?.user?.displayName || session?.user?.name;

  useEffect(() => {
    if (typeof window === "undefined") return;

    let eventSource = null;
    let reconnectTimer = null;

    function connectStream() {
      try {
        eventSource = new EventSource("/api/reviews/stream");

        eventSource.onmessage = (event) => {
          if (!event.data) return;

          try {
            const postData = JSON.parse(event.data);
            if (postData && postData.id) {
              enqueuePostNotification(postData, currentUserId, currentUserName);
            }
          } catch (e) {
            // Ignore non-JSON or heartbeat frames
          }
        };

        eventSource.onerror = () => {
          // Close and attempt auto-reconnect after 3 seconds if stream drops
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }

          // Clear any existing timer before scheduling a new reconnect
          if (reconnectTimer) clearTimeout(reconnectTimer);
          reconnectTimer = setTimeout(connectStream, 3000);
        };
      } catch (err) {
        console.error("Failed to connect to review stream:", err);
      }
    }

    connectStream();

    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [enqueuePostNotification, currentUserId, currentUserName]);
}
