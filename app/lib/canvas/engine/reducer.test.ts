/**
 * Unit tests for canvas reducer
 */

import { describe, expect, it } from "vitest";
import type { Point, Rectangle } from "../types";
import { CanvasActionType, initialCanvasState } from "../types";
import { canvasReducer } from "./reducer";

// Helper to create test shapes
const createTestPoint = (x = 100, y = 100): Point => ({
	id: `point-${Date.now()}`,
	type: "point",
	x,
	y,
	createdAt: Date.now(),
});

const createTestRect = (
	x = 100,
	y = 100,
	width = 200,
	height = 100,
): Rectangle => ({
	id: `rect-${Date.now()}`,
	type: "rectangle",
	x,
	y,
	width,
	height,
	createdAt: Date.now(),
});

describe("canvasReducer", () => {
	it("should be defined", () => {
		expect(canvasReducer).toBeDefined();
	});

	it("should return initial state for unknown action", () => {
		// @ts-expect-error - testing unknown action
		const state = canvasReducer(initialCanvasState, { type: "UNKNOWN" });
		expect(state).toEqual(initialCanvasState);
	});

	it("should handle CREATE_POINT action", () => {
		const action = {
			type: CanvasActionType.CREATE_POINT,
			x: 100,
			y: 100,
			timestamp: Date.now(),
		};
		const state = canvasReducer(initialCanvasState, action);
		expect(state.shapes).toHaveLength(1);
		expect(state.shapes[0].type).toBe("point");
	});

	it("should handle CREATE_RECTANGLE action", () => {
		const action = {
			type: CanvasActionType.CREATE_RECTANGLE,
			x: 100,
			y: 100,
			width: 200,
			height: 100,
			timestamp: Date.now(),
		};
		const state = canvasReducer(initialCanvasState, action);
		expect(state.shapes).toHaveLength(1);
		expect(state.shapes[0].type).toBe("rectangle");
	});

	it("should handle SELECT_SHAPE action", () => {
		const point = createTestPoint();
		const state = {
			...initialCanvasState,
			shapes: [point],
		};
		const action = {
			type: CanvasActionType.SELECT_SHAPE,
			shapeId: point.id,
			timestamp: Date.now(),
		};
		const newState = canvasReducer(state, action);
		expect(newState.selectedShapeId).toBe(point.id);
	});

	it("should handle DESELECT_SHAPE action", () => {
		const point = createTestPoint();
		const state = {
			...initialCanvasState,
			shapes: [point],
			selectedShapeId: point.id,
		};
		const action = {
			type: CanvasActionType.DESELECT_SHAPE,
			timestamp: Date.now(),
		};
		const newState = canvasReducer(state, action);
		expect(newState.selectedShapeId).toBeNull();
	});

	it("should handle MOVE_SHAPE action", () => {
		const rect = createTestRect();
		const state = {
			...initialCanvasState,
			shapes: [rect],
		};
		const action = {
			type: CanvasActionType.MOVE_SHAPE,
			shapeId: rect.id,
			dx: 50,
			dy: 30,
			timestamp: Date.now(),
		};
		const newState = canvasReducer(state, action);
		const movedShape = newState.shapes.find((s) => s.id === rect.id);
		expect(movedShape).toBeDefined();
		if (movedShape) {
			expect(movedShape.x).toBe(rect.x + 50);
			expect(movedShape.y).toBe(rect.y + 30);
		}
	});

	it("should handle RESIZE_SHAPE action", () => {
		const rect = createTestRect();
		const state = {
			...initialCanvasState,
			shapes: [rect],
		};
		const action = {
			type: CanvasActionType.RESIZE_SHAPE,
			shapeId: rect.id,
			newX: rect.x,
			newY: rect.y,
			newWidth: 300,
			newHeight: 150,
			timestamp: Date.now(),
		};
		const newState = canvasReducer(state, action);
		const resizedShape = newState.shapes.find(
			(s) => s.id === rect.id,
		) as Rectangle;
		expect(resizedShape).toBeDefined();
		expect(resizedShape.width).toBe(300);
		expect(resizedShape.height).toBe(150);
	});

	it("should handle DELETE_SHAPE action", () => {
		const rect = createTestRect();
		const state = {
			...initialCanvasState,
			shapes: [rect],
			selectedShapeId: rect.id,
		};
		const action = {
			type: CanvasActionType.DELETE_SHAPE,
			shapeId: rect.id,
			timestamp: Date.now(),
		};
		const newState = canvasReducer(state, action);
		expect(newState.shapes).toHaveLength(0);
		expect(newState.selectedShapeId).toBeNull();
	});

	it("should handle UNDO action", () => {
		const point = createTestPoint();
		const stateWithPoint = {
			...initialCanvasState,
			shapes: [point],
			history: [
				{
					type: CanvasActionType.CREATE_POINT,
					x: point.x,
					y: point.y,
					timestamp: Date.now(),
					_shapeId: point.id,
				},
			],
		};
		const action = {
			type: CanvasActionType.UNDO,
			timestamp: Date.now(),
		};
		const state = canvasReducer(stateWithPoint, action);
		expect(state.shapes).toHaveLength(0);
	});

	it("should handle REDO action", () => {
		const point = createTestPoint();
		const stateAfterUndo = {
			...initialCanvasState,
			history: [],
			redoStack: [
				{
					type: CanvasActionType.CREATE_POINT,
					x: point.x,
					y: point.y,
					timestamp: Date.now(),
				},
			],
		};
		const action = {
			type: CanvasActionType.REDO,
			timestamp: Date.now(),
		};
		const state = canvasReducer(stateAfterUndo, action);
		expect(state.shapes).toHaveLength(1);
	});

	it("should handle RESET action", () => {
		const point = createTestPoint();
		const state = {
			...initialCanvasState,
			shapes: [point],
			selectedShapeId: point.id,
		};
		const action = {
			type: CanvasActionType.RESET,
			timestamp: Date.now(),
		};
		const stateAfterReset = canvasReducer(state, action);
		expect(stateAfterReset.shapes).toHaveLength(0);
		expect(stateAfterReset.selectedShapeId).toBeNull();
	});
});
