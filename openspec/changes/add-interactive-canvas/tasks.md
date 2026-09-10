## 1. Setup and Type Definitions

- [x] 1.1 Create types file for canvas shapes (Point, Rectangle interfaces with type discriminator) - layer: types
- [x] 1.2 Create types for canvas actions and state (CanvasState, CanvasAction, ActionTypes enum) - layer: types
- [x] 1.3 Create type guards for shape types - layer: types
- [x] 1.4 Create constants file (handle sizes, tolerances, colors, max history size) - layer: types

## 2. Canvas State Management

- [x] 2.1 Create canvas state interface with shapes array, selectedShapeId, history stack, redo stack - layer: frontend engine/facade
- [x] 2.2 Create canvas reducer with action handlers (CREATE_POINT, CREATE_RECTANGLE, SELECT, MOVE, RESIZE, DELETE, UNDO, REDO, RESET) - layer: frontend engine/facade
- [x] 2.3 Create CanvasContext with state and dispatch - layer: frontend engine/facade
- [x] 2.4 Create history management utilities (pushAction, undoAction, redoAction) - layer: frontend engine/facade
- [x] 2.5 Register CanvasContext provider in layout - layer: frontend engine/facade

## 3. Canvas Engine and Services

- [x] 3.1 Create CanvasEngine class with hit detection methods (hitTestPoint, hitTestRectangle, hitTestResizeHandle) - layer: frontend engine/facade, test: unit
- [x] 3.2 Create CanvasEngine method for square detection from rectangle - layer: frontend engine/facade, test: unit
- [x] 3.3 Create CanvasRenderer class with draw methods (drawPoint, drawRectangle, drawSelection, drawResizeHandles, drawLabels) - layer: frontend service, test: unit
- [x] 3.4 Create CanvasExporter service with exportToPNG, exportToJPG, exportToSVG methods - layer: frontend service, test: unit
- [x] 3.5 Create CanvasStorage service with saveState and loadState methods for localStorage - layer: frontend service, test: unit
- [x] 3.6 Register CanvasEngine, CanvasRenderer, CanvasExporter, CanvasStorage in DI container - layer: DI

## 4. Core Canvas Component

- [x] 4.1 Create Canvas component with ref to canvas element - layer: component
- [x] 4.2 Implement canvas rendering loop with requestAnimationFrame - layer: component, test: unit
- [x] 4.3 Implement mouse event handlers (onMouseDown, onMouseMove, onMouseUp, onMouseLeave) - layer: component, test: unit
- [x] 4.4 Implement keyboard event handler for Delete, Ctrl+Z, Ctrl+Y - layer: component, test: unit
- [x] 4.5 Implement interaction state machine (idle, creatingPoint, creatingRectangle, dragging, resizing) - layer: component, test: unit
- [x] 4.6 Connect Canvas component to CanvasContext - layer: component

## 5. Shape Creation

- [x] 5.1 Implement point creation on click in Canvas component - layer: component, test: integration
- [x] 5.2 Implement rectangle creation on click+drag in Canvas component - layer: component, test: integration
- [x] 5.3 Implement square creation on Shift+click+drag in Canvas component - layer: component, test: integration
- [x] 5.4 Implement dimension and area labels during creation - layer: component, test: integration
- [x] 5.5 Ensure point is not auto-selected after creation - layer: component, test: integration

## 6. Shape Selection and Manipulation

- [x] 6.1 Implement shape selection on click in Canvas component - layer: component, test: integration
- [x] 6.2 Implement deselect on empty canvas click - layer: component, test: integration
- [x] 6.3 Implement rectangle/square movement via drag in Canvas component - layer: component, test: integration
- [x] 6.4 Implement resize via corner handles in Canvas component - layer: component, test: integration
- [x] 6.5 Implement resize in all four directions - layer: component, test: integration
- [x] 6.6 Implement resize handles with priority hit detection - layer: component, test: integration
- [x] 6.7 Implement dimension and area labels during move/resize - layer: component, test: integration

## 7. Shape Deletion

