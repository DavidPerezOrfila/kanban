"use client";

import { Board } from "@/components/Board";
import { useBoardState } from "@/hooks/useBoardState";

export default function Home() {
  const { board, addCard, deleteCard, renameColumn, moveCard } = useBoardState();

  return (
    <div className="flex h-screen flex-col">
      <Board
        board={board}
        onAddCard={addCard}
        onDeleteCard={deleteCard}
        onRenameColumn={renameColumn}
        onMoveCard={moveCard}
      />
    </div>
  );
}
