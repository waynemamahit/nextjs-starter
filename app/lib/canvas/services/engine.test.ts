import { beforeEach, describe, expect, it } from "vitest";
import { CanvasEngine } from "./engine";

// Test rectangle for reuse
const testRect = {
	id: "rect-1",
	type: "rectangle" as const,
	x: 100,
	y: 100,
	width: 200,
	height: 100,
	createdAt: Date.now(),
};

const testPoint = {
	id: "point-1",
	type: "point" as const,
	x: 150,
	y: 150,
	createdAt: Date.now(),
};

describe("CanvasEngine", () => {
	let engine: CanvasEngine;

	beforeEach(() => {
		engine = new CanvasEngine();
	});

	describe("hitTestPoint", () => {
		it("should detect hit on point within tolerance", () => {
			expect(engine.hitTestPoint(testPoint, 150, 150)).toBe(true);
		});

		it("should not detect hit outside tolerance", () => {
			expect(engine.hitTestPoint(testPoint, 200, 200)).toBe(false);
		});

		it("should return false for non-point shapes", () => {
			expect(engine.hitTestPoint(testRect, 150, 150)).toBe(false);
		});
	});

	describe("hitTestRectangle", () => {
		it("should detect hit inside rectangle", () => {
			expect(engine.hitTestRectangle(testRect, 150, 150)).toBe(true);
		});

		it("should detect hit on rectangle edge", () => {
			expect(engine.hitTestRectangle(testRect, 100, 100)).toBe(true);
			expect(engine.hitTestRectangle(testRect, 300, 200)).toBe(true);
		});

		it("should not detect hit outside rectangle", () => {
			expect(engine.hitTestRectangle(testRect, 50, 50)).toBe(false);
			expect(engine.hitTestRectangle(testRect, 350, 250)).toBe(false);
		});
	});

	describe("hitTestResizeHandle", () => {
		it("should detect top-left handle", () => {
			expect(engine.hitTestResizeHandle(testRect, 95, 95)).toBe("top-left");
		});

		it("should detect top-right handle", () => {
			expect(engine.hitTestResizeHandle(testRect, 305, 95)).toBe("top-right");
		});

		it("should detect bottom-left handle", () => {
			expect(engine.hitTestResizeHandle(testRect, 95, 205)).toBe("bottom-left");
		});

		it("should detect bottom-right handle", () => {
			expect(engine.hitTestResizeHandle(testRect, 305, 205)).toBe(
				"bottom-right",
			);
		});

		it("should return null when not hitting any handle", () => {
			expect(engine.hitTestResizeHandle(testRect, 150, 150)).toBeNull();
		});
	});

	describe("calculateResize", () => {
		it("should resize from bottom-right handle", () => {
			const result = engine.calculateResize(testRect, "bottom-right", 400, 300);
			expect(result.x).toBe(100);
			expect(result.y).toBe(100);
			expect(result.width).toBe(300);
			expect(result.height).toBe(200);
		});

		it("should resize from top-left handle", () => {
			const result = engine.calculateResize(testRect, "top-left", 50, 50);
			expect(result.x).toBe(50);
			expect(result.y).toBe(50);
			expect(result.width).toBe(250);
			expect(result.height).toBe(150);
		});

		it("should respect minimum size", () => {
			const result = engine.calculateResize(testRect, "bottom-right", 105, 105);
			expect(result.width).toBe(10);
			expect(result.height).toBe(10);
		});

		it("should maintain aspect ratio for top-right handle", () => {
			const result = engine.calculateResize(testRect, "top-right", 400, 150);
			expect(result.x).toBe(100);
			expect(result.y).toBe(150);
			expect(result.width).toBe(300);
			expect(result.height).toBe(50);
		});
	});

	describe("calculateSquareResize", () => {
		it("should create square from positive dimensions", () => {
			const result = engine.calculateSquareResize(100, 100, 200, 150);
			expect(result.width).toBe(100);
			expect(result.height).toBe(100);
		});

		it("should create square from negative dimensions", () => {
			const result = engine.calculateSquareResize(200, 200, 100, 100);
			expect(result.width).toBe(100);
			expect(result.height).toBe(100);
		});

		it("should handle diagonal drag", () => {
			const result = engine.calculateSquareResize(100, 100, 50, 150);
			expect(result.width).toBe(50);
			expect(result.height).toBe(50);
		});
	});

	describe("isSquare", () => {
		it("should detect square when width equals height", () => {
			const square = { ...testRect, width: 100, height: 100 };
			expect(engine.isSquare(square)).toBe(true);
		});

		it("should not detect square when width differs from height", () => {
			expect(engine.isSquare(testRect)).toBe(false);
		});

		it("should use tolerance for detection", () => {
			const almostSquare = { ...testRect, width: 101, height: 100 };
			expect(engine.isSquare(almostSquare, 2)).toBe(true);
			expect(engine.isSquare(almostSquare, 0.5)).toBe(false);
		});
	});

	describe("getShapeAtPosition", () => {
		it("should prioritize points over rectangles", () => {
			const shapes = [testRect, testPoint];
			// Point at (150, 150) which is inside the rectangle
			const result = engine.getShapeAtPosition(shapes, 150, 150);
			expect(result?.shape.id).toBe("point-1");
			expect(result?.isPoint).toBe(true);
		});

		it("should return rectangle when no point at position", () => {
			const shapes = [testRect];
			const result = engine.getShapeAtPosition(shapes, 150, 150);
			expect(result?.shape.id).toBe("rect-1");
			expect(result?.isPoint).toBe(false);
		});

		it("should return null when no shape at position", () => {
			const shapes = [testRect];
			const result = engine.getShapeAtPosition(shapes, 50, 50);
			expect(result).toBeNull();
		});

		it("should return last created shape when multiple at position", () => {
			const rect1 = { ...testRect, id: "rect-1" };
			const rect2 = {
				...testRect,
				id: "rect-2",
				x: 120,
				y: 120,
				width: 100,
				height: 50,
			};
			const shapes = [rect1, rect2];
			// Position (150, 150) is in both rectangles, should return rect2 (last)
			const result = engine.getShapeAtPosition(shapes, 150, 150);
			expect(result?.shape.id).toBe("rect-2");
		});
	});
});
