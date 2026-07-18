import Highlight from "@/components/ui/Highlight";

// Splits a string on *...* markers and wraps the marked part in <Highlight>
export function parseHighlight(text) {
  const parts = text.split(/\*(.+?)\*/g);
  // Odd-indexed parts are the ones that were between asterisks
  return parts.map((part, i) =>
    i % 2 === 1 ? <Highlight key={i}>{part}</Highlight> : part
  );
}