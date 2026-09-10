/**
 * Integration tests for Controls component
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CanvasProvider } from "../engine/context";
import { Controls } from "./Controls";

describe("Controls component", () => {
	it("should render all control buttons", () => {
		render(
			<CanvasProvider>
				<Controls />
			</CanvasProvider>,
		);

		// Check for Delete button
		expect(screen.getByText("Delete")).toBeDefined();

		// Check for Undo button
		expect(screen.getByText("Undo")).toBeDefined();

		// Check for Redo button
		expect(screen.getByText("Redo")).toBeDefined();

		// Check for Export button
		expect(screen.getByText("Export")).toBeDefined();

		// Check for Reset button
		expect(screen.getByText("Reset")).toBeDefined();
	});

	it("should disable delete button when nothing is selected", () => {
		render(
			<CanvasProvider>
				<Controls />
			</CanvasProvider>,
		);

		const deleteButton = screen.getByText("Delete");
		// Initially nothing is selected, so delete should be disabled
		expect(deleteButton.getAttribute("disabled")).not.toBeNull();
	});

	it("should disable undo button when history is empty", () => {
		render(
			<CanvasProvider>
				<Controls />
			</CanvasProvider>,
		);

		const undoButton = screen.getByText("Undo");
		// Initially history is empty, so undo should be disabled
		expect(undoButton.getAttribute("disabled")).not.toBeNull();
	});

	it("should disable redo button when redo stack is empty", () => {
		render(
			<CanvasProvider>
				<Controls />
			</CanvasProvider>,
		);

		const redoButton = screen.getByText("Redo");
		// Initially redo stack is empty, so redo should be disabled
		expect(redoButton.getAttribute("disabled")).not.toBeNull();
	});
});
