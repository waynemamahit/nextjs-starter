## Why

Users need an interactive drawing canvas to create, manipulate, and visualize geometric shapes (points, rectangles, squares) with full editing capabilities. This enables creative drawing, technical diagram creation, and educational use cases. The current home page lacks any interactive drawing functionality, limiting user engagement and practical use cases.

## What Changes

- Replace the current home page with an interactive canvas page
- Add new canvas component with shape rendering and interaction
- Add point creation via click
- Add rectangle/square creation via click+drag (shift for square)
- Add shape selection, movement, and resizing capabilities
- Add delete functionality (button and delete key)
- Add undo/redo functionality (buttons and shortcut keys)
- Add export functionality for canvas (PNG, JPG, SVG)
- Add user guide and statistics display
- Add reset/clean functionality
- Add local storage persistence for canvas state

## Capabilities

### New Capabilities
- `canvas-rendering`: Render interactive canvas with proper cursor visibility and z-index management
- `shape-creation`: Create points, rectangles, and squares via mouse interactions
- `shape-manipulation`: Select, move, resize, and delete shapes with proper hit detection
- `canvas-export`: Export canvas to image formats (PNG, JPG, SVG) without selection details
- `canvas-persistence`: Save canvas state to localStorage and restore on page reload
- `canvas-ui`: Display user guide, statistics, and control buttons outside the canvas

### Modified Capabilities

## Impact

- **Frontend**: New canvas page component replacing home page
- **UI Components**: New canvas component, control toolbar, statistics panel, user guide
- **State Management**: Local state for canvas operations, localStorage for persistence
- **Architecture Layers**: Frontend Engine/Facade layer for canvas business logic, Frontend Service layer for export functionality
- **Dependencies**: No new external dependencies required (uses HTML5 Canvas API)

## Non-goals

- Server-side storage of canvas drawings
- Multi-user collaboration on canvas
- Shape customization (colors, stroke styles)
- Touch/gesture support for mobile devices
- Advanced shape types (circles, polygons, etc.)
