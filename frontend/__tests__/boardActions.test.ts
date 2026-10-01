import { describe, it, expect } from "vitest";
import { addCard, deleteCard, renameColumn, moveCard } from "@/lib/boardActions";
import type { Board } from "@/lib/types";

function makeBoard(): Board {
  return {
    columns: [
      { id: "a", title: "Column A", cardIds: ["c1", "c2"] },
      { id: "b", title: "Column B", cardIds: ["c3"] },
    ],
    cards: {
      c1: { id: "c1", title: "Card 1", details: "Details 1" },
      c2: { id: "c2", title: "Card 2", details: "Details 2" },
      c3: { id: "c3", title: "Card 3", details: "Details 3" },
    },
  };
}

describe("addCard", () => {
  it("adds a card to the specified column", () => {
    const board = makeBoard();
    const result = addCard(board, "a", "New card", "New details");

    expect(result.columns[0].cardIds).toHaveLength(3);
    const newId = result.columns[0].cardIds[2];
    expect(result.cards[newId]).toEqual({
      id: newId,
      title: "New card",
      details: "New details",
    });
  });

  it("does not mutate the original board", () => {
    const board = makeBoard();
    const result = addCard(board, "a", "X", "Y");

    expect(board.columns[0].cardIds).toHaveLength(2);
    expect(Object.keys(board.cards)).toHaveLength(3);
    expect(result).not.toBe(board);
  });
});

describe("deleteCard", () => {
  it("removes the card from all columns and cards map", () => {
    const board = makeBoard();
    const result = deleteCard(board, "c1");

    expect(result.columns[0].cardIds).toEqual(["c2"]);
    expect(result.cards["c1"]).toBeUndefined();
  });

  it("does not mutate the original board", () => {
    const board = makeBoard();
    deleteCard(board, "c1");

    expect(board.columns[0].cardIds).toEqual(["c1", "c2"]);
    expect(board.cards["c1"]).toBeDefined();
  });
});

describe("renameColumn", () => {
  it("renames the specified column", () => {
    const board = makeBoard();
    const result = renameColumn(board, "a", "Renamed");

    expect(result.columns[0].title).toBe("Renamed");
    expect(result.columns[1].title).toBe("Column B");
  });

  it("does not mutate the original board", () => {
    const board = makeBoard();
    renameColumn(board, "a", "X");

    expect(board.columns[0].title).toBe("Column A");
  });
});

describe("moveCard", () => {
  it("moves a card between columns", () => {
    const board = makeBoard();
    const result = moveCard(board, "c1", "a", "b");

    expect(result.columns[0].cardIds).toEqual(["c2"]);
    expect(result.columns[1].cardIds).toEqual(["c3", "c1"]);
  });

  it("moves a card within the same column to a specific index", () => {
    const board = makeBoard();
    const result = moveCard(board, "c1", "a", "a", 1);

    expect(result.columns[0].cardIds).toEqual(["c2", "c1"]);
  });

  it("moves a card to the end when no index specified (same column)", () => {
    const board = makeBoard();
    const result = moveCard(board, "c1", "a", "a");

    expect(result.columns[0].cardIds).toEqual(["c2", "c1"]);
  });

  it("moves a card to an empty column", () => {
    const board: Board = {
      columns: [
        { id: "a", title: "A", cardIds: ["c1"] },
        { id: "b", title: "B", cardIds: [] },
      ],
      cards: { c1: { id: "c1", title: "X", details: "Y" } },
    };
    const result = moveCard(board, "c1", "a", "b");

    expect(result.columns[0].cardIds).toEqual([]);
    expect(result.columns[1].cardIds).toEqual(["c1"]);
  });

  it("does not mutate the original board", () => {
    const board = makeBoard();
    moveCard(board, "c1", "a", "b");

    expect(board.columns[0].cardIds).toEqual(["c1", "c2"]);
    expect(board.columns[1].cardIds).toEqual(["c3"]);
  });
});
