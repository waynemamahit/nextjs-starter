/**
 * Canvas Renderer
 * Handles all canvas drawing operations
 */

import type { Point, Rectangle, Shape, ShapeId } from "../types";
import {
	CANVAS_BACKGROUND,
	isPoint,
	isRectangle,
	isSquare,
	LABEL_BACKGROUND,
	LABEL_COLOR,
	LABEL_FONT,
	LABEL_PADDING,
	POINT_COLOR,
	POINT_RADIUS,
	RECTANGLE_FILL_COLOR,
	RECTANGLE_STROKE_COLOR,
	RECTANGLE_STROKE_WIDTH,
	RESIZE_HANDLE_COLOR,
	RESIZE_HANDLE_FILL_COLOR,
	RESIZE_HANDLE_SIZE,
	SELECTION_COLOR,
	SELECTION_DASH,
	SELECTION_STROKE_WIDTH,
	SQUARE_FILL_COLOR,
	SQUARE_STROKE_COLOR,
	SQUARE_TOLERANCE,
} from "../types";

/** Canvas rendering context */
export interface RenderContext {
	ctx: CanvasRenderingContext2D;
	dpr: number;
}

/** Label to display on canvas */
export interface CanvasLabel {
	text: string;
	x: number;
	y: number;
}

/** Canvas Renderer class */
export class CanvasRenderer {
	private ctx: CanvasRenderingContext2D;
	private dpr: number;
	private canvas: HTMLCanvasElement;

