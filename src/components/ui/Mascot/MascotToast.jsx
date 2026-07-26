import toast from "react-hot-toast";
import Image from "next/image";

function MascotToastContent({ message, visible, variant }) {
  const borderColor =
    variant === "error" ? "var(--destructive)" : "var(--border)";

  return (
    <div
      className={`flex items-center gap-3 bg-card rounded-full shadow-lg px-4 py-2.5 max-w-sm transition-all duration-200 ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
      style={{ border: `1px solid ${borderColor}` }}
    >
      <Image
        src="/images/gist-mascot.png"
        alt=""
        width={48}
        height={48}
        className="shrink-0"
      />
      <p className="text-sm text-foreground leading-none" style={{marginBottom: 0}}>{message}</p>
    </div>
  );
}

export function showMascotToast(message, { variant = "default", ...options } = {}) {
  return toast.custom(
    (t) => <MascotToastContent message={message} visible={t.visible} variant={variant} />,
    {
      duration: 5000,
      position: "top-center",
      ...options,
    }
  );
}