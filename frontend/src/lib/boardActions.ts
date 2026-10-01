import type { Board, Card } from "./types";

export function addCard(
  board: Board,
  columnId: string,
  title: string,
  details: string
): Board {
  const id = crypto.randomUUID();
  const newCard: Card = { id, title, details };

  return {
    ...board,
    cards: { ...board.cards, [id]: newCard },
    columns: board.columns.map((col) =>
      col.id === columnId ? { ...col, cardIds: [...col.cardIds, id] } : col
    ),
  };
}

export function deleteCard(board: Board, cardId: string): Board {
  const { [cardId]: _removed, ...remainingCards } = board.cards;

  return {
    ...board,
    cards: remainingCards,
    columns: board.columns.map((col) => ({
      ...col,
      cardIds: col.cardIds.filter((id) => id !== cardId),
    })),
  };
}

export function renameColumn(
  board: Board,
  columnId: string,
  title: string
): Board {
  return {
    ...board,
    columns: board.columns.map((col) =>
      col.id === columnId ? { ...col, title } : col
    ),
  };
}

export function moveCard(
  board: Board,
  cardId: string,
  fromColumnId: string,
  toColumnId: string,
  toIndex?: number
): Board {
  if (fromColumnId === toColumnId) {
    return {
      ...board,
      columns: board.columns.map((col) => {
        if (col.id !== fromColumnId) return col;
        const filtered = col.cardIds.filter((id) => id !== cardId);
        const insertAt = toIndex ?? filtered.length;
        return {
          ...col,
          cardIds: [...filtered.slice(0, insertAt), cardId, ...filtered.slice(insertAt)],
        };
      }),
    };
  }

  return {
    ...board,
    columns: board.columns.map((col) => {
      if (col.id === fromColumnId) {
        return { ...col, cardIds: col.cardIds.filter((id) => id !== cardId) };
      }
      if (col.id === toColumnId) {
        const insertAt = toIndex ?? col.cardIds.length;
        return {
          ...col,
          cardIds: [...col.cardIds.slice(0, insertAt), cardId, ...col.cardIds.slice(insertAt)],
        };
      }
      return col;
    }),
  };
}
