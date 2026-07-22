"use client";

import Button from "../Button";

export default function ActionMenuItem({ icon, label, danger, onClick }) {
  return (
    <Button
      variant={danger ? "danger" : "other"}
      size="small"
      icon={icon}
      onClick={onClick}
      className={`w-full justify-start border-0 font-normal ${
        danger ? "bg-transparent! hover:bg-destructive/10! text-destructive!" : "text-foreground!"
      }`}
    >
      {label}
    </Button>
  );
}