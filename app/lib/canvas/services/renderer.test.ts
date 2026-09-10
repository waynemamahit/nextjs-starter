/**
 * Unit tests for CanvasRenderer
 * Note: Full testing requires DOM environment (jsdom)
 */

import { describe, expect, it } from "vitest";
import { CanvasRenderer } from "./renderer";

describe("CanvasRenderer", () => {
	it("should be defined", () => {
		expect(CanvasRenderer).toBeDefined();
	});

	it("should have clear method", () => {
		expect(typeof CanvasRenderer.prototype.clear).toBe("function");
	});

	it("should have drawPoint method", () => {
		expect(typeof CanvasRenderer.prototype.drawPoint).toBe("function");
	});

	it("should have drawRectangle method", () => {
		expect(typeof CanvasRenderer.prototype.drawRectangle).toBe("function");
	});

	it("should have drawLabel method", () => {
		expect(typeof CanvasRenderer.prototype.drawLabel).toBe("function");
	});

	it("should have drawDimensionLabel method", () => {
		expect(typeof CanvasRenderer.prototype.drawDimensionLabel).toBe("function");
	});

	it("should have drawShapes method", () => {
		expect(typeof CanvasRenderer.prototype.drawShapes).toBe("function");
	});

	it("should have resizeCanvas method", () => {
		expect(typeof CanvasRenderer.prototype.resizeCanvas).toBe("function");
	});

	it("should have getCanvas method", () => {
		expect(typeof CanvasRenderer.prototype.getCanvas).toBe("function");
	});

	it("should have getContext method", () => {
		expect(typeof CanvasRenderer.prototype.getContext).toBe("function");
	});
});
