import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { debounce } from "./debounce";

describe("debounce", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should call the function after the wait period", () => {
		const fn = vi.fn();
		const debouncedFn = debounce(fn, 100);

		debouncedFn();
		expect(fn).not.toHaveBeenCalled();

		vi.advanceTimersByTime(100);
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it("should not call the function immediately", () => {
		const fn = vi.fn();
		const debouncedFn = debounce(fn, 100);

		debouncedFn();
		expect(fn).not.toHaveBeenCalled();
	});

	it("should reset the timer on subsequent calls", () => {
		const fn = vi.fn();
		const debouncedFn = debounce(fn, 100);

		debouncedFn();
		vi.advanceTimersByTime(50);
		debouncedFn();
		vi.advanceTimersByTime(50);

		expect(fn).not.toHaveBeenCalled();

		vi.advanceTimersByTime(50);
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it("should pass arguments to the function", () => {
		const fn = vi.fn((a: number, b: string) => {
			return `a=${a}, b=${b}`;
		});
		const debouncedFn = debounce(fn, 100);

		debouncedFn(1, "test");
		vi.advanceTimersByTime(100);

		expect(fn).toHaveBeenCalledWith(1, "test");
	});

	it("should only call once for multiple rapid calls", () => {
		const fn = vi.fn();
		const debouncedFn = debounce(fn, 100);

		debouncedFn();
		debouncedFn();
		debouncedFn();
		debouncedFn();

		vi.advanceTimersByTime(100);
		expect(fn).toHaveBeenCalledTimes(1);
	});
});
