/**
 * Unit tests for CanvasStorage
 * Note: Full testing requires DOM environment (jsdom) for localStorage
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CanvasStorage } from "./storage";

const STORAGE_KEY = "canvas-state";

// Mock localStorage
const mockLocalStorage = (() => {
	let store: Record<string, string> = {};
	return {
		getItem: vi.fn((key: string) => store[key] ?? null),
		setItem: vi.fn((key: string, value: string) => {
			store[key] = value;
		}),
		removeItem: vi.fn((key: string) => {
			delete store[key];
		}),
		clear: vi.fn(() => {
			store = {};
		}),
	};
})();

describe("CanvasStorage", () => {
	let storage: CanvasStorage;

	beforeEach(() => {
		vi.stubGlobal("localStorage", mockLocalStorage);
		vi.resetAllMocks();
		storage = new CanvasStorage();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should be defined", () => {
		expect(CanvasStorage).toBeDefined();
	});

	it("should have saveState method", () => {
		expect(typeof CanvasStorage.prototype.saveState).toBe("function");
	});

	it("should have loadState method", () => {
		expect(typeof CanvasStorage.prototype.loadState).toBe("function");
	});

	it("should have clearState method", () => {
		expect(typeof CanvasStorage.prototype.clearState).toBe("function");
	});

	it("should have hasSavedState method", () => {
		expect(typeof CanvasStorage.prototype.hasSavedState).toBe("function");
	});

	it("should save state to localStorage", () => {
		const state = {
			shapes: [],
			selectedShapeId: null,
			history: [],
			redoStack: [],
			interactionMode: "idle" as const,
			resizeHandle: null,
		};
		storage.saveState(state);
		expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
			STORAGE_KEY,
			expect.any(String),
		);
	});

	it("should return null when loading non-existent state", () => {
		mockLocalStorage.getItem.mockReturnValue(null as unknown as string);
		const state = storage.loadState();
		expect(state).toBeNull();
	});

	it("should return state when loading existing state", () => {
		const savedState = {
			shapes: [],
			selectedShapeId: null,
		};
		mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedState));
		const state = storage.loadState();
		expect(state).toBeDefined();
		expect(state?.shapes).toEqual([]);
	});

	it("should clear state from localStorage", () => {
		storage.clearState();
		expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
	});

	it("should check if state exists", () => {
		mockLocalStorage.getItem.mockReturnValue(JSON.stringify({ shapes: [] }));
		const hasState = storage.hasSavedState();
		expect(hasState).toBe(true);
	});
});
