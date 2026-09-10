/**
 * Unit tests for CanvasExporter
 * Note: Full testing requires DOM environment (jsdom)
 */

import { describe, expect, it } from "vitest";
import { CanvasExporter } from "./exporter";

describe("CanvasExporter", () => {
	it("should be defined", () => {
		expect(CanvasExporter).toBeDefined();
	});

	it("should have exportToPNG method", () => {
		expect(typeof CanvasExporter.prototype.exportToPNG).toBe("function");
	});

	it("should have exportToJPG method", () => {
		expect(typeof CanvasExporter.prototype.exportToJPG).toBe("function");
	});

	it("should have exportToSVG method", () => {
		expect(typeof CanvasExporter.prototype.exportToSVG).toBe("function");
	});

	it("should have setCanvas method", () => {
		expect(typeof CanvasExporter.prototype.setCanvas).toBe("function");
	});
});
