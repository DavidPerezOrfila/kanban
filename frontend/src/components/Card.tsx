"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card as CardType } from "@/lib/types";

type Props = {
  card: CardType;
  onDelete: (cardId: string) => void;
};

export function Card({ card, onDelete }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      data-testid={`card-${card.id}`}
      className="group rounded-lg bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-foreground">{card.title}</h4>
        <button
          type="button"
          data-testid={`delete-card-${card.id}`}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onDelete(card.id)}
          className="shrink-0 rounded p-1 text-text-muted opacity-0 transition-opacity hover:bg-accent-yellow/10 hover:text-secondary-purple group-hover:opacity-100"
          aria-label={`Delete ${card.title}`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 3.5L11 11.5M11 3.5L3 11.5" />
          </svg>
        </button>
      </div>
      <p className="mt-1 text-xs text-text-muted">{card.details}</p>
    </article>
  );
}
