/**
 * Canvas Reducer
 * Manages canvas state transitions based on actions
 */

import {
	CanvasActionType,
	type CanvasActionUnion,
	type CanvasState,
	type CreatePointActionInternal,
	type CreateRectangleActionInternal,
	type DeleteShapeActionInternal,
	generateShapeId,
	initialCanvasState,
	isRectangle,
	MAX_HISTORY_SIZE,
	type MoveShapeActionInternal,
	type Point,
	type Rectangle,
	type ResetActionInternal,
	type ResizeShapeActionInternal,
	type Shape,
} from "../types";

/**
 * Create a point shape
 */
function createPoint(x: number, y: number): Point {
	return {
		id: generateShapeId(),
		type: "point",
		x,
		y,
		createdAt: Date.now(),
	};
}

/**
 * Create a rectangle shape
 */
function createRectangle(
	x: number,
	y: number,
	width: number,
	height: number,
): Rectangle {
	return {
		id: generateShapeId(),
		type: "rectangle",
		x,
		y,
		width,
		height,
		createdAt: Date.now(),
	};
}

/**
 * Find shape by ID
 */
function findShape(shapes: Shape[], shapeId: string): Shape | undefined {
	return shapes.find((s) => s.id === shapeId);
}

/**
 * Find rectangle by ID
 */
function findRectangle(
	shapes: Shape[],
	shapeId: string,
): Rectangle | undefined {
	const shape = findShape(shapes, shapeId);
	return shape && isRectangle(shape) ? shape : undefined;
}

/**
 * Remove shape by ID
 */
function removeShape(shapes: Shape[], shapeId: string): Shape[] {
	return shapes.filter((s) => s.id !== shapeId);
}

/**
 * Update shape by ID
 */
function updateShape(
	shapes: Shape[],
	shapeId: string,
	updater: (shape: Shape) => Shape,
): Shape[] {
	return shapes.map((s) => (s.id === shapeId ? updater(s) : s));
}

/**
 * Canvas reducer function
 */
