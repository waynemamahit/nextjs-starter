"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCanvas } from "../engine/context";
import { canvasEngine } from "../services/engine";
import { CanvasRenderer } from "../services/renderer";
import { canvasStorage } from "../services/storage";
import {
	CANVAS_HEIGHT,
	CanvasActionType,
	CURSOR_CROSSHAIR,
	CURSOR_MOVE,
	CURSOR_RESIZE_NESW,
	CURSOR_RESIZE_NWSE,
	isPoint,
	isRectangle,
	type ResizeHandle,
	SAVE_DEBOUNCE_MS,
} from "../types";
import { debounce } from "../utils/debounce";

interface InteractionState {
	type: "creating" | "dragging" | "resizing";
	startX: number;
	startY: number;
	currentX: number;
	currentY: number;
	isShiftPressed: boolean;
	resizeHandle?: ResizeHandle;
}

/** Canvas component props */
export interface CanvasProps {
	/** Canvas width in pixels */
	width?: number;
	/** Canvas height in pixels */
	height?: number;
	/** Callback when canvas is mounted */
	onCanvasMount?: (canvas: HTMLCanvasElement | null) => void;
}

/**
 * Canvas component for drawing shapes
 * Handles mouse interactions for shape creation, selection, movement, and resizing
 */
export function Canvas({ height = CANVAS_HEIGHT, onCanvasMount }: CanvasProps) {
	const { state, dispatch } = useCanvas();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const rendererRef = useRef<CanvasRenderer | null>(null);
	const animationFrameRef = useRef<number>(0);
	const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
		null,
	);
	const [interaction, setInteraction] = useState<InteractionState | null>(null);
	const [dpr, setDpr] = useState<number>(1);
	const [canvasHeight, setCanvasHeight] = useState<number>(height);

	// Initialize
	useEffect(() => {
		const currentDpr =
			typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
		setDpr(currentDpr);
		setCanvasHeight(height);
	}, [height]);

	// Notify parent when canvas mounts
	useEffect(() => {
		if (canvasRef.current && onCanvasMount) {
			onCanvasMount(canvasRef.current);
			return () => onCanvasMount(null);
		}
	}, [onCanvasMount]);

	// Initialize renderer after DPR is set
	useEffect(() => {
		if (canvasRef.current && dpr > 0) {
			rendererRef.current = new CanvasRenderer(canvasRef.current, dpr);
			rendererRef.current.resizeCanvas(
				canvasRef.current.clientWidth,
				canvasHeight,
			);

			const savedState = canvasStorage.loadState();
			if (savedState?.shapes?.length) {
				dispatch({
					type: CanvasActionType.LOAD_STATE,
					shapes: savedState.shapes,
					timestamp: Date.now(),
				});
			}
		}

		return () => cancelAnimationFrame(animationFrameRef.current);
	}, [canvasHeight, dpr, dispatch]);

	// Save state with debounce
	const debouncedSave = useCallback(
		debounce(() => {
			if (state.shapes.length > 0) {
				canvasStorage.saveState(state);
			}
		}, SAVE_DEBOUNCE_MS),
		[],
	);

	useEffect(() => {
		if (state.shapes.length > 0) {
			debouncedSave();
		}
	}, [state.shapes, debouncedSave]);

	// Render loop
	useEffect(() => {
		if (!canvasRef.current || !rendererRef.current) return;

		const render = () => {
			const renderer = rendererRef.current;
			if (!renderer) return;
			renderer.clear();

			const showHandles =
				!!state.selectedShapeId && interaction?.type !== "resizing";
			renderer.drawShapes(state.shapes, state.selectedShapeId, showHandles);

			// Draw creation preview
			if (interaction?.type === "creating") {
				const endX = mousePos?.x ?? interaction.currentX;
				const endY = mousePos?.y ?? interaction.currentY;
				renderer.drawCreationPreview(
					interaction.startX,
					interaction.startY,
					endX,
					endY,
					interaction.isShiftPressed,
				);
			}

			// Draw resize preview
			if (interaction?.type === "resizing" && state.selectedShapeId) {
				const selectedShape = state.shapes.find(
					(s) => s.id === state.selectedShapeId,
				);
				if (
					selectedShape &&
					isRectangle(selectedShape) &&
					interaction.resizeHandle
				) {
					const endX = mousePos?.x ?? interaction.currentX;
					const endY = mousePos?.y ?? interaction.currentY;
					const newRect = canvasEngine.calculateResize(
						selectedShape,
						interaction.resizeHandle,
						endX,
						endY,
					);
					renderer.drawCreationPreview(
						newRect.x,
						newRect.y,
						newRect.x + newRect.width,
						newRect.y + newRect.height,
						false,
					);
				}
			}

			animationFrameRef.current = requestAnimationFrame(render);
		};

		animationFrameRef.current = requestAnimationFrame(render);
		return () => cancelAnimationFrame(animationFrameRef.current);
	}, [state, interaction, mousePos]);

	// Mouse move - track position
	const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		setMousePos({ x, y });

		updateCursor(x, y);

		if (interaction) {
			setInteraction((prev) =>
				prev ? { ...prev, currentX: x, currentY: y } : null,
			);
		}

		// Handle drag
		if (
			interaction?.type === "dragging" &&
			state.selectedShapeId &&
			e.buttons === 1
		) {
			const selectedShape = state.shapes.find(
				(s) => s.id === state.selectedShapeId,
			);
			if (selectedShape) {
				const dx = x - interaction.startX;
				const dy = y - interaction.startY;
				dispatch({
					type: CanvasActionType.MOVE_SHAPE,
					shapeId: selectedShape.id,
					dx,
					dy,
					timestamp: Date.now(),
				});
				setInteraction((prev) =>
					prev ? { ...prev, startX: x, startY: y } : null,
				);
			}
		}

		// Handle resize
		if (
			interaction?.type === "resizing" &&
			state.selectedShapeId &&
			e.buttons === 1
		) {
			const selectedShape = state.shapes.find(
				(s) => s.id === state.selectedShapeId,
			);
			if (
				selectedShape &&
				isRectangle(selectedShape) &&
				interaction.resizeHandle
			) {
				const newRect = canvasEngine.calculateResize(
					selectedShape,
					interaction.resizeHandle,
					x,
					y,
				);
				dispatch({
					type: CanvasActionType.RESIZE_SHAPE,
					shapeId: selectedShape.id,
					newX: newRect.x,
					newY: newRect.y,
					newWidth: newRect.width,
					newHeight: newRect.height,
					timestamp: Date.now(),
				});
			}
		}
	};

	// Mouse down
	const handleMouseDown = useCallback(
		(e: React.MouseEvent<HTMLCanvasElement>) => {
			const canvas = canvasRef.current;
			if (!canvas) return;

			const rect = canvas.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			// Check if we hit a resize handle on selected rectangle
			if (state.selectedShapeId) {
				const selectedShape = state.shapes.find(
					(s) => s.id === state.selectedShapeId,
				);
				if (selectedShape && isRectangle(selectedShape)) {
					const handle = canvasEngine.getResizeHandleForPosition(
						selectedShape,
						x,
						y,
					);
					if (handle) {
						setInteraction({
							type: "resizing",
							startX: x,
							startY: y,
							currentX: x,
							currentY: y,
							isShiftPressed: e.shiftKey,
							resizeHandle: handle,
						});
						return;
					}
					if (canvasEngine.hitTestRectangle(selectedShape, x, y)) {
						setInteraction({
							type: "dragging",
							startX: x,
							startY: y,
							currentX: x,
							currentY: y,
							isShiftPressed: e.shiftKey,
						});
						return;
					}
				}
				if (selectedShape && isPoint(selectedShape)) {
					if (canvasEngine.hitTestPoint(selectedShape, x, y)) {
						setInteraction({
							type: "dragging",
							startX: x,
							startY: y,
							currentX: x,
							currentY: y,
							isShiftPressed: e.shiftKey,
						});
						return;
					}
				}
			}

			// Check if we hit a shape for selection
			const hitResult = canvasEngine.getShapeAtPosition(state.shapes, x, y);
			if (hitResult) {
				dispatch({
					type: CanvasActionType.SELECT_SHAPE,
					shapeId: hitResult.shape.id,
					timestamp: Date.now(),
				});
				return;
			}

			// Click on empty area - deselect and prepare for creation
			dispatch({
				type: CanvasActionType.DESELECT_SHAPE,
				timestamp: Date.now(),
			});
			setInteraction({
				type: "creating",
				startX: x,
				startY: y,
				currentX: x,
				currentY: y,
				isShiftPressed: e.shiftKey,
			});
		},
		[state, dispatch],
	);

	// Mouse up
	const handleMouseUp = useCallback(
		(e: React.MouseEvent<HTMLCanvasElement>) => {
			const canvas = canvasRef.current;
			if (!canvas || !interaction) return;

			const rect = canvas.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			const endX = mousePos?.x ?? x;
			const endY = mousePos?.y ?? y;
			const dx = Math.abs(endX - interaction.startX);
			const dy = Math.abs(endY - interaction.startY);

			if (interaction.type === "creating") {
				if (dx < 3 && dy < 3) {
					dispatch({
						type: CanvasActionType.CREATE_POINT,
						x: interaction.startX,
						y: interaction.startY,
						timestamp: Date.now(),
					});
				} else {
					let finalX = interaction.startX;
					let finalY = interaction.startY;
					let finalWidth = endX - interaction.startX;
					let finalHeight = endY - interaction.startY;

					if (interaction.isShiftPressed) {
						const result = canvasEngine.calculateSquareResize(
							interaction.startX,
							interaction.startY,
							endX,
							endY,
						);
						finalX = result.x;
						finalY = result.y;
						finalWidth = result.width;
						finalHeight = result.height;
					}

					if (finalWidth < 0) {
						finalX += finalWidth;
						finalWidth = -finalWidth;
					}
					if (finalHeight < 0) {
						finalY += finalHeight;
						finalHeight = -finalHeight;
					}

					dispatch({
						type: CanvasActionType.CREATE_RECTANGLE,
						x: finalX,
						y: finalY,
						width: finalWidth,
						height: finalHeight,
						timestamp: Date.now(),
					});
				}
			}

			setInteraction(null);
		},
		[interaction, mousePos, dispatch],
	);

	const updateCursor = useCallback(
		(x: number, y: number) => {
			const canvas = canvasRef.current;
			if (!canvas) return;

			if (state.selectedShapeId && !interaction) {
				const selectedShape = state.shapes.find(
					(s) => s.id === state.selectedShapeId,
				);
				if (selectedShape) {
					if (isRectangle(selectedShape)) {
						const handle = canvasEngine.getResizeHandleForPosition(
							selectedShape,
							x,
							y,
						);
						if (handle) {
							canvas.style.cursor =
								handle === "top-left" || handle === "bottom-right"
									? CURSOR_RESIZE_NWSE
									: CURSOR_RESIZE_NESW;
							return;
						}
						if (canvasEngine.hitTestRectangle(selectedShape, x, y)) {
							canvas.style.cursor = CURSOR_MOVE;
							return;
						}
					} else if (isPoint(selectedShape)) {
						if (canvasEngine.hitTestPoint(selectedShape, x, y)) {
							canvas.style.cursor = CURSOR_MOVE;
							return;
						}
					}
				}
			}

			if (interaction) {
				if (interaction.type === "resizing") {
					if (
						interaction.resizeHandle === "top-left" ||
						interaction.resizeHandle === "bottom-right"
					) {
						canvas.style.cursor = CURSOR_RESIZE_NWSE;
					} else {
						canvas.style.cursor = CURSOR_RESIZE_NESW;
					}
					return;
				}
				if (interaction.type === "creating") {
					canvas.style.cursor = CURSOR_CROSSHAIR;
					return;
				}
				if (interaction.type === "dragging") {
					canvas.style.cursor = CURSOR_MOVE;
					return;
				}
			}

			const hitResult = canvasEngine.getShapeAtPosition(state.shapes, x, y);
			canvas.style.cursor = hitResult ? CURSOR_MOVE : CURSOR_CROSSHAIR;
		},
		[state, interaction],
	);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === "Delete" && state.selectedShapeId) {
				dispatch({
					type: CanvasActionType.DELETE_SHAPE,
					shapeId: state.selectedShapeId,
					timestamp: Date.now(),
				});
			}
			if (e.ctrlKey && e.key === "z") {
				e.preventDefault();
				dispatch({ type: CanvasActionType.UNDO, timestamp: Date.now() });
			}
			if (e.ctrlKey && e.key === "y") {
				e.preventDefault();
				dispatch({ type: CanvasActionType.REDO, timestamp: Date.now() });
			}
		},
		[state.selectedShapeId, dispatch],
	);

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [handleKeyDown]);

	useEffect(() => {
		const handleKeyDownShift = (e: KeyboardEvent) => {
			if (e.key === "Shift" && interaction) {
				setInteraction((prev) =>
					prev ? { ...prev, isShiftPressed: true } : null,
				);
			}
		};
		const handleKeyUpShift = (e: KeyboardEvent) => {
			if (e.key === "Shift" && interaction) {
				setInteraction((prev) =>
					prev ? { ...prev, isShiftPressed: false } : null,
				);
			}
		};

		window.addEventListener("keydown", handleKeyDownShift);
		window.addEventListener("keyup", handleKeyUpShift);
		return () => {
			window.removeEventListener("keydown", handleKeyDownShift);
			window.removeEventListener("keyup", handleKeyUpShift);
		};
	}, [interaction]);

	return (
		<canvas
			data-testid="canvas"
			ref={canvasRef}
			height={canvasHeight * dpr}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onMouseLeave={() => setInteraction(null)}
			style={{
				width: "100%",
				height: `${canvasHeight}px`,
				border: "2px solid #333",
				backgroundColor: "#f5f5f5",
				display: "block",
			}}
		/>
	);
}
