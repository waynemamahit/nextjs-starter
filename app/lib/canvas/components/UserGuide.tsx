"use client";

/**
 * User Guide component
 * Displays instructions for using the interactive canvas
 */
export function UserGuide() {
	return (
		<div className="card bg-base-100 border border-base-300 shadow-md w-full">
			<div className="card-body p-4">
				<h3 className="card-title text-lg font-semibold mb-3">How to Use</h3>
				<ul className="space-y-2 text-sm list-disc list-inside">
					<li>
						<strong>Click</strong> anywhere on canvas to create a point
					</li>
					<li>
						<strong>Click + Drag</strong> to create a rectangle
					</li>
					<li>
						<strong>Shift + Click + Drag</strong> to create a square
					</li>
					<li>
						<strong>Click</strong> on a shape to select it
					</li>
					<li>
						<strong>Drag</strong> a selected shape to move it
					</li>
					<li>
						<strong>Drag corners</strong> of a selected rectangle/square to
						resize
					</li>
					<li>
						<strong>Delete key</strong> to delete selected shape
					</li>
					<li>
						<strong>Ctrl+Z</strong> to undo last action
					</li>
					<li>
						<strong>Ctrl+Y</strong> to redo last undone action
					</li>
				</ul>
			</div>
		</div>
	);
}
