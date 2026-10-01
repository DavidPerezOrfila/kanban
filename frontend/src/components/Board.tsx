"use client";

import { useCallback, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import type { Board as BoardType, Card as CardType } from "@/lib/types";
import { Column } from "./Column";

type Props = {
  board: BoardType;
  onAddCard: (columnId: string, title: string, details: string) => void;
  onDeleteCard: (cardId: string) => void;
  onRenameColumn: (columnId: string, title: string) => void;
  onMoveCard: (cardId: string, fromColumnId: string, toColumnId: string, toIndex?: number) => void;
};

export function Board({ board, onAddCard, onDeleteCard, onRenameColumn, onMoveCard }: Props) {
  const [activeCard, setActiveCard] = useState<CardType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const findColumnByCardId = useCallback(
    (cardId: string): string | undefined => {
      for (const col of board.columns) {
        if (col.cardIds.includes(cardId)) return col.id;
      }
      return undefined;
    },
    [board.columns]
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const cardId = event.active.id as string;
      const card = board.cards[cardId];
      if (card) setActiveCard(card);
    },
    [board.cards]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveCard(null);
      const { active, over } = event;
      if (!over) return;

      const cardId = active.id as string;
      const fromColumnId = findColumnByCardId(cardId);
      if (!fromColumnId) return;

      const overId = over.id as string;

      // Dropped on a column (empty area) or on another card
      const toColumn = board.columns.find((c) => c.id === overId);
      const toColumnId = toColumn ? toColumn.id : (findColumnByCardId(overId) ?? overId);

      if (!toColumnId || (fromColumnId === toColumnId && cardId === overId)) return;

      if (fromColumnId === toColumnId) {
        const col = board.columns.find((c) => c.id === fromColumnId);
        if (!col) return;
        const oldIndex = col.cardIds.indexOf(cardId);
        const newIndex = col.cardIds.indexOf(overId);
        if (oldIndex === -1 || newIndex === -1) return;
        onMoveCard(cardId, fromColumnId, toColumnId, newIndex);
      } else {
        const targetCol = board.columns.find((c) => c.id === toColumnId);
        if (!targetCol) return;
        const overIndex = targetCol.cardIds.indexOf(overId);
        onMoveCard(cardId, fromColumnId, toColumnId, overIndex >= 0 ? overIndex : targetCol.cardIds.length);
      }
    },
    [board.columns, findColumnByCardId, onMoveCard]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="bg-navy-dark px-6 py-4 shadow-lg">
          <h1 className="text-lg font-bold text-white tracking-wide">Kanban Board</h1>
          <p className="text-xs text-white/50 mt-0.5">Drag cards between columns to update status</p>
        </header>
        <main className="flex flex-1 gap-4 overflow-x-auto p-6">
          {board.columns.map((column) => {
            const columnCards = column.cardIds
              .map((id) => board.cards[id])
              .filter(Boolean);

            return (
              <Column
                key={column.id}
                column={column}
                cards={columnCards}
                onAddCard={onAddCard}
                onDeleteCard={onDeleteCard}
                onRenameColumn={onRenameColumn}
              />
            );
          })}
        </main>
      </div>
      <DragOverlay>
        {activeCard ? (
          <div className="rounded-lg border-2 border-accent-yellow bg-white p-3 shadow-lg opacity-90">
            <h4 className="text-sm font-semibold text-foreground">{activeCard.title}</h4>
            <p className="mt-1 text-xs text-text-muted">{activeCard.details}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
