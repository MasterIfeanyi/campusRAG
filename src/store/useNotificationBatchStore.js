import { create } from "zustand";

const BATCH_WINDOW_MS = 3000; // 3-second window to batch co-occurring post events

export const useNotificationBatchStore = create((set, get) => {
  let timerId = null;

  return {
    pendingPosts: [],
    activeBatchToast: null,

    /**
     * Enqueues a post notification event.
     * @param {{ id: string, userId?: string, authorName: string, authorAvatar?: string }} post
     * @param {string} [currentUserId] - Logged in user ID
     * @param {string} [currentUserName] - Logged in user display name
     */
    enqueuePostNotification: (post, currentUserId, currentUserName) => {
      // Exclude posts authored by the currently logged-in user
      if (currentUserId && post.userId && String(post.userId) === String(currentUserId)) {
        return;
      }
      if (currentUserName && post.authorName && post.authorName.trim().toLowerCase() === currentUserName.trim().toLowerCase()) {
        return;
      }

      const { pendingPosts } = get();

      // Deduplicate posts by ID
      if (pendingPosts.some((p) => p.id === post.id)) return;

      const updatedPending = [...pendingPosts, post];
      set({ pendingPosts: updatedPending });

      // Reset / start the 3-second debounce batch window timer
      if (timerId) clearTimeout(timerId);

      timerId = setTimeout(() => {
        get().flushNotifications();
      }, BATCH_WINDOW_MS);
    },

    /**
     * Flushes the pending queue into a single aggregated toast banner.
     */
    flushNotifications: () => {
      const { pendingPosts } = get();
      if (pendingPosts.length === 0) return;

      const authors = pendingPosts.map((p) => p.authorName || "Someone");
      const avatars = pendingPosts
        .map((p) => p.authorAvatar)
        .filter(Boolean);

      const count = pendingPosts.length;
      let title = "";

      if (count === 1) {
        title = `${authors[0]} posted a new update`;
      } else if (count === 2) {
        title = `${authors[0]} and ${authors[1]} posted new updates`;
      } else {
        title = `${authors[0]} and ${count - 1} others posted new updates`;
      }

      set({
        activeBatchToast: {
          id: Date.now(),
          title,
          avatars: avatars.slice(0, 3), // Show up to 3 avatars in the stack
          count,
          postIds: pendingPosts.map((p) => p.id),
        },
        pendingPosts: [],
      });

      timerId = null;
    },

    dismissBatchToast: () => set({ activeBatchToast: null }),
  };
});
