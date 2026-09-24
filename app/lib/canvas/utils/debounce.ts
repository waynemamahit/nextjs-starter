/**
 * Debounce utility
 * Delays invoking a function until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked
 */

/**
 * Create a debounced function that delays invoking until after wait milliseconds
 * have elapsed since the last time it was invoked
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
	func: T,
	wait: number,
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	return (...args: Parameters<T>) => {
		if (timeoutId !== null) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => {
			func(...args);
		}, wait);
	};
}
