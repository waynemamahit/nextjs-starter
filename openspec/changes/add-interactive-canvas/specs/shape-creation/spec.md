## ADDED Requirements

### Requirement: Click on canvas creates a point
The system SHALL create a new point shape at the clicked position when the user clicks anywhere on the canvas without dragging.

#### Scenario: Create point with left click
- **WHEN** user left-clicks on empty canvas area
- **THEN** system creates a point at the click coordinates

#### Scenario: Point created at exact position
- **WHEN** user clicks at position (x: 100, y: 200)
- **THEN** system creates a point with coordinates (100, 200)

#### Scenario: Point not auto-selected after creation
- **WHEN** user creates a point by clicking
- **THEN** system does NOT automatically select the created point

### Requirement: Click and drag creates a rectangle
The system SHALL create a new rectangle shape when the user clicks and drags on the canvas. The rectangle SHALL be defined by the starting click position and the current mouse position during drag.

#### Scenario: Create rectangle with drag
- **WHEN** user clicks at (50, 50) and drags to (150, 100)
- **THEN** system creates a rectangle with position (50, 50), width 100, height 50

#### Scenario: Rectangle creation shows dimensions
- **WHEN** user is dragging to create a rectangle
- **THEN** system displays the current width and height as a label during creation

#### Scenario: Rectangle creation shows area
- **WHEN** user is dragging to create a rectangle
- **THEN** system displays the current area as a label during creation

### Requirement: Click and drag with Shift creates a square
The system SHALL create a square (rectangle with equal width and height) when the user holds the Shift key while clicking and dragging on the canvas.

#### Scenario: Create square with Shift + drag
- **WHEN** user holds Shift and drags from (50, 50) to (150, 150)
- **THEN** system creates a square with position (50, 50), width 100, height 100

#### Scenario: Square creation maintains aspect ratio
- **WHEN** user holds Shift and drags horizontally from (50, 50) to (200, 100)
- **THEN** system creates a square with width and height both equal to 100

#### Scenario: Square creation shows dimensions and area
- **WHEN** user holds Shift and drags to create a square
- **THEN** system displays the current side length and area as labels during creation

### Requirement: Created shapes are displayed on hover
The system SHALL display a label showing the shape's coordinates or dimensions when the user hovers over a created shape.

#### Scenario: Point shows coordinates on hover
- **WHEN** user hovers over a created point
- **THEN** system displays a label with the point's x and y coordinates

#### Scenario: Rectangle shows dimensions and area on hover
- **WHEN** user hovers over a created rectangle
- **THEN** system displays a label with the rectangle's width, height, and area

### Requirement: Shape creation completes on mouse release
The system SHALL finalize the shape creation when the user releases the mouse button.

#### Scenario: Rectangle finalized on release
- **WHEN** user releases mouse button after dragging
- **THEN** system finalizes the rectangle creation and adds it to the canvas

#### Scenario: Point created immediately on click
- **WHEN** user clicks without dragging
- **THEN** system immediately creates and finalizes the point

### Requirement: Multiple shapes can be created
The system SHALL allow users to create multiple points, rectangles, and squares on the same canvas without limit.

#### Scenario: Create multiple points
- **WHEN** user clicks at multiple positions on canvas
- **THEN** system creates a point at each click position

#### Scenario: Create multiple rectangles
- **WHEN** user performs multiple click+drag operations
- **THEN** system creates a rectangle for each operation

#### Scenario: Create mixed shapes
- **WHEN** user creates points, rectangles, and squares in any order
- **THEN** system maintains all created shapes on the canvas
