import { expect, test } from "@playwright/test";

test("should navigate to the about page", async ({ page }) => {
	// Start from the about page
	await page.goto("http://localhost:3000/about");
	// The new page should contain an h1 with "About"
	await expect(page.locator("h1")).toContainText("About");
});
