"use client";

import { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Icon from "@/icons/Icon";

const MAX_TAGS = 3;

export default function TagPopover({ tags, setTags }) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const popoverRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function addTag() {
    const clean = inputValue.trim().toLowerCase();
    if (!clean || tags.includes(clean) || tags.length >= MAX_TAGS) return;
    setTags([...tags, clean]);
    setInputValue("");
  }

  function removeTag(tag) {
    setTags(tags.filter((t) => t !== tag));
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  }

  return (
    <div className="relative" ref={popoverRef}>
      <Button
        bare
        onClick={() => setOpen((prev) => !prev)}
        icon={<Icon name="moreVertical" size={20} className="text-gray-400" />}
      />

      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-border rounded-2xl shadow-lg p-4 z-50">
          <Input
            id="post-tag-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add tag"
            bare
            disabled={tags.length >= MAX_TAGS}
            className="text-sm text-foreground placeholder:text-muted-foreground"
          />

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-sm text-white bg-primary rounded-full px-3 py-1"
                >
                  {tag}
                  <Button
                    bare
                    type="button"
                    onClick={() => removeTag(tag)}
                    aria-label={`Remove ${tag}`}
                  >
                    <Icon name="close" size={12} className="text-white" />
                  </Button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}