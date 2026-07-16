"use client";

import { useState, useRef, useEffect } from "react";
import Button from "./Button";
import Icon from "@/icons/Icon";
import ActionMenuItem from "./ActionMenuItem";
import { useTranslate } from "@/hooks/useTranslate";

export default function ActionMenu({
  onStar,
  onMarkUnread,
  onRename,
  onAddToProject,
  onDelete,
}) {
  const dictionary = useTranslate();
  const t = dictionary.actionMenu;

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    function handleEscape(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const runAction = (action) => {
    setOpen(false);
    if (action) action();
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <Button
        variant="other"
        size="small"
        icon={<Icon name="moreVertical" />}
        onClick={() => setOpen((prev) => !prev)}
        className="px-1.5! border-0"
      />

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
        >
          <ActionMenuItem icon={<Icon name="star" />} label={t.star} onClick={() => runAction(onStar)} />
          <ActionMenuItem icon={<Icon name="eyeOff" />} label={t.markUnread} onClick={() => runAction(onMarkUnread)} />
          <ActionMenuItem icon={<Icon name="edit" />} label={t.rename} onClick={() => runAction(onRename)} />
          <ActionMenuItem
            icon={<Icon name="addToProject" />}
            label={t.addToProject}
            onClick={() => runAction(onAddToProject)}
          />

          <div className="my-1 border-t border-gray-100" />

          <ActionMenuItem icon={<Icon name="trash" />} label={t.delete} danger onClick={() => runAction(onDelete)} />
        </div>
      )}
    </div>
  );
}