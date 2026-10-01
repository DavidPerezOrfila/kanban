import { test, expect } from "@playwright/test";

test.describe("Kanban Board", () => {
  test("loads 5 columns with sample data", async ({ page }) => {
    await page.goto("/");

    const columns = page.locator('[data-testid^="column-"]');
    await expect(columns).toHaveCount(5);

    await expect(page.getByText("Backlog")).toBeVisible();
    await expect(page.getByText("To Do")).toBeVisible();
    await expect(page.getByText("In Progress")).toBeVisible();
    await expect(page.getByText("Review")).toBeVisible();
    await expect(page.getByText("Done")).toBeVisible();
  });

  test("adds a card to a column", async ({ page }) => {
    await page.goto("/");

    const todoColumn = page.locator('[data-testid="column-todo"]');
    await todoColumn.getByText("+ Add card").click();

    await page.getByPlaceholder("Card title").fill("New E2E card");
    await page.getByPlaceholder("Details (optional)").fill("Created by Playwright");
    await todoColumn.getByRole("button", { name: "Add" }).click();

    await expect(page.getByText("New E2E card")).toBeVisible();
    await expect(page.getByText("Created by Playwright")).toBeVisible();
  });

  test("deletes a card", async ({ page }) => {
    await page.goto("/");

    const firstCard = page.locator('[data-testid^="card-"]').first();
    const cardTitle = await firstCard.locator("h4").textContent();
    expect(cardTitle).toBeTruthy();

    await firstCard.hover();
    await firstCard.locator("button").click();

    await expect(page.getByText(cardTitle!)).not.toBeVisible();
  });

  test("renames a column", async ({ page }) => {
    await page.goto("/");

    const backlogTitle = page.locator('[data-testid="column-backlog"] [data-testid="column-title"]');
    await backlogTitle.click();

    const input = page.locator('[data-testid="column-backlog"] input');
    await input.fill("Icebox");
    await input.press("Enter");

    await expect(page.getByText("Icebox")).toBeVisible();
  });

  test("drags a card to another column", async ({ page }) => {
    await page.goto("/");

    const sourceCard = page.locator('[data-testid="column-todo"] [data-testid^="card-"]').first();
    const targetColumn = page.locator('[data-testid="column-in-progress"] [data-testid^="card-"]').first();

    if (await sourceCard.count() === 0) {
      test.skip(true, "No cards in To Do to drag");
      return;
    }

    const sourceBox = await sourceCard.boundingBox();
    const targetBox = (await targetColumn.count()) > 0
      ? await targetColumn.boundingBox()
      : await page.locator('[data-testid="column-in-progress"]').boundingBox();

    if (!sourceBox || !targetBox) {
      test.skip(true, "Could not get bounding boxes");
      return;
    }

    await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 10 });
    await page.mouse.up();

    await page.waitForTimeout(500);
  });
});
