import { test, describe, beforeEach, expect } from "@playwright/test";

const NOTE_APP_BASE = "http://localhost:3001";

async function setupTestEnvironment(request) {
  await request.post(`${NOTE_APP_BASE}/api/testing/reset`);
  await request.post(`${NOTE_APP_BASE}/api/users`, {
    data: { name: "ferunando", username: "kurusu", password: "password" },
  });
}

async function loginUser(page) {
  await page.getByRole("button", { name: "Log in" }).click();
  await page.getByTestId("username").fill("kurusu");
  await page.getByTestId("password").fill("password");
  await page.getByRole("button", { name: "login" }).click();
}

describe("Note app", () => {
  beforeEach(async ({ page, request }) => {
    await setupTestEnvironment(request);
    await page.goto(NOTE_APP_BASE);
  });

  test("should open front page", async ({ page }) => {
    const footer =
      "Note app, Department of Computer Science, University of Helsinki 2024";
    const locator = page.getByText("Notes");
    await expect(locator).toBeVisible();
    await expect(page.getByText(footer)).toBeVisible();
  });

  test("should open the login form and log in", async ({ page }) => {
    await loginUser(page);
    await expect(page.getByText("Welcome, ")).toBeVisible();
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginUser(page);
    });

    test("should create a new note", async ({ page }) => {
      await page.getByRole("button", { name: "new note" }).click();
      await page.getByRole("textbox").fill("a note created by playwright");
      await page.getByRole("button", { name: "save" }).click();
      await expect(
        page.getByText("a note created by playwright")
      ).toBeVisible();
    });
  });

  test("should failed when logging in with wrong password", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Log in" }).click();
    await page.getByTestId("username").fill("kurusu");
    await page.getByTestId("password").fill("wrong");
    await page.getByRole("button", { name: "login" }).click();

    const errorDiv = await page.locator(".error");
    await expect(errorDiv).toContainText("Wrong Credentials");
    // await expect(page.getByText("Wrong Credentials")).toBeVisible();
  });

  describe("When logged in and a note exists", () => {
    beforeEach(async ({ page }) => {
      await loginUser(page);
      await page.getByRole("button", { name: "new note" }).click();
      await page.getByRole("textbox").fill("another note by playwright");
      await page.getByRole("button", { name: "save" }).click();
    });

    test("importance can be changed", async ({ page }) => {
      await page.getByRole("button", { name: "make important" }).click();
      await expect(page.getByText("make not important")).toBeVisible();
    });
  });
});
