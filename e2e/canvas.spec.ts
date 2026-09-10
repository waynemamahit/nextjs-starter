import { expect, test } from "@playwright/test";

test.describe("Canvas Page", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:3000/");
	});

	test("should display canvas page title", async ({ page }) => {
		await expect(page.locator("h1")).toContainText("Interactive Canvas");
	});

	test("should render canvas element", async ({ page }) => {
		const canvas = page.locator('[data-testid="canvas"]');
		await expect(canvas).toBeVisible();
	});

	test("should render controls component", async ({ page }) => {
		const deleteButton = page.locator("button", { hasText: "Delete" });
		const undoButton = page.locator("button", { hasText: "Undo" });
		const redoButton = page.locator("button", { hasText: "Redo" });
		const exportButton = page.locator("button", { hasText: "Export" });
		const resetButton = page.locator("button", { hasText: "Reset" });

		await expect(deleteButton).toBeVisible();
		await expect(undoButton).toBeVisible();
		await expect(redoButton).toBeVisible();
		await expect(exportButton).toBeVisible();
		await expect(resetButton).toBeVisible();
	});

	test("should render statistics component", async ({ page }) => {
		const statistics = page.locator("text=Points:");
		await expect(statistics).toBeVisible();
	});

	test("should render user guide component", async ({ page }) => {
		const userGuide = page.locator(
			"text=Click anywhere on canvas to create a point",
		);
		await expect(userGuide).toBeVisible();
	});

	test("should disable delete button initially", async ({ page }) => {
		const deleteButton = page.locator("button", { hasText: "Delete" });
		await expect(deleteButton).toBeDisabled();
	});

	test("should disable undo button initially", async ({ page }) => {
		const undoButton = page.locator("button", { hasText: "Undo" });
		await expect(undoButton).toBeDisabled();
	});

	test("should disable redo button initially", async ({ page }) => {
		const redoButton = page.locator("button", { hasText: "Redo" });
		await expect(redoButton).toBeDisabled();
	});

	test("should show export menu on export button click", async ({ page }) => {
		const exportButton = page.locator("button", { hasText: "Export" });
		await exportButton.click();

		const pngOption = page.locator("text=PNG");
		const jpgOption = page.locator("text=JPG");
		const svgOption = page.locator("text=SVG");

		await expect(pngOption).toBeVisible();
		await expect(jpgOption).toBeVisible();
		await expect(svgOption).toBeVisible();
	});

	test("should create point on canvas click", async ({ page }) => {
		const canvas = page.locator('[data-testid="canvas"]');

		// Get canvas bounding box
		const canvasBox = await canvas.boundingBox();
		if (!canvasBox) {
			throw new Error("Canvas not found");
		}

		// Click in the center of the canvas
		const centerX = canvasBox.width / 2 + canvasBox.x;
		const centerY = canvasBox.height / 2 + canvasBox.y;

		await canvas.click({ position: { x: centerX, y: centerY } });

		// After creating a point, undo should be enabled
		const undoButton = page.locator("button", { hasText: "Undo" });
		await expect(undoButton).not.toBeDisabled();
	});

	test("should create rectangle on canvas click and drag", async ({ page }) => {
		const canvas = page.locator('[data-testid="canvas"]');

		// Get canvas bounding box
		const canvasBox = await canvas.boundingBox();
		if (!canvasBox) {
			throw new Error("Canvas not found");
		}

		// Start point for drag
		const startX = canvasBox.x + 100;
		const startY = canvasBox.y + 100;

		// End point for drag
		const endX = canvasBox.x + 200;
		const endY = canvasBox.y + 150;

		// Move to start position, press mouse button, move to end position, release
		await canvas.hover({ position: { x: startX, y: startY } });
		await page.mouse.down();
		await page.mouse.move(endX, endY);
		await page.mouse.up();

		// After creating a rectangle, undo should be enabled
		const undoButton = page.locator("button", { hasText: "Undo" });
		await expect(undoButton).not.toBeDisabled();
	});

	test("should select shape on click", async ({ page }) => {
		const canvas = page.locator('[data-testid="canvas"]');

		// Get canvas bounding box
		const canvasBox = await canvas.boundingBox();
		if (!canvasBox) {
			throw new Error("Canvas not found");
		}

		// Create a point first
		const centerX = canvasBox.width / 2 + canvasBox.x;
		const centerY = canvasBox.height / 2 + canvasBox.y;

		await canvas.click({ position: { x: centerX, y: centerY } });

		// Click the same position to select the point
		await canvas.click({ position: { x: centerX, y: centerY } });

		// Delete button should be enabled when a shape is selected
		const deleteButton = page.locator("button", { hasText: "Delete" });
		await expect(deleteButton).not.toBeDisabled();
	});

	test("should delete selected shape", async ({ page }) => {
		const canvas = page.locator('[data-testid="canvas"]');

		// Get canvas bounding box
		const canvasBox = await canvas.boundingBox();
		if (!canvasBox) {
			throw new Error("Canvas not found");
		}

		// Create a point
		const centerX = canvasBox.width / 2 + canvasBox.x;
		const centerY = canvasBox.height / 2 + canvasBox.y;

		await canvas.click({ position: { x: centerX, y: centerY } });

		// Select the point
		await canvas.click({ position: { x: centerX, y: centerY } });

		// Delete the point
		const deleteButton = page.locator("button", { hasText: "Delete" });
		await deleteButton.click();

		// Delete button should be disabled again
		await expect(deleteButton).toBeDisabled();
	});

	test("should undo last action", async ({ page }) => {
		const canvas = page.locator('[data-testid="canvas"]');

		// Get canvas bounding box
		const canvasBox = await canvas.boundingBox();
		if (!canvasBox) {
			throw new Error("Canvas not found");
		}

		// Create a point
		const centerX = canvasBox.width / 2 + canvasBox.x;
		const centerY = canvasBox.height / 2 + canvasBox.y;

		await canvas.click({ position: { x: centerX, y: centerY } });

		// Undo should be enabled
		const undoButton = page.locator("button", { hasText: "Undo" });
		await expect(undoButton).not.toBeDisabled();

		// Click undo
		await undoButton.click();

		// Undo button should be disabled after undo (no history)
		await expect(undoButton).toBeDisabled();

		// Redo button should be enabled
		const redoButton = page.locator("button", { hasText: "Redo" });
		await expect(redoButton).not.toBeDisabled();
	});

	test("should redo undone action", async ({ page }) => {
		const canvas = page.locator('[data-testid="canvas"]');

		// Get canvas bounding box
		const canvasBox = await canvas.boundingBox();
		if (!canvasBox) {
			throw new Error("Canvas not found");
		}

		// Create a point
		const centerX = canvasBox.width / 2 + canvasBox.x;
		const centerY = canvasBox.height / 2 + canvasBox.y;

		await canvas.click({ position: { x: centerX, y: centerY } });

		// Undo
		const undoButton = page.locator("button", { hasText: "Undo" });
		await undoButton.click();

		// Redo
		const redoButton = page.locator("button", { hasText: "Redo" });
		await redoButton.click();

		// Redo button should be disabled after redo (no redo stack)
		await expect(redoButton).toBeDisabled();

		// Undo button should be enabled
		await expect(undoButton).not.toBeDisabled();
	});

	test("should reset canvas", async ({ page }) => {
		const canvas = page.locator('[data-testid="canvas"]');

		// Get canvas bounding box
		const canvasBox = await canvas.boundingBox();
		if (!canvasBox) {
			throw new Error("Canvas not found");
		}

		// Create a point
		const centerX = canvasBox.width / 2 + canvasBox.x;
		const centerY = canvasBox.height / 2 + canvasBox.y;

		await canvas.click({ position: { x: centerX, y: centerY } });

		// Reset
		const resetButton = page.locator("button", { hasText: "Reset" });
		await resetButton.click();

		// Delete and redo buttons should be in initial state, undo should be enabled (can undo reset)
		const deleteButton = page.locator("button", { hasText: "Delete" });
		const undoButton = page.locator("button", { hasText: "Undo" });
		const redoButton = page.locator("button", { hasText: "Redo" });

		await expect(deleteButton).toBeDisabled();
		await expect(undoButton).not.toBeDisabled(); // Reset is undoable
		await expect(redoButton).toBeDisabled();
	});

	test("should update statistics on shape creation", async ({ page }) => {
		const canvas = page.locator('[data-testid="canvas"]');

		// Get canvas bounding box
		const canvasBox = await canvas.boundingBox();
		if (!canvasBox) {
			throw new Error("Canvas not found");
		}

		// Initially statistics should show 0
		const pointsText = page.locator("text=Points: 0");
		await expect(pointsText).toBeVisible();

		// Create a point
		const centerX = canvasBox.width / 2 + canvasBox.x;
		const centerY = canvasBox.height / 2 + canvasBox.y;

		await canvas.click({ position: { x: centerX, y: centerY } });

		// Statistics should show 1 point
		const pointsText1 = page.locator("text=Points: 1");
		await expect(pointsText1).toBeVisible();
	});

	test("should create square with Shift + drag", async ({ page }) => {
		const canvas = page.locator('[data-testid="canvas"]');

		// Get canvas bounding box
		const canvasBox = await canvas.boundingBox();
		if (!canvasBox) {
			throw new Error("Canvas not found");
		}

		// Start point for drag
		const startX = canvasBox.x + 100;
		const startY = canvasBox.y + 100;

		// End point for drag - will create a square
		const endX = canvasBox.x + 200;
		const endY = canvasBox.y + 200;

		// Move to start position, press Shift, press mouse button, move to end position, release
		await canvas.hover({ position: { x: startX, y: startY } });
		await page.keyboard.down("Shift");
		await page.mouse.down();
		await page.mouse.move(endX, endY);
		await page.mouse.up();
		await page.keyboard.up("Shift");

		// After creating a square, undo should be enabled
		const undoButton = page.locator("button", { hasText: "Undo" });
		await expect(undoButton).not.toBeDisabled();
	});

	test("should display responsive layout on desktop", async ({ page }) => {
		// Set desktop viewport
		await page.setViewportSize({ width: 1280, height: 800 });

		const canvas = page.locator('[data-testid="canvas"]');
		const deleteButton = page.locator("button", { hasText: "Delete" });
		const statistics = page.locator("text=Points:");
		const userGuide = page.locator(
			"text=Click anywhere on canvas to create a point",
		);

		await expect(canvas).toBeVisible();
		await expect(deleteButton).toBeVisible();
		await expect(statistics).toBeVisible();
		await expect(userGuide).toBeVisible();
	});

	test("should display responsive layout on mobile", async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });

		const canvas = page.locator('[data-testid="canvas"]');
		const deleteButton = page.locator("button", { hasText: "Delete" });
		const statistics = page.locator("text=Points:");
		const userGuide = page.locator(
			"text=Click anywhere on canvas to create a point",
		);

		await expect(canvas).toBeVisible();
		await expect(deleteButton).toBeVisible();
		await expect(statistics).toBeVisible();
		await expect(userGuide).toBeVisible();
	});
});