export function canvasReducer(
	state: CanvasState,
	action: CanvasActionUnion,
): CanvasState {
	switch (action.type) {
		case CanvasActionType.CREATE_POINT: {
			const point = createPoint(action.x, action.y);
			const historyAction: CreatePointActionInternal = {
				...action,
				timestamp: Date.now(),
				_shapeId: point.id,
			};
			return {
				...state,
				shapes: [...state.shapes, point],
				history: [...state.history.slice(-MAX_HISTORY_SIZE + 1), historyAction],
				redoStack: [],
				interactionMode: "idle",
			};
		}

		case CanvasActionType.CREATE_RECTANGLE: {
			const rectangle = createRectangle(
				action.x,
				action.y,
				action.width,
				action.height,
			);
			const historyAction: CreateRectangleActionInternal = {
				...action,
				timestamp: Date.now(),
				_shapeId: rectangle.id,
			};
			return {
				...state,
				shapes: [...state.shapes, rectangle],
				history: [...state.history.slice(-MAX_HISTORY_SIZE + 1), historyAction],
				redoStack: [],
				interactionMode: "idle",
			};
		}

		case CanvasActionType.SELECT_SHAPE: {
			return {
				...state,
				selectedShapeId: action.shapeId,
				interactionMode: "idle",
				resizeHandle: null,
			};
		}

		case CanvasActionType.DESELECT_SHAPE: {
			return {
				...state,
				selectedShapeId: null,
				interactionMode: "idle",
				resizeHandle: null,
			};
		}

		case CanvasActionType.MOVE_SHAPE: {
			const shape = findShape(state.shapes, action.shapeId);
			if (!shape) return state;

			const newShape = {
				...shape,
				x: shape.x + action.dx,
				y: shape.y + action.dy,
			};

			const historyAction: MoveShapeActionInternal = {
				...action,
				timestamp: Date.now(),
				_prevX: shape.x,
				_prevY: shape.y,
			};
			return {
				...state,
				shapes: updateShape(state.shapes, action.shapeId, () => newShape),
				history: [...state.history.slice(-MAX_HISTORY_SIZE + 1), historyAction],
				redoStack: [],
				interactionMode: "idle",
			};
		}

		case CanvasActionType.RESIZE_SHAPE: {
			const rectangle = findRectangle(state.shapes, action.shapeId);
			if (!rectangle) return state;

			const newShape: Rectangle = {
				...rectangle,
				x: action.newX,
				y: action.newY,
				width: action.newWidth,
				height: action.newHeight,
			};

			const historyAction: ResizeShapeActionInternal = {
				...action,
				timestamp: Date.now(),
				_prevX: rectangle.x,
				_prevY: rectangle.y,
				_prevWidth: rectangle.width,
				_prevHeight: rectangle.height,
			};
			return {
				...state,
				shapes: updateShape(state.shapes, action.shapeId, () => newShape),
				history: [...state.history.slice(-MAX_HISTORY_SIZE + 1), historyAction],
				redoStack: [],
				interactionMode: "idle",
				resizeHandle: null,
			};
		}

		case CanvasActionType.DELETE_SHAPE: {
			const shape = findShape(state.shapes, action.shapeId);
			if (!shape) return state;

			const historyAction: DeleteShapeActionInternal = {
				...action,
				timestamp: Date.now(),
				_deletedShape: shape,
			};
			return {
				...state,
				shapes: removeShape(state.shapes, action.shapeId),
				selectedShapeId:
					state.selectedShapeId === action.shapeId
						? null
						: state.selectedShapeId,
				history: [...state.history.slice(-MAX_HISTORY_SIZE + 1), historyAction],
				redoStack: [],
				interactionMode: "idle",
				resizeHandle: null,
			};
		}

		case CanvasActionType.UNDO: {
			if (state.history.length === 0) return state;

			const lastAction = state.history[state.history.length - 1];
			const newHistory = state.history.slice(0, -1);
			let newState = { ...state, history: newHistory };
			let actionToStore: CanvasActionUnion | null = null;

			switch (lastAction.type) {
				case CanvasActionType.CREATE_POINT:
				case CanvasActionType.CREATE_RECTANGLE: {
					const internalAction = lastAction as
						| CreatePointActionInternal
						| CreateRectangleActionInternal;
					const shapeId = internalAction._shapeId;
					if (shapeId) {
						newState = {
							...newState,
							shapes: removeShape(newState.shapes, shapeId),
						};
						// Store the original action for redo
						const { _shapeId, ...baseAction } = internalAction;
						actionToStore = { ...baseAction, timestamp: Date.now() };
					}
					break;
				}

				case CanvasActionType.DELETE_SHAPE: {
					const internalAction = lastAction as DeleteShapeActionInternal;
					const deletedShape = internalAction._deletedShape;
					if (deletedShape) {
						newState = {
							...newState,
							shapes: [...newState.shapes, deletedShape],
						};
						// Store the original action for redo
						const shapeType = deletedShape.type;
						if (shapeType === "rectangle") {
							const r = deletedShape as Rectangle;
							actionToStore = {
								type: CanvasActionType.CREATE_RECTANGLE,
								x: r.x,
								y: r.y,
								width: r.width,
								height: r.height,
								timestamp: Date.now(),
							};
						} else {
							const p = deletedShape as Point;
							actionToStore = {
								type: CanvasActionType.CREATE_POINT,
								x: p.x,
								y: p.y,
								timestamp: Date.now(),
							};
						}
					}
					break;
				}

				case CanvasActionType.MOVE_SHAPE: {
					const internalAction = lastAction as MoveShapeActionInternal;
					const shapeId = internalAction.shapeId;
					const prevX = internalAction._prevX ?? 0;
					const prevY = internalAction._prevY ?? 0;
					newState = {
						...newState,
						shapes: updateShape(newState.shapes, shapeId, (s) => ({
							...s,
							x: prevX,
							y: prevY,
						})),
					};
					// Store the original action for redo
					const { _prevX, _prevY, ...baseAction } = internalAction;
					actionToStore = { ...baseAction, timestamp: Date.now() };
					break;
				}

				case CanvasActionType.RESIZE_SHAPE: {
					const internalAction = lastAction as ResizeShapeActionInternal;
					const shapeId = internalAction.shapeId;
					const prevX = internalAction._prevX ?? 0;
					const prevY = internalAction._prevY ?? 0;
					const prevWidth = internalAction._prevWidth ?? 0;
					const prevHeight = internalAction._prevHeight ?? 0;
					newState = {
						...newState,
						shapes: updateShape(newState.shapes, shapeId, (s) => ({
							...s,
							x: prevX,
							y: prevY,
							width: prevWidth,
							height: prevHeight,
						})),
					};
					// Store the original action for redo
					const { _prevX, _prevY, _prevWidth, _prevHeight, ...baseAction } =
						internalAction;
					actionToStore = {
						...baseAction,
						timestamp: Date.now(),
						newX: internalAction.newX,
						newY: internalAction.newY,
						newWidth: internalAction.newWidth,
						newHeight: internalAction.newHeight,
					};
					break;
				}

				case CanvasActionType.SELECT_SHAPE: {
					newState = {
						...newState,
						selectedShapeId: null,
					};
					// Store the original action for redo
					actionToStore = { ...lastAction, timestamp: Date.now() };
					break;
				}

				case CanvasActionType.DESELECT_SHAPE: {
					const prevSelectedId = state.selectedShapeId;
					newState = {
						...newState,
						selectedShapeId: prevSelectedId,
					};
					// Store the original action for redo
					actionToStore = {
						type: CanvasActionType.DESELECT_SHAPE,
						timestamp: Date.now(),
					};
					break;
				}

				case CanvasActionType.RESET: {
					const internalAction = lastAction as ResetActionInternal;
					const prevShapes = internalAction._prevShapes || [];
					newState = {
						...newState,
						shapes: prevShapes,
						selectedShapeId: null,
					};
					// Store the original action for redo
					actionToStore = {
						type: CanvasActionType.RESET,
						timestamp: Date.now(),
					};
					break;
				}

				default:
					break;
			}

			return {
				...newState,
				redoStack: actionToStore
					? [...newState.redoStack, actionToStore]
					: newState.redoStack,
			};
		}

		case CanvasActionType.REDO: {
			if (state.redoStack.length === 0) return state;

			const actionToRedo = state.redoStack[state.redoStack.length - 1];
			const newRedoStack = state.redoStack.slice(0, -1);

			const reducedState = canvasReducer(state, actionToRedo);

			return {
				...reducedState,
				redoStack: newRedoStack,
			};
		}

		case CanvasActionType.RESET: {
			const historyAction: ResetActionInternal = {
				...action,
				timestamp: Date.now(),
				_prevShapes: state.shapes,
			};
			return {
				...initialCanvasState,
				history: [...state.history.slice(-MAX_HISTORY_SIZE + 1), historyAction],
				redoStack: [],
			};
		}

		case CanvasActionType.LOAD_STATE: {
			return {
				...state,
				shapes: action.shapes,
			};
		}

		default:
			return state;
	}
}
