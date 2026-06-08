"use client";

import { useState } from "react";
import { useCanvas } from "../engine/context";
import { CanvasExporter } from "../services/exporter";
import { canvasStorage } from "../services/storage";
import { CanvasActionType } from "../types";

/**
 * Controls component props
 */
export interface ControlsProps {
	/** Reference to the canvas element for export */
	canvasElement?: HTMLCanvasElement | null;
}

/**
 * Controls component
 * Provides UI buttons for canvas actions: delete, undo, redo, export, reset
 */
export function Controls({ canvasElement }: ControlsProps = {}) {
	const { state, dispatch } = useCanvas();
	const [showExportMenu, setShowExportMenu] = useState(false);

	// Delete selected shape
	const handleDelete = () => {
		if (state.selectedShapeId) {
			dispatch({
				type: CanvasActionType.DELETE_SHAPE,
				shapeId: state.selectedShapeId,
				timestamp: Date.now(),
			});
		}
	};

	// Undo
	const handleUndo = () => {
		dispatch({ type: CanvasActionType.UNDO, timestamp: Date.now() });
	};

	// Redo
	const handleRedo = () => {
		dispatch({ type: CanvasActionType.REDO, timestamp: Date.now() });
	};

	// Reset canvas
	const handleReset = () => {
		dispatch({ type: CanvasActionType.RESET, timestamp: Date.now() });
		canvasStorage.clearState();
	};

	// Export
	const handleExport = (format: "png" | "jpg" | "svg") => {
		const canvas = canvasElement;
		if (canvas) {
			const exporter = new CanvasExporter(canvas);
			if (format === "png") {
				exporter.exportToPNG();
			} else if (format === "jpg") {
				exporter.exportToJPG();
			} else if (format === "svg") {
				exporter.exportToSVG(state.shapes);
			}
		}
		setShowExportMenu(false);
	};

	return (
		<div className="flex flex-wrap gap-2 p-4 bg-base-100 rounded-lg shadow-md border border-base-300">
			{/* Delete button */}
			<button
				type="button"
				onClick={handleDelete}
				disabled={!state.selectedShapeId}
				className="btn btn-error btn-sm text-white"
				aria-label="Delete selected shape"
			>
				Delete
			</button>

			{/* Undo button */}
			<button
				type="button"
				onClick={handleUndo}
				disabled={state.history.length === 0}
				className="btn btn-primary btn-sm text-white"
				aria-label="Undo last action"
			>
				Undo
			</button>

			{/* Redo button */}
			<button
				type="button"
				onClick={handleRedo}
				disabled={state.redoStack.length === 0}
				className="btn btn-primary btn-sm text-white"
				aria-label="Redo last undone action"
			>
				Redo
			</button>

			{/* Export button with dropdown */}
			<div
				className="relative inline-block dropdown"
				data-testid="export-dropdown"
			>
				<button
					type="button"
					onClick={() => setShowExportMenu(!showExportMenu)}
					className="btn btn-success btn-sm text-white"
					data-testid="export-button"
					aria-label="Export canvas"
				>
					Export
				</button>
				{showExportMenu && (
					<div
						className="absolute left-0 mt-1 w-32 bg-base-100 rounded-lg shadow-lg border border-base-300 z-50 p-1"
						data-testid="export-menu"
					>
						<button
							type="button"
							onClick={() => handleExport("png")}
							className="block w-full px-3 py-2 text-left text-sm hover:bg-base-200 rounded-md"
							data-testid="export-png"
						>
							PNG
						</button>
						<button
							type="button"
							onClick={() => handleExport("jpg")}
							className="block w-full px-3 py-2 text-left text-sm hover:bg-base-200 rounded-md"
							data-testid="export-jpg"
						>
							JPG
						</button>
						<button
							type="button"
							onClick={() => handleExport("svg")}
							className="block w-full px-3 py-2 text-left text-sm hover:bg-base-200 rounded-md"
							data-testid="export-svg"
						>
							SVG
						</button>
					</div>
				)}
			</div>

			{/* Reset button */}
			<button
				type="button"
				onClick={handleReset}
				className="btn btn-warning btn-sm text-white"
				aria-label="Reset canvas"
			>
				Reset
			</button>
		</div>
	);
}
