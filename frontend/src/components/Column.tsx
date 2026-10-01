"use client";

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import type { Column as ColumnType, Card as CardType } from "@/lib/types";
import { Card } from "./Card";
import { AddCardForm } from "./AddCardForm";
import { RenameColumnInput } from "./RenameColumnInput";

type Props = {
  column: ColumnType;
  cards: CardType[];
  onAddCard: (columnId: string, title: string, details: string) => void;
  onDeleteCard: (cardId: string) => void;
  onRenameColumn: (columnId: string, title: string) => void;
};

export function Column({ column, cards, onAddCard, onDeleteCard, onRenameColumn }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <section
      data-testid={`column-${column.id}`}
      className={`flex min-w-[280px] flex-col rounded-xl shadow-sm transition-colors ${
        isOver ? "ring-2 ring-accent-yellow bg-accent-yellow/5" : "bg-background"
      }`}
    >
      <header className="rounded-t-xl bg-navy-dark px-4 py-3">
        <RenameColumnInput
          title={column.title}
          onRename={(newTitle) => onRenameColumn(column.id, newTitle)}
        />
        <span className="mt-1 block text-xs text-white/60">
          {cards.length} {cards.length === 1 ? "card" : "cards"}
        </span>
      </header>
      <SortableContext items={column.cardIds} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
          {cards.map((card) => (
            <Card key={card.id} card={card} onDelete={onDeleteCard} />
          ))}
        </div>
      </SortableContext>
      <AddCardForm onAdd={(title, details) => onAddCard(column.id, title, details)} />
    </section>
  );
}
