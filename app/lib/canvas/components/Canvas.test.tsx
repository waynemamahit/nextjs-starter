/**
 * Integration tests for Canvas component
 */

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CanvasProvider } from "../engine/context";
import { Canvas } from "./Canvas";

describe("Canvas component - Integration Tests", () => {
	it("should render canvas element", () => {
		const { container } = render(
			<CanvasProvider>
				<Canvas height={600} />
			</CanvasProvider>,
		);

		const canvasElement = container.querySelector("canvas");
		expect(canvasElement).toBeDefined();
		expect(canvasElement?.getAttribute("height")).toBe("600");
	});

	it("should render with default dimensions when not specified", () => {
		const { container } = render(
			<CanvasProvider>
				<Canvas />
			</CanvasProvider>,
		);

		const canvasElement = container.querySelector("canvas");
		expect(canvasElement).toBeDefined();
	});

	it("should have correct styling attributes", () => {
		const { container } = render(
			<CanvasProvider>
				<Canvas width={400} height={300} />
			</CanvasProvider>,
		);

		const canvasElement = container.querySelector("canvas");
		expect(canvasElement?.getAttribute("style")).toContain("border");
		expect(canvasElement?.getAttribute("style")).toContain("background-color");
	});

	it("should render with custom width and height", () => {
		const { container } = render(
			<CanvasProvider>
				<Canvas height={768} />
			</CanvasProvider>,
		);

		const canvasElement = container.querySelector("canvas");
		expect(canvasElement).toBeDefined();
		expect(canvasElement?.getAttribute("height")).toBe("768");
	});
});
