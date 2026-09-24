"use client";

import { useCanvas } from "../engine/context";
import { isRectangle, isSquare, SQUARE_TOLERANCE } from "../types";

/**
 * Statistics component
 * Displays count of points, rectangles, and squares on the canvas
 */
export function Statistics() {
	const { state } = useCanvas();

	// Count shapes by type
	const points = state.shapes.filter((s) => s.type === "point");
	const rectangles = state.shapes.filter(isRectangle);

	// Count squares (rectangles with width === height)
	const squares = rectangles.filter((r) => isSquare(r, SQUARE_TOLERANCE));
	const nonSquareRects = rectangles.length - squares.length;

	return (
		<div className="card bg-base-100 border border-base-300 shadow-md w-full">
			<div className="card-body p-4">
				<h3 className="card-title text-lg font-semibold mb-3">Statistics</h3>
				<ul className="space-y-2">
					<li className="text-sm">
						<span className="font-medium">Points:</span> {points.length}
					</li>
					<li className="text-sm">
						<span className="font-medium">Rectangles:</span> {nonSquareRects}
					</li>
					<li className="text-sm">
						<span className="font-medium">Squares:</span> {squares.length}
					</li>
					<li className="text-sm">
						<span className="font-medium">Total Shapes:</span>{" "}
						{state.shapes.length}
					</li>
				</ul>
			</div>
		</div>
	);
}
