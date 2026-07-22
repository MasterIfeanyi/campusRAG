"use client";

import { useState, useRef, useEffect } from "react";
import Button from "../Button";
import Icon from "@/icons/Icon";
import ActionMenuItem from "./ActionMenuItem";

export default function ActionMenu({ actions = [], trigger, align = "right" }) {
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

  const runAction = (onClick) => {
    setOpen(false);
    if (onClick) onClick();
  };

  const toggle = () => setOpen((prev) => !prev);

  const visibleActions = actions.filter((action) => typeof action.onClick === "function");

  if (visibleActions.length === 0) return null;

  // Default trigger, used only if the caller doesn't pass their own
  const defaultTrigger = (
    <Button
      variant="other"
      size="small"
      icon={<Icon name="moreVertical" />}
      onClick={toggle}
      className="px-1.5! border-0"
    />
  );

  return (
    <div className="relative inline-block" ref={menuRef}>
      {trigger ? trigger({ open, toggle }) : defaultTrigger}

      {open && (
        <div
          role="menu"
          className={`absolute ${align === "right" ? "right-0" : "left-0"} mt-1 w-52 bg-card border border-border rounded-lg shadow-lg py-1 z-50`}
        >
          {visibleActions.map((action) => (
            <div key={action.key}>
              {action.dividerBefore && <div className="my-1 border-t border-gray-100" />}
              <ActionMenuItem
                icon={<Icon name={action.icon} />}
                label={action.label}
                danger={action.danger}
                onClick={() => runAction(action.onClick)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}