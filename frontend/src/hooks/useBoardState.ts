"use client";

import { useState, useCallback } from "react";
import type { Board } from "@/lib/types";
import { addCard, deleteCard, renameColumn, moveCard } from "@/lib/boardActions";
import { createSampleBoard } from "@/lib/sampleData";

export function useBoardState() {
  const [board, setBoard] = useState<Board>(() => createSampleBoard());

  const handleAddCard = useCallback(
    (columnId: string, title: string, details: string) => {
      setBoard((prev) => addCard(prev, columnId, title, details));
    },
    []
  );

  const handleDeleteCard = useCallback((cardId: string) => {
    setBoard((prev) => deleteCard(prev, cardId));
  }, []);

  const handleRenameColumn = useCallback(
    (columnId: string, title: string) => {
      setBoard((prev) => renameColumn(prev, columnId, title));
    },
    []
  );

  const handleMoveCard = useCallback(
    (cardId: string, fromColumnId: string, toColumnId: string, toIndex?: number) => {
      setBoard((prev) => moveCard(prev, cardId, fromColumnId, toColumnId, toIndex));
    },
    []
  );

  return {
    board,
    addCard: handleAddCard,
    deleteCard: handleDeleteCard,
    renameColumn: handleRenameColumn,
    moveCard: handleMoveCard,
  };
}
