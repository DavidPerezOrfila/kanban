import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Board } from "@/components/Board";
import type { Board as BoardType } from "@/lib/types";

function makeBoard(): BoardType {
  return {
    columns: [
      { id: "backlog", title: "Backlog", cardIds: ["c1"] },
      { id: "todo", title: "To Do", cardIds: [] },
    ],
    cards: {
      c1: { id: "c1", title: "Test card", details: "Test details" },
    },
  };
}

function renderBoard(overrides: Partial<Parameters<typeof Board>[0]> = {}) {
  const board = makeBoard();
  const defaults = {
    board,
    onAddCard: vi.fn(),
    onDeleteCard: vi.fn(),
    onRenameColumn: vi.fn(),
    onMoveCard: vi.fn(),
    ...overrides,
  };
  return { ...render(<Board {...defaults} />), ...defaults };
}

describe("Board", () => {
  it("renders the header", () => {
    renderBoard();
    expect(screen.getByText("Kanban Board")).toBeInTheDocument();
  });

  it("renders all columns with their titles", () => {
    renderBoard();
    expect(screen.getByText("Backlog")).toBeInTheDocument();
    expect(screen.getByText("To Do")).toBeInTheDocument();
  });

  it("renders cards in their columns", () => {
    renderBoard();
    expect(screen.getByText("Test card")).toBeInTheDocument();
    expect(screen.getByText("Test details")).toBeInTheDocument();
  });

  it("renders card count per column", () => {
    renderBoard();
    expect(screen.getByText("1 card")).toBeInTheDocument();
    expect(screen.getByText("0 cards")).toBeInTheDocument();
  });
});

describe("Board — add card", () => {
  it("calls onAddCard when form is submitted", async () => {
    const onAddCard = vi.fn();
    const user = userEvent.setup();
    renderBoard({ onAddCard });

    const addButtons = screen.getAllByText("+ Add card");
    await user.click(addButtons[1]);

    const titleInput = screen.getByPlaceholderText("Card title");
    await user.type(titleInput, "New task");

    const addButton = screen.getByRole("button", { name: "Add" });
    await user.click(addButton);

    expect(onAddCard).toHaveBeenCalledWith("todo", "New task", "");
  });
});

describe("Board — delete card", () => {
  it("calls onDeleteCard when delete button is clicked", async () => {
    const onDeleteCard = vi.fn();
    const user = userEvent.setup();
    renderBoard({ onDeleteCard });

    const card = screen.getByTestId("card-c1");
    const deleteBtn = within(card).getByRole("button");
    await user.click(deleteBtn);

    expect(onDeleteCard).toHaveBeenCalledWith("c1");
  });
});
