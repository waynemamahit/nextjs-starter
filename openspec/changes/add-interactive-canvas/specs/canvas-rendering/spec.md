## ADDED Requirements

### Requirement: Canvas displays interactive drawing area
The system SHALL render a canvas element as the main interactive area on the home page. The canvas SHALL have a visible border and background color that provides high contrast with the cursor.

#### Scenario: Canvas renders on page load
- **WHEN** user navigates to the home page
- **THEN** system displays a canvas element centered on the page

#### Scenario: Canvas has high contrast with cursor
- **WHEN** user hovers mouse over canvas
- **THEN** cursor is clearly visible against canvas background

### Requirement: Points render on top of rectangles and squares
The system SHALL render all point shapes on top of all rectangle and square shapes to ensure points remain visible and selectable.

#### Scenario: Points visible over rectangles
- **WHEN** canvas contains both points and rectangles
- **THEN** all points are rendered above all rectangles

#### Scenario: Points visible over squares
- **WHEN** canvas contains both points and squares
- **THEN** all points are rendered above all squares

### Requirement: Rectangles and squares render in creation order
The system SHALL render rectangles and squares in the order they were created, with earlier shapes appearing below later shapes (stacking order).

#### Scenario: Multiple rectangles maintain z-order
- **WHEN** user creates rectangle A then rectangle B
- **THEN** rectangle A renders below rectangle B

#### Scenario: Mixed shapes maintain creation order
- **WHEN** user creates rectangle A, square B, rectangle C
- **THEN** shapes render in order: rectangle A (bottom), square B (middle), rectangle C (top), with all points on top

### Requirement: Selected shapes are visually highlighted
The system SHALL visually indicate which shape is currently selected with a highlight border or fill.

#### Scenario: Rectangle selection visible
- **WHEN** user selects a rectangle
- **THEN** system displays a selection indicator around the rectangle

#### Scenario: Point selection visible
- **WHEN** user selects a point
- **THEN** system displays a selection indicator at the point location

### Requirement: Resize handles appear on selected rectangles and squares
The system SHALL display resize handles on all four corners of a selected rectangle or square.

#### Scenario: Resize handles visible on selection
- **WHEN** user selects a rectangle
- **THEN** system displays a resize handle on each corner of the rectangle

#### Scenario: Resize handles hidden when not selected
- **WHEN** no shape is selected
- **THEN** system does not display any resize handles

### Requirement: Canvas redraws on state changes
The system SHALL automatically redraw the entire canvas whenever the canvas state changes (shapes added, removed, moved, or resized).

#### Scenario: Canvas updates after adding shape
- **WHEN** user creates a new shape
- **THEN** system redraws canvas to include the new shape

#### Scenario: Canvas updates after moving shape
- **WHEN** user moves a shape
- **THEN** system redraws canvas with shape at new position

#### Scenario: Canvas updates after deleting shape
- **WHEN** user deletes a shape
- **THEN** system redraws canvas without the deleted shape
