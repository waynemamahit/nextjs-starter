/**
 * Canvas Shape Types
 * Defines type-safe interfaces for all canvas shapes
 */

/** Unique identifier type for shapes */
export type ShapeId = string;

/** Base shape properties common to all shape types */
export interface BaseShape {
	id: ShapeId;
	type: ShapeType;
	createdAt: number;
}

/** Discriminated union of all shape types */
export type ShapeType = "point" | "rectangle";

/** Point shape representing a single coordinate on the canvas */
export interface Point extends BaseShape {
	type: "point";
	x: number;
	y: number;
}

/** Rectangle shape with position, width, and height */
export interface Rectangle extends BaseShape {
	type: "rectangle";
	x: number;
	y: number;
	width: number;
	height: number;
}

/** Union type of all possible shapes */
export type Shape = Point | Rectangle;

/** Type guard for Point shapes */
export function isPoint(shape: Shape): shape is Point {
	return shape.type === "point";
}

/** Type guard for Rectangle shapes */
export function isRectangle(shape: Shape): shape is Rectangle {
	return shape.type === "rectangle";
}

/** Check if a rectangle is a square (width === height within tolerance) */
export function isSquare(rect: Rectangle, tolerance: number = 2): boolean {
	return Math.abs(rect.width - rect.height) < tolerance;
}

/** Create a new unique ID for shapes */
export function generateShapeId(): ShapeId {
	return `shape-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
