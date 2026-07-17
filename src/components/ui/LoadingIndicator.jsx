export default function LoadingIndicator({ text = "Loading" }) {
  return (
    <div className="flex items-center gap-2 p-6 text-gray-400">
      <span className="relative flex h-4 w-4">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-50" />
        <span className="relative inline-flex h-4 w-4 rounded-full bg-green-500" />
      </span>
      <span className="text-sm">
        {text}
        <AnimatedDots />
      </span>
    </div>
  );
}

function AnimatedDots() {
  return (
    <span className="inline-flex">
      <span className="animate-bounce [animation-delay:-0.3s]">.</span>
      <span className="animate-bounce [animation-delay:-0.15s]">.</span>
      <span className="animate-bounce">.</span>
    </span>
  );
}