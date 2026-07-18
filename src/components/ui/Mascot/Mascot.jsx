"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";

export default function MascotState({
  title,
  message,
  actionLabel,
  onAction,
  size = 160,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <Image
        src="/images/gist-mascot.png"
        alt=""
        width={size}
        height={size}
        priority={false}
      />

      {title && (
        <h3 className="text-lg font-semibold text-foreground mt-4">{title}</h3>
      )}

      {message && (
        <p className="text-sm text-muted-foreground mt-2 max-w-sm">{message}</p>
      )}

      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="medium"
          className="rounded-full mt-6"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}