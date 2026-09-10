/**
 * Vitest setup file
 * Mocks browser APIs that are not available in jsdom
 */

import { beforeEach, vi } from "vitest";

// Mock localStorage since jsdom doesn't implement it properly
const localStorageMock: Storage = {
	length: 0,
	clear: vi.fn(),
	getItem: vi.fn((_key: string) => null),
	key: vi.fn(() => null),
	removeItem: vi.fn(),
	setItem: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
	value: localStorageMock,
});

// Mock window.URL for Blob operations
if (typeof window.URL === "undefined" || !window.URL.createObjectURL) {
	window.URL = {
		createObjectURL: vi.fn(() => "blob:mock-url"),
		revokeObjectURL: vi.fn(),
	} as unknown as typeof URL;
}

// Mock HTMLCanvasElement.getContext to return a mock 2D context
const mockCanvasContext = {
	canvas: null as unknown as HTMLCanvasElement,
	clearRect: vi.fn(),
	fillRect: vi.fn(),
	strokeRect: vi.fn(),
	beginPath: vi.fn(),
	arc: vi.fn(),
	fill: vi.fn(),
	stroke: vi.fn(),
	moveTo: vi.fn(),
	lineTo: vi.fn(),
	fillText: vi.fn(),
	save: vi.fn(),
	restore: vi.fn(),
	setTransform: vi.fn(),
	scale: vi.fn(),
	measureText: vi.fn(() => ({ width: 0 }) as TextMetrics),
	getLineDash: vi.fn(() => [] as number[]),
	setLineDash: vi.fn(),
	font: "",
	textAlign: "start" as CanvasTextAlign,
	textBaseline: "alphabetic" as CanvasTextBaseline,
	globalAlpha: 1,
	fillStyle: "",
	strokeStyle: "",
	lineWidth: 1,
	lineDashOffset: 0,
};

// Extend HTMLCanvasElement prototype
HTMLCanvasElement.prototype.getContext = vi.fn(function (
	this: HTMLCanvasElement,
	type: string,
) {
	if (type === "2d") {
		return mockCanvasContext as unknown as CanvasRenderingContext2D;
	}
	return null;
}) as unknown as typeof HTMLCanvasElement.prototype.getContext;

HTMLCanvasElement.prototype.toDataURL = vi.fn(function (
	this: HTMLCanvasElement,
	type?: string,
	_quality?: number,
) {
	return `data:${type || "image/png"};base64,mock-data`;
});

// Clean up after each test
beforeEach(() => {
	vi.clearAllMocks();
});
