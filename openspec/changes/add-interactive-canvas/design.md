## Context

Current state: The application has a static home page with no interactive drawing capabilities. Users cannot create or manipulate shapes on the canvas. The requirement is to transform the home page into a fully interactive canvas with shape creation, manipulation, export, and persistence features.

Constraints from requirements:
- Points must render on top of rectangles/squares for visibility
- Z-index ordering by creation time
- Points should not auto-select after creation
- High contrast cursor visibility on canvas
- All UI controls (buttons, statistics, guide) must be outside the canvas
- Square count must auto-detect based on geometry, not creation method

## Goals / Non-Goals

**Goals:**
- Deliver a fully interactive canvas with point, rectangle, and square creation
- Implement complete shape manipulation (select, move, resize, delete)
- Provide undo/redo functionality with keyboard and button support
- Enable export to PNG, JPG, SVG formats
- Persist canvas state in localStorage for session recovery
- Display real-time statistics and user guidance

**Non-Goals:**
- Server-side storage or synchronization
- Multi-user collaboration
- Touch/mobile gesture support
- Custom styling for shapes (colors, strokes)
- Additional shape types beyond points and rectangles

## Decisions

### Canvas Implementation
**Decision**: Use HTML5 Canvas API with React ref management
**Rationale**: Native browser API provides best performance for rendering and event handling. No external dependencies required. React refs allow clean integration with component lifecycle.
**Alternatives considered**: Fabric.js (too heavy, 300KB+), Konva.js (good but adds dependency), SVG-based (less performant for many shapes)

### Shape Representation
**Decision**: Store shapes as normalized objects with type discriminator
```typescript
interface BaseShape {
  id: string;
  type: 'point' | 'rectangle';
  createdAt: number;
}
interface Point extends BaseShape {
  type: 'point';
  x: number;
  y: number;
}
interface Rectangle extends BaseShape {
  type: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
}
```
**Rationale**: Type-safe, extensible, easy to serialize for localStorage. Allows proper type guards for rendering and interaction logic.

### State Management
**Decision**: Use React context + useReducer for canvas state
**Rationale**: Centralized state management for the canvas with predictable updates via actions (CREATE_POINT, CREATE_RECT, SELECT, MOVE, RESIZE, DELETE, UNDO, REDO). No need for external state library given the scope.
**Alternatives considered**: Zustand (adds dependency), Redux (overkill for single-feature state)

### Undo/Redo Implementation
**Decision**: Maintain history stack with action objects
**Rationale**: Each action is recorded with inverse operation. Undo pops from history and applies inverse. Redo pushes back to history. Clean, predictable, and memory-efficient.

### Hit Detection
**Decision**: Bounding box check for rectangles, point-in-circle for points with tolerance
**Rationale**: Canvas uses coordinate system matching DOM. For rectangles: check if mouse position is within bounds. For points: check distance from center within click tolerance (8px). Resize handles use separate hit boxes on corners.

### Square Detection
**Decision**: Dynamic check based on width === height with tolerance
**Rationale**: Square count in statistics checks `Math.abs(width - height) < 2` to account for floating-point precision. This works regardless of creation method (shift-click or manual resize).

### Export Implementation
**Decision**: Use canvas.toDataURL() for PNG/JPG, custom SVG generation
**Rationale**: Native API provides PNG/JPG export. SVG requires custom serialization of shapes to SVG elements, then download via Blob URL.

### LocalStorage Strategy
**Decision**: Serialize entire canvas state (shapes + history) as JSON
**Rationale**: Single serialization point on state change. Debounce writes to prevent performance issues. Load on component mount.

### Architecture Layers
**Decision**: Frontend Engine/Facade for canvas business logic
- `CanvasEngine`: Manages shape creation, selection, manipulation
- `CanvasRenderer`: Handles all drawing operations
- `CanvasExporter`: Service for export functionality
- `CanvasStorage`: Service for localStorage persistence
**Rationale**: Separation of concerns. Engine contains business logic, Renderer handles canvas API, Services handle external concerns (export, storage).

## Risks / Trade-offs

[Risk] Canvas performance with many shapes (100+) → Mitigation: Implement render optimization (only redraw affected areas when possible, use requestAnimationFrame)

[Risk] localStorage size limits (5MB) → Mitigation: Warn user when approaching limit, provide reset option

[Risk] Undo history memory growth → Mitigation: Cap history stack size (default 100 actions)

[Risk] Event handling conflicts on canvas → Mitigation: Single event handler with state machine for interaction modes (idle, creating, dragging, resizing)

[Risk] Resize handle hit detection on small shapes → Mitigation: Minimum handle size (10px), priority hit detection (handles before shapes)

[Risk] z-index rendering order → Mitigation: Always render points first, then rectangles/squares in creation order

## Migration Plan

1. Create new canvas page component at `/app/page.tsx` (replacing existing home page)
2. Implement CanvasEngine, CanvasRenderer, CanvasExporter, CanvasStorage services
3. Create UI controls component with buttons, statistics, guide
4. Add canvas component with all interaction handlers
5. Implement localStorage integration
6. Test all features and edge cases
7. Update layout to accommodate canvas and controls

**Rollback Strategy**: Git revert to previous home page state. No database changes required.

## Open Questions

- What should be the default canvas size? (Proposed: 800x600px, responsive)
- Should we support pan/zoom functionality? (Deferred: Not in current requirements)
- What keyboard shortcuts for undo/redo? (Proposed: Ctrl+Z / Ctrl+Y)
- Should reset canvas clear undo history? (Proposed: Yes, as a single action that can be undone)
