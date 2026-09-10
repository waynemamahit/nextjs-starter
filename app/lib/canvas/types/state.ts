/**
 * Canvas State Types
 * Defines the state and action types for the canvas
 */

import type { Shape, ShapeId } from "./shapes";

/** Canvas interaction mode */
export type InteractionMode =
	| "idle"
	| "creatingPoint"
	| "creatingRectangle"
	| "dragging"
	| "resizing";

/** Resize handle position */
export type ResizeHandle =
	| "top-left"
	| "top-right"
	| "bottom-left"
	| "bottom-right";

/** Action types for canvas reducer */
export enum CanvasActionType {
	CREATE_POINT = "CREATE_POINT",
	CREATE_RECTANGLE = "CREATE_RECTANGLE",
	SELECT_SHAPE = "SELECT_SHAPE",
	DESELECT_SHAPE = "DESELECT_SHAPE",
	MOVE_SHAPE = "MOVE_SHAPE",
	RESIZE_SHAPE = "RESIZE_SHAPE",
	DELETE_SHAPE = "DELETE_SHAPE",
	UNDO = "UNDO",
	REDO = "REDO",
	RESET = "RESET",
	LOAD_STATE = "LOAD_STATE",
}

/** Base action interface */
export interface CanvasAction {
	type: CanvasActionType;
	timestamp: number;
}

/** Action to create a new point */
export interface CreatePointAction extends CanvasAction {
	type: CanvasActionType.CREATE_POINT;
	x: number;
	y: number;
}

/** Action to create a new rectangle */
export interface CreateRectangleAction extends CanvasAction {
	type: CanvasActionType.CREATE_RECTANGLE;
	x: number;
	y: number;
	width: number;
	height: number;
}

/** Action to select a shape */
export interface SelectShapeAction extends CanvasAction {
	type: CanvasActionType.SELECT_SHAPE;
	shapeId: ShapeId;
}

/** Action to deselect the current shape */
export interface DeselectShapeAction extends CanvasAction {
	type: CanvasActionType.DESELECT_SHAPE;
}

/** Action to move a shape */
export interface MoveShapeAction extends CanvasAction {
	type: CanvasActionType.MOVE_SHAPE;
	shapeId: ShapeId;
	dx: number;
	dy: number;
}

/** Action to resize a shape */
export interface ResizeShapeAction extends CanvasAction {
	type: CanvasActionType.RESIZE_SHAPE;
	shapeId: ShapeId;
	newX: number;
	newY: number;
	newWidth: number;
	newHeight: number;
}

/** Action to delete a shape */
export interface DeleteShapeAction extends CanvasAction {
	type: CanvasActionType.DELETE_SHAPE;
	shapeId: ShapeId;
}

/** Action to undo the last action */
export interface UndoAction extends CanvasAction {
	type: CanvasActionType.UNDO;
}

/** Action to redo the last undone action */
export interface RedoAction extends CanvasAction {
	type: CanvasActionType.REDO;
}

/** Action to reset the canvas */
export interface ResetAction extends CanvasAction {
	type: CanvasActionType.RESET;
}

/** Action to load saved state */
export interface LoadStateAction extends CanvasAction {
	type: CanvasActionType.LOAD_STATE;
	shapes: Shape[];
}

/** Internal action types with metadata for undo/redo */
export interface CreatePointActionInternal extends CreatePointAction {
	_shapeId?: ShapeId;
}

export interface CreateRectangleActionInternal extends CreateRectangleAction {
	_shapeId?: ShapeId;
}

export interface DeleteShapeActionInternal extends DeleteShapeAction {
	_deletedShape?: Shape;
}

export interface MoveShapeActionInternal extends MoveShapeAction {
	_prevX?: number;
	_prevY?: number;
}

export interface ResizeShapeActionInternal extends ResizeShapeAction {
	_prevX?: number;
	_prevY?: number;
	_prevWidth?: number;
	_prevHeight?: number;
}

export interface ResetActionInternal extends ResetAction {
	_prevShapes?: Shape[];
}

/** Union type of all canvas actions including internal metadata */
export type CanvasActionUnion =
	| CreatePointAction
	| CreateRectangleAction
	| SelectShapeAction
	| DeselectShapeAction
	| MoveShapeAction
	| ResizeShapeAction
	| DeleteShapeAction
	| UndoAction
	| RedoAction
	| ResetAction
	| LoadStateAction
	| CreatePointActionInternal
	| CreateRectangleActionInternal
	| DeleteShapeActionInternal
	| MoveShapeActionInternal
	| ResizeShapeActionInternal
	| ResetActionInternal;

/** Canvas state */
export interface CanvasState {
	shapes: Shape[];
	selectedShapeId: ShapeId | null;
	history: CanvasActionUnion[];
	redoStack: CanvasActionUnion[];
	interactionMode: InteractionMode;
	resizeHandle: ResizeHandle | null;
}

/** Initial canvas state */
export const initialCanvasState: CanvasState = {
	shapes: [],
	selectedShapeId: null,
	history: [],
	redoStack: [],
	interactionMode: "idle",
	resizeHandle: null,
};

/** Maximum history size to prevent memory issues */
export const MAX_HISTORY_SIZE = 100;
