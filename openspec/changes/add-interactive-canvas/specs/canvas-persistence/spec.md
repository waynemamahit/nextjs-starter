## ADDED Requirements

### Requirement: Canvas state persists across page reloads
The system SHALL save the canvas state to the browser's localStorage and automatically restore it when the user reopens the page.

#### Scenario: Shapes persist after page reload
- **WHEN** user creates shapes and reloads the page
- **THEN** system restores all created shapes

#### Scenario: Shape properties persist
- **WHEN** user creates and moves shapes, then reloads the page
- **THEN** system restores shapes with their positions, dimensions, and types

#### Scenario: Empty canvas persists
- **WHEN** user has an empty canvas and reloads the page
- **THEN** system displays an empty canvas

### Requirement: Canvas state includes all shapes
The system SHALL persist all points, rectangles, and squares in the localStorage.

#### Scenario: Points are restored
- **WHEN** user creates points and reloads the page
- **THEN** system restores all points with their coordinates

#### Scenario: Rectangles are restored
- **WHEN** user creates rectangles and reloads the page
- **THEN** system restores all rectangles with their positions and dimensions

#### Scenario: Squares are restored as rectangles
- **WHEN** user creates squares and reloads the page
- **THEN** system restores squares as rectangles with equal width and height

### Requirement: Canvas state includes shape order
The system SHALL preserve the creation order of shapes in the persisted state.

#### Scenario: Shape order preserved
- **WHEN** user creates rectangle A, point B, rectangle C and reloads the page
- **THEN** system renders shapes in order: rectangle A, rectangle C, with point B on top

### Requirement: Canvas state is saved automatically
The system SHALL automatically save the canvas state to localStorage whenever it changes.

#### Scenario: Auto-save on shape creation
- **WHEN** user creates a shape
- **THEN** system saves the updated state to localStorage

#### Scenario: Auto-save on shape movement
- **WHEN** user moves a shape
- **THEN** system saves the updated state to localStorage

#### Scenario: Auto-save on shape resize
- **WHEN** user resizes a shape
- **THEN** system saves the updated state to localStorage

#### Scenario: Auto-save on shape deletion
- **WHEN** user deletes a shape
- **THEN** system saves the updated state to localStorage

### Requirement: Canvas state is loaded on page mount
The system SHALL load the saved canvas state from localStorage when the canvas component mounts.

#### Scenario: State loaded before rendering
- **WHEN** canvas component mounts
- **THEN** system loads state from localStorage before first render

#### Scenario: No flicker on load
- **WHEN** canvas component mounts with saved state
- **THEN** system renders the restored shapes immediately without visible flicker

### Requirement: Reset canvas clears localStorage
The system SHALL clear the saved canvas state from localStorage when the user resets the canvas.

#### Scenario: Reset clears saved state
- **WHEN** user clicks reset button
- **THEN** system clears canvas state from localStorage

#### Scenario: Empty canvas after reset persists
- **WHEN** user resets canvas and reloads the page
- **THEN** system displays an empty canvas

### Requirement: Cleared canvas can be undone
The system SHALL treat reset as an action that can be undone, restoring the previous state.

#### Scenario: Undo reset restores previous state
- **WHEN** user resets canvas then clicks undo
- **THEN** system restores all shapes that existed before reset

#### Scenario: Undo reset restores from localStorage
- **WHEN** user resets canvas, reloads page, then clicks undo
- **THEN** system restores the empty state (since reset was the last action before reload)
