import { postEmitter } from "@/lib/postEmitter";

export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const handleNewPost = (postData) => {
        try {
          const payload = `data: ${JSON.stringify(postData)}\n\n`;
          controller.enqueue(encoder.encode(payload));
        } catch (err) {
          console.error("Error writing to SSE stream:", err);
        }
      };

      // Subscribe to real-time post events
      postEmitter.on("new-post", handleNewPost);

      // Heartbeat every 15 seconds to keep connection alive across proxies
      const heartbeatTimer = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": heartbeat\n\n"));
        } catch (err) {
          clearInterval(heartbeatTimer);
        }
      }, 15000);

      // Clean up listeners when connection closes
      return () => {
        clearInterval(heartbeatTimer);
        postEmitter.off("new-post", handleNewPost);
      };
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