- [x] 7.1 Implement delete with Delete key in Canvas component - layer: component, test: integration
- [x] 7.2 Implement delete with delete button in Controls component - layer: component, test: integration
- [x] 7.3 Implement delete button disable state when nothing selected - layer: component, test: integration

## 8. Undo/Redo Functionality

- [x] 8.1 Implement undo action in reducer - layer: frontend engine/facade, test: unit
- [x] 8.2 Implement redo action in reducer - layer: frontend engine/facade, test: unit
- [x] 8.3 Implement undo button in Controls component - layer: component, test: integration
- [x] 8.4 Implement redo button in Controls component - layer: component, test: integration
- [x] 8.5 Implement undo button disable state when history is empty - layer: component, test: integration
- [x] 8.6 Implement redo button disable state when redo stack is empty - layer: component, test: integration
- [x] 8.7 Implement Ctrl+Z keyboard shortcut for undo - layer: component, test: integration
- [x] 8.8 Implement Ctrl+Y keyboard shortcut for redo - layer: component, test: integration

## 9. Canvas Export

- [x] 9.1 Implement PNG export using canvas.toDataURL() - layer: frontend service, test: unit
- [x] 9.2 Implement JPG export using canvas.toDataURL() with JPEG quality - layer: frontend service, test: unit
- [x] 9.3 Implement SVG export with custom serialization - layer: frontend service, test: unit
- [x] 9.4 Implement export without selection details (hide handles, selection borders) - layer: frontend service, test: unit
- [x] 9.5 Implement export button with format selection in Controls component - layer: component, test: integration
- [x] 9.6 Implement filename generation with timestamp - layer: frontend service, test: unit
- [x] 9.7 Implement file download via Blob URL - layer: frontend service, test: unit

## 10. Canvas Persistence

- [x] 10.1 Implement auto-save to localStorage on state change in Canvas component - layer: component, test: integration
- [x] 10.2 Implement state loading from localStorage on component mount - layer: component, test: integration
- [x] 10.3 Implement debounce for localStorage writes - layer: component, test: unit
- [x] 10.4 Implement reset clearing localStorage - layer: component, test: integration

## 11. UI Controls

- [x] 11.1 Create Controls component with all buttons - layer: component
- [x] 11.2 Create UserGuide component with instructions - layer: component
- [x] 11.3 Create Statistics component with shape counts - layer: component
- [x] 11.4 Implement real-time statistics updates - layer: component, test: integration
- [x] 11.5 Implement square count based on geometry (width === height) - layer: component, test: unit
- [x] 11.6 Style controls with Tailwind CSS and DaisyUI - layer: component

## 12. Reset Functionality

- [x] 12.1 Implement reset action in reducer - layer: frontend engine/facade, test: unit
- [x] 12.2 Implement reset button in Controls component - layer: component, test: integration
- [x] 12.3 Implement reset as undoable action - layer: frontend engine/facade, test: unit

## 13. Page Integration

- [x] 13.1 Replace home page with CanvasPage component - layer: page
- [x] 13.2 Create CanvasPage layout with Canvas and Controls components - layer: page
- [x] 13.3 Ensure responsive layout for canvas and controls - layer: page, test: e2e

## 14. Testing

- [x] 14.1 Write unit tests for CanvasEngine - layer: test
- [x] 14.2 Write unit tests for debounce utility - layer: test
- [x] 14.3 Write unit tests for CanvasRenderer - layer: test
- [x] 14.3 Write unit tests for CanvasExporter - layer: test
- [x] 14.4 Write unit tests for CanvasStorage - layer: test
- [x] 14.5 Write unit tests for canvas reducer - layer: test
- [x] 14.6 Write integration tests for Canvas component - layer: test
- [x] 14.7 Write integration tests for Controls component - layer: test
- [x] 14.8 Write e2e tests for canvas page - layer: test

## 15. Code Quality

- [x] 15.1 Run Biome formatting and linting on all new files - layer: conventions
- [x] 15.2 Ensure all types are properly defined (no any) - layer: conventions
- [x] 15.3 Add JSDoc comments for all exported functions and classes - layer: conventions
- [x] 15.4 Verify 90%+ test coverage - layer: test
