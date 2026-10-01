"use client";

import { useState } from "react";

type Props = {
  onAdd: (title: string, details: string) => void;
};

export function AddCardForm({ onAdd }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    onAdd(trimmedTitle, details.trim());
    setTitle("");
    setDetails("");
    setIsOpen(false);
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full rounded-lg border border-dashed border-text-muted/40 py-2 text-center text-xs text-text-muted transition-colors hover:border-primary-blue hover:text-primary-blue"
      >
        + Add card
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-white p-3 shadow-sm">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Card title"
        className="mb-2 w-full rounded border border-text-muted/30 px-2 py-1.5 text-sm outline-none focus:border-primary-blue"
      />
      <textarea
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="Details (optional)"
        rows={2}
        className="mb-2 w-full resize-none rounded border border-text-muted/30 px-2 py-1.5 text-xs outline-none focus:border-primary-blue"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded bg-secondary-purple px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-secondary-purple/90"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setTitle("");
            setDetails("");
          }}
          className="rounded px-3 py-1.5 text-xs text-text-muted transition-colors hover:bg-text-muted/10"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
