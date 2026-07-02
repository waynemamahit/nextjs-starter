"use client";

/**
 * Canvas Context
 * Provides React context for canvas state management
 */

import {
	createContext,
	type Dispatch,
	type ReactNode,
	useContext,
	useReducer,
} from "react";
import {
	type CanvasActionUnion,
	type CanvasState,
	initialCanvasState,
} from "../types";
import { canvasReducer } from "./reducer";

/** Canvas context value type */
export interface CanvasContextType {
	/** Current canvas state */
	state: CanvasState;
	/** Dispatch function for canvas actions */
	dispatch: Dispatch<CanvasActionUnion>;
}

/** Create canvas context */
export const CanvasContext = createContext<CanvasContextType | undefined>(
	undefined,
);

/**
 * Canvas provider component
 * Wraps the application with canvas state management
 * @param children - Child components to render
 */
export function CanvasProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(canvasReducer, initialCanvasState);

	return (
		<CanvasContext.Provider value={{ state, dispatch }}>
			{children}
		</CanvasContext.Provider>
	);
}

/**
 * Hook to access canvas state and dispatch
 * @returns Canvas context with state and dispatch
 * @throws Error if used outside CanvasProvider
 */
export function useCanvas() {
	const context = useContext(CanvasContext);
	if (!context) {
		throw new Error("useCanvas must be used within a CanvasProvider");
	}
	return context;
}
