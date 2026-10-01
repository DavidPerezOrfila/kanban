"use client";

import { useState, useRef, useEffect } from "react";

type Props = {
  title: string;
  onRename: (newTitle: string) => void;
};

export function RenameColumnInput({ title, onRename }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.select();
    }
  }, [isEditing]);

  function handleConfirm() {
    const trimmed = value.trim();
    if (trimmed && trimmed !== title) {
      onRename(trimmed);
    } else {
      setValue(title);
    }
    setIsEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleConfirm();
    } else if (e.key === "Escape") {
      setValue(title);
      setIsEditing(false);
    }
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleConfirm}
        onKeyDown={handleKeyDown}
        className="w-full rounded border border-primary-blue bg-white px-2 py-0.5 text-sm font-semibold text-foreground outline-none"
      />
    );
  }

  return (
    <button
      type="button"
      data-testid="column-title"
      onClick={() => setIsEditing(true)}
      className="cursor-pointer truncate rounded px-1 py-0.5 text-left text-sm font-semibold text-white transition-colors hover:bg-white/10"
    >
      {title}
    </button>
  );
}
