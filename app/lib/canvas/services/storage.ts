/**
 * Canvas Storage
 * Handles localStorage persistence for canvas state
 */

import type { CanvasState, Shape } from "../types";

/** Storage key for canvas state */
const CANVAS_STATE_KEY = "canvas-state";

/** Canvas Storage class */
export class CanvasStorage {
	/**
	 * Save canvas state to localStorage
	 */
	saveState(state: CanvasState): void {
		try {
			const serializableState = this.serializeState(state);
			localStorage.setItem(CANVAS_STATE_KEY, JSON.stringify(serializableState));
		} catch (error) {
			console.error("Failed to save canvas state:", error);
		}
	}

	/**
	 * Load canvas state from localStorage
	 */
	loadState(): CanvasState | null {
		try {
			const saved = localStorage.getItem(CANVAS_STATE_KEY);
			if (!saved) return null;

			const parsed = JSON.parse(saved);
			return this.deserializeState(parsed);
		} catch (error) {
			console.error("Failed to load canvas state:", error);
			return null;
		}
	}

	/**
	 * Clear canvas state from localStorage
	 */
	clearState(): void {
		try {
			localStorage.removeItem(CANVAS_STATE_KEY);
		} catch (error) {
			console.error("Failed to clear canvas state:", error);
		}
	}

	/**
	 * Check if there's saved state
	 */
	hasSavedState(): boolean {
		return localStorage.getItem(CANVAS_STATE_KEY) !== null;
	}

	/**
	 * Serialize state for storage
	 * Removes non-serializable properties and circular references
	 */
	private serializeState(state: CanvasState): object {
		return {
			shapes: state.shapes,
			selectedShapeId: state.selectedShapeId,
			// Note: history and redoStack are NOT persisted
			// They will be reset on page load
		};
	}

	/**
	 * Deserialize state from storage
	 */
	private deserializeState(data: unknown): CanvasState {
		// This is a simplified version - in a real implementation,
		// we would validate the data structure properly
		const stateData = data as {
			shapes: Shape[];
			selectedShapeId: string | null;
		};

		return {
			shapes: stateData.shapes || [],
			selectedShapeId: stateData.selectedShapeId || null,
			history: [],
			redoStack: [],
			interactionMode: "idle",
			resizeHandle: null,
		};
	}
}

/** Singleton instance */
export const canvasStorage = new CanvasStorage();
