/**
 * Canvas Engine
 * Handles hit detection and shape manipulation logic
 */

import type { Rectangle, ResizeHandle, Shape } from "../types";
import {
	HIT_TOLERANCE,
	isPoint,
	isRectangle,
	RESIZE_HANDLE_SIZE,
} from "../types";

/** Canvas Engine class */
export class CanvasEngine {
	/**
	 * Test if a point is within a shape's bounds
	 */
	hitTestShape(shapes: Shape[], x: number, y: number): Shape | null {
		// Check from top to bottom (reverse order) to respect z-index
		for (let i = shapes.length - 1; i >= 0; i--) {
			const shape = shapes[i];
			if (this.hitTestPoint(shape, x, y)) {
				return shape;
			}
			if (isRectangle(shape) && this.hitTestRectangle(shape, x, y)) {
				return shape;
			}
		}
		return null;
	}

	/**
	 * Test if coordinates hit a point shape
	 */
	hitTestPoint(shape: Shape, x: number, y: number): boolean {
		if (!isPoint(shape)) return false;
		const dx = x - shape.x;
		const dy = y - shape.y;
		return dx * dx + dy * dy <= HIT_TOLERANCE * HIT_TOLERANCE;
	}

	/**
	 * Test if coordinates hit a rectangle shape
	 */
	hitTestRectangle(rect: Rectangle, x: number, y: number): boolean {
		return (
			x >= rect.x &&
			x <= rect.x + rect.width &&
			y >= rect.y &&
			y <= rect.y + rect.height
		);
	}

	/**
	 * Test if coordinates hit a resize handle
	 * Returns the handle if hit, null otherwise
	 */
	hitTestResizeHandle(
		rect: Rectangle,
		x: number,
		y: number,
	): ResizeHandle | null {
		const handleSize = RESIZE_HANDLE_SIZE;
		const halfSize = handleSize / 2;

		// Top-left handle
		if (
			x >= rect.x - halfSize &&
			x <= rect.x + halfSize &&
			y >= rect.y - halfSize &&
			y <= rect.y + halfSize
		) {
			return "top-left";
		}

		// Top-right handle
		if (
			x >= rect.x + rect.width - halfSize &&
			x <= rect.x + rect.width + halfSize &&
			y >= rect.y - halfSize &&
			y <= rect.y + halfSize
		) {
			return "top-right";
		}

		// Bottom-left handle
		if (
			x >= rect.x - halfSize &&
			x <= rect.x + halfSize &&
			y >= rect.y + rect.height - halfSize &&
			y <= rect.y + rect.height + halfSize
		) {
			return "bottom-left";
		}

		// Bottom-right handle
		if (
			x >= rect.x + rect.width - halfSize &&
			x <= rect.x + rect.width + halfSize &&
			y >= rect.y + rect.height - halfSize &&
			y <= rect.y + rect.height + halfSize
		) {
			return "bottom-right";
		}

		return null;
	}

	/**
	 * Get resize handle position based on cursor location
	 */
	getResizeHandleForPosition(
		rect: Rectangle,
		x: number,
		y: number,
	): ResizeHandle | null {
		return this.hitTestResizeHandle(rect, x, y);
	}

	/**
	 * Calculate new rectangle dimensions based on resize handle drag
	 */
	calculateResize(
		rect: Rectangle,
		handle: ResizeHandle,
		mouseX: number,
		mouseY: number,
		minSize: number = 10,
	): Rectangle {
		let newX = rect.x;
		let newY = rect.y;
		let newWidth = rect.width;
		let newHeight = rect.height;

		switch (handle) {
			case "top-left": {
				const dx = mouseX - rect.x;
				const dy = mouseY - rect.y;
				newX = mouseX;
				newY = mouseY;
				newWidth = Math.max(minSize, rect.width - dx);
				newHeight = Math.max(minSize, rect.height - dy);
				break;
			}

			case "top-right": {
				const dx = mouseX - (rect.x + rect.width);
				const dy = mouseY - rect.y;
				newY = mouseY;
				newWidth = Math.max(minSize, rect.width + dx);
				newHeight = Math.max(minSize, rect.height - dy);
				break;
			}

			case "bottom-left": {
				const dx = mouseX - rect.x;
				const dy = mouseY - (rect.y + rect.height);
				newX = mouseX;
				newWidth = Math.max(minSize, rect.width - dx);
				newHeight = Math.max(minSize, rect.height + dy);
				break;
			}

			case "bottom-right": {
				const dx = mouseX - (rect.x + rect.width);
				const dy = mouseY - (rect.y + rect.height);
				newWidth = Math.max(minSize, rect.width + dx);
				newHeight = Math.max(minSize, rect.height + dy);
				break;
			}
		}

		return {
			id: rect.id,
			type: "rectangle",
			x: newX,
			y: newY,
			width: newWidth,
			height: newHeight,
			createdAt: rect.createdAt,
		};
	}

	/**
	 * Calculate new rectangle for square creation (maintain aspect ratio)
	 */
	calculateSquareResize(
		startX: number,
		startY: number,
		currentX: number,
		currentY: number,
	): { x: number; y: number; width: number; height: number } {
		const width = currentX - startX;
		const height = currentY - startY;

		// Use the larger dimension and adjust the smaller one
		const size = Math.max(Math.abs(width), Math.abs(height));

		// Determine direction
		const signX = Math.sign(width);
		const signY = Math.sign(height);

		// Calculate final rectangle
		const finalWidth = size * signX;
		const finalHeight = size * signY;

		// Adjust position based on direction
		let x = startX;
		let y = startY;

		if (signX < 0) {
			x = startX + finalWidth;
		}
		if (signY < 0) {
			y = startY + finalHeight;
		}

		return {
			x,
			y,
			width: Math.abs(finalWidth),
			height: Math.abs(finalHeight),
		};
	}

	/**
	 * Check if a rectangle is a square
	 */
	isSquare(rect: Rectangle, tolerance: number = 2): boolean {
		return Math.abs(rect.width - rect.height) < tolerance;
	}

	/**
	 * Get the shape at a specific position, considering z-index
	 * Points are always on top of rectangles
	 */
	getShapeAtPosition(
		shapes: Shape[],
		x: number,
		y: number,
	): { shape: Shape; isPoint: boolean } | null {
		// First, check points (top layer)
		const pointShapes = shapes.filter(isPoint);
		for (let i = pointShapes.length - 1; i >= 0; i--) {
			if (this.hitTestPoint(pointShapes[i], x, y)) {
				return { shape: pointShapes[i], isPoint: true };
			}
		}

		// Then check rectangles
		const rectShapes = shapes.filter(isRectangle);
		for (let i = rectShapes.length - 1; i >= 0; i--) {
			if (this.hitTestRectangle(rectShapes[i], x, y)) {
				return { shape: rectShapes[i], isPoint: false };
			}
		}

		return null;
	}
}

/** Singleton instance */
export const canvasEngine = new CanvasEngine();
