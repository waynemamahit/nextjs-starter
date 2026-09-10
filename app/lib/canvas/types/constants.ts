/**
 * Canvas Constants
 * Configuration values for canvas rendering and interaction
 */

/** Default canvas dimensions */
export const CANVAS_HEIGHT = 600;

/** Canvas background color (light gray) - provides high contrast with cursor */
export const CANVAS_BACKGROUND = "#f5f5f5";

/** Canvas border styling */
export const CANVAS_BORDER = "2px solid #333";

/** Point styling */
export const POINT_RADIUS = 4;
export const POINT_COLOR = "#ff0000";
export const POINT_HOVER_RADIUS = 6;

/** Rectangle styling */
export const RECTANGLE_STROKE_COLOR = "#0000ff";
export const RECTANGLE_STROKE_WIDTH = 2;
export const RECTANGLE_FILL_COLOR = "rgba(0, 0, 255, 0.1)";

/** Square styling (different color for visual distinction) */
export const SQUARE_STROKE_COLOR = "#00aa00";
export const SQUARE_FILL_COLOR = "rgba(0, 170, 0, 0.1)";

/** Selection styling */
export const SELECTION_COLOR = "#ff00ff";
export const SELECTION_STROKE_WIDTH = 3;
export const SELECTION_DASH = [5, 5];

/** Resize handle styling */
export const RESIZE_HANDLE_SIZE = 10;
export const RESIZE_HANDLE_COLOR = "#ff0000";
export const RESIZE_HANDLE_FILL_COLOR = "rgba(255, 0, 0, 0.5)";

/** Hit detection tolerances */
export const HIT_TOLERANCE = 8; // pixels

export const RESIZE_HANDLE_HIT_TOLERANCE = 12; // pixels (slightly larger for handles)

/** Label styling */
export const LABEL_FONT = "12px sans-serif";
export const LABEL_COLOR = "#000000";
export const LABEL_BACKGROUND = "rgba(255, 255, 255, 0.8)";
export const LABEL_PADDING = 4;

/** Cursor types */
export const CURSOR_DEFAULT = "default";
export const CURSOR_CROSSHAIR = "crosshair";
export const CURSOR_MOVE = "move";
export const CURSOR_RESIZE_NWSE = "nwse-resize";
export const CURSOR_RESIZE_NESW = "nesw-resize";

/** Debounce delay for localStorage saves (milliseconds) */
export const SAVE_DEBOUNCE_MS = 300;

/** Square detection tolerance */
export const SQUARE_TOLERANCE = 2;