	/**
	 * Create a new CanvasRenderer
	 * @param canvas - The canvas element to render on
	 * @param dpr - Device pixel ratio for high-DPI displays (default: 1)
	 */
	constructor(canvas: HTMLCanvasElement, dpr: number = 1) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
		this.dpr = dpr;
		this.resizeCanvas();
	}

	/**
	 * Resize canvas to match display size
	 */
	resizeCanvas(width?: number, height?: number) {
		const displayWidth = width || this.canvas.offsetWidth;
		const displayHeight = height || this.canvas.offsetHeight;

		// Set canvas size in pixels (scaled by DPR)
		this.canvas.width = displayWidth * this.dpr;
		this.canvas.height = displayHeight * this.dpr;

		// Scale the context to ensure correct drawing operations
		this.ctx.scale(this.dpr, this.dpr);

		// Clear and redraw
		this.clear();
	}

	/**
	 * Clear the canvas
	 */
	clear() {
		this.ctx.save();
		this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
		this.ctx.clearRect(
			0,
			0,
			this.canvas.width / this.dpr,
			this.canvas.height / this.dpr,
		);
		this.ctx.restore();
	}

	/**
	 * Draw all shapes on the canvas
	 */
	drawShapes(
		shapes: Shape[],
		selectedShapeId: ShapeId | null,
		showHandles: boolean = false,
	) {
		// Clear canvas
		this.clear();

		// Draw background
		this.drawBackground();

		// Draw rectangles first (bottom layer)
		const rectangles = shapes.filter(isRectangle);
		for (const rect of rectangles) {
			const isSelected = selectedShapeId === rect.id;
			this.drawRectangle(rect, isSelected, showHandles && isSelected);
			// Draw dimension label on selected rectangle
			if (isSelected && showHandles) {
				this.drawDimensionLabelForShape(rect);
			}
		}

		// Draw points on top
		const points = shapes.filter(isPoint);
		for (const point of points) {
			this.drawPoint(point, selectedShapeId === point.id);
		}
	}

	/**
	 * Draw background
	 */
	private drawBackground() {
		this.ctx.save();
		this.ctx.fillStyle = CANVAS_BACKGROUND;
		this.ctx.fillRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);
		this.ctx.restore();
	}

	/**
	 * Draw a point
	 */
	drawPoint(point: Point, isSelected: boolean) {
		this.ctx.save();

		// Draw point circle
		this.ctx.beginPath();
		this.ctx.arc(point.x, point.y, POINT_RADIUS, 0, Math.PI * 2);
		this.ctx.fillStyle = isSelected ? SELECTION_COLOR : POINT_COLOR;
		this.ctx.fill();

		// Draw selection ring if selected
		if (isSelected) {
			this.ctx.beginPath();
			this.ctx.arc(point.x, point.y, POINT_RADIUS + 3, 0, Math.PI * 2);
			this.ctx.strokeStyle = SELECTION_COLOR;
			this.ctx.lineWidth = 2;
			this.ctx.stroke();
		}

		this.ctx.restore();
	}

	/**
	 * Draw a rectangle or square
	 */
	drawRectangle(rect: Rectangle, isSelected: boolean, showHandles: boolean) {
		this.ctx.save();

		// Determine if it's a square
		const square = isSquare(rect, SQUARE_TOLERANCE);

		// Set colors based on type
		const strokeColor = square ? SQUARE_STROKE_COLOR : RECTANGLE_STROKE_COLOR;
		const fillColor = square ? SQUARE_FILL_COLOR : RECTANGLE_FILL_COLOR;

		// Draw fill
		this.ctx.fillStyle = fillColor;
		this.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

		// Draw stroke
		this.ctx.strokeStyle = isSelected ? SELECTION_COLOR : strokeColor;
		this.ctx.lineWidth = isSelected
			? SELECTION_STROKE_WIDTH
			: RECTANGLE_STROKE_WIDTH;
		this.ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

		// Draw selection dashed border if selected
		if (isSelected) {
			this.ctx.save();
			this.ctx.strokeStyle = SELECTION_COLOR;
			this.ctx.lineWidth = 2;
			this.ctx.setLineDash(SELECTION_DASH);
			this.ctx.strokeRect(
				rect.x - 2,
				rect.y - 2,
				rect.width + 4,
				rect.height + 4,
			);
			this.ctx.restore();
		}

		// Draw resize handles if selected
		if (showHandles) {
			this.drawResizeHandles(rect);
		}

		this.ctx.restore();
	}

	/**
	 * Draw resize handles on a rectangle
	 */
	private drawResizeHandles(rect: Rectangle) {
		const handleSize = RESIZE_HANDLE_SIZE;
		const halfSize = handleSize / 2;

		this.ctx.save();
		this.ctx.fillStyle = RESIZE_HANDLE_FILL_COLOR;
		this.ctx.strokeStyle = RESIZE_HANDLE_COLOR;
		this.ctx.lineWidth = 1;

		// Draw four handles
		const handles = [
			{ x: rect.x, y: rect.y }, // top-left
			{ x: rect.x + rect.width, y: rect.y }, // top-right
			{ x: rect.x, y: rect.y + rect.height }, // bottom-left
			{ x: rect.x + rect.width, y: rect.y + rect.height }, // bottom-right
		];

		for (const handle of handles) {
			this.ctx.beginPath();
			this.ctx.arc(handle.x, handle.y, halfSize, 0, Math.PI * 2);
			this.ctx.fill();
			this.ctx.stroke();
		}

		this.ctx.restore();
	}

	/**
	 * Draw a label on the canvas
	 */
	drawLabel(label: CanvasLabel) {
		this.ctx.save();

		// Calculate text dimensions
		this.ctx.font = LABEL_FONT;
		const textMetrics = this.ctx.measureText(label.text);
		const textWidth = textMetrics.width;
		const textHeight = parseInt(LABEL_FONT, 10) || 12;

		// Draw background
		this.ctx.fillStyle = LABEL_BACKGROUND;
		this.ctx.fillRect(
			label.x - LABEL_PADDING,
			label.y - textHeight - LABEL_PADDING,
			textWidth + LABEL_PADDING * 2,
			textHeight + LABEL_PADDING * 2,
		);

		// Draw text
		this.ctx.fillStyle = LABEL_COLOR;
		this.ctx.fillText(label.text, label.x, label.y - LABEL_PADDING);

		this.ctx.restore();
	}

	/**
	 * Draw dimension label for a rectangle
	 */
	drawDimensionLabel(rect: Rectangle, x: number, y: number) {
		const width = rect.width;
		const height = rect.height;
		const area = width * height;
		const labelText = `W: ${Math.round(width)}px, H: ${Math.round(height)}px, Area: ${Math.round(area)}px²`;

		this.drawLabel({ text: labelText, x, y });
	}

	/**
	 * Draw dimension label on a shape at a good position
	 */
	drawDimensionLabelForShape(shape: Shape) {
		if (isPoint(shape)) {
			// For points, show coordinates
			this.drawPointLabel(shape, shape.x + 10, shape.y - 10);
		} else if (isRectangle(shape)) {
			// For rectangles, show dimensions at bottom-right
			this.drawDimensionLabel(
				shape,
				shape.x + shape.width + 5,
				shape.y + shape.height + 5,
			);
		}
	}

	/**
	 * Draw point coordinate label
	 */
	drawPointLabel(point: Point, x: number, y: number) {
		const labelText = `(${Math.round(point.x)}, ${Math.round(point.y)})`;
		this.drawLabel({ text: labelText, x, y });
	}

	/**
	 * Draw creation preview (for rectangle being created)
	 */
	drawCreationPreview(
		startX: number,
		startY: number,
		currentX: number,
		currentY: number,
		isSquare: boolean = false,
	) {
		this.ctx.save();

		let x = startX;
		let y = startY;
		let width = currentX - startX;
		let height = currentY - startY;

		// For square, adjust to maintain aspect ratio
		if (isSquare) {
			const size = Math.max(Math.abs(width), Math.abs(height));
			const signX = Math.sign(width);
			const signY = Math.sign(height);

			if (signX < 0) x = startX + width;
			if (signY < 0) y = startY + height;

			width = size * signX;
			height = size * signY;
		}

		// Normalize to positive width/height
		if (width < 0) {
			x += width;
			width = -width;
		}
		if (height < 0) {
			y += height;
			height = -height;
		}

		// Draw semi-transparent preview
		this.ctx.fillStyle = "rgba(0, 0, 255, 0.1)";
		this.ctx.fillRect(x, y, width, height);

		this.ctx.strokeStyle = "#0000ff";
		this.ctx.lineWidth = 1;
		this.ctx.setLineDash([3, 3]);
		this.ctx.strokeRect(x, y, width, height);
		this.ctx.setLineDash([]);

		// Draw dimension label
		this.drawDimensionLabel(
			{ id: "", type: "rectangle", x, y, width, height, createdAt: Date.now() },
			currentX,
			currentY,
		);

		this.ctx.restore();
	}

	/**
	 * Get canvas element
	 */
	getCanvas(): HTMLCanvasElement {
		return this.canvas;
	}

	/**
	 * Get 2D context
	 */
	getContext(): CanvasRenderingContext2D {
		return this.ctx;
	}
}
