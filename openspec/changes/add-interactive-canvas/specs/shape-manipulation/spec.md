## ADDED Requirements

### Requirement: Shapes can be selected by clicking
The system SHALL select a shape when the user clicks on it. Clicking on empty canvas area SHALL deselect any currently selected shape.

#### Scenario: Select rectangle by clicking
- **WHEN** user clicks on a rectangle
- **THEN** system selects that rectangle

#### Scenario: Select point by clicking
- **WHEN** user clicks on a point
- **THEN** system selects that point

#### Scenario: Deselect by clicking empty area
- **WHEN** user clicks on empty canvas area
- **THEN** system deselects any currently selected shape

#### Scenario: Select different shape
- **WHEN** user clicks on shape B while shape A is selected
- **THEN** system deselects shape A and selects shape B

### Requirement: Selected rectangles and squares can be moved via drag and drop
The system SHALL allow users to move a selected rectangle or square by clicking and dragging it to a new position.

#### Scenario: Move rectangle via drag
- **WHEN** user selects a rectangle and drags it from (50, 50) to (100, 100)
- **THEN** system moves the rectangle to position (100, 100) maintaining its dimensions

#### Scenario: Move square via drag
- **WHEN** user selects a square and drags it from (50, 50) to (200, 150)
- **THEN** system moves the square to position (200, 150) maintaining its dimensions

#### Scenario: Move shows dimensions during drag
- **WHEN** user drags a rectangle to move it
- **THEN** system displays the rectangle's current dimensions as a label during movement

### Requirement: Selected rectangles and squares can be resized via corner handles
The system SHALL allow users to resize a selected rectangle or square by dragging any of its four corner resize handles.

#### Scenario: Resize rectangle from bottom-right corner
- **WHEN** user drags the bottom-right corner handle of a rectangle from (50, 50) with width 100 and height 50 to (200, 200)
- **THEN** system resizes the rectangle to width 150 and height 150

#### Scenario: Resize rectangle from top-left corner
- **WHEN** user drags the top-left corner handle of a rectangle from (100, 100) with width 100 and height 100 to (50, 50)
- **THEN** system resizes the rectangle to width 150, height 150, and position (50, 50)

#### Scenario: Resize shows dimensions and area during resize
- **WHEN** user drags a corner handle to resize a rectangle
- **THEN** system displays the current width, height, and area as labels during resizing

#### Scenario: Resize in all directions
- **WHEN** user drags any of the four corner handles
- **THEN** system resizes the rectangle proportionally in the dragged direction

### Requirement: Rectangles can be resized into squares and vice versa
The system SHALL allow rectangles to be resized into squares and squares to be resized into rectangles through the resize handles.

#### Scenario: Resize rectangle to square
- **WHEN** user resizes a rectangle with width 100 and height 50 to have width 100 and height 100
- **THEN** system updates the shape and statistics count it as a square

#### Scenario: Resize square to rectangle
- **WHEN** user resizes a square with width 100 and height 100 to have width 150 and height 100
- **THEN** system updates the shape and statistics count it as a rectangle

### Requirement: Selected shapes can be deleted with Delete key
The system SHALL delete the currently selected shape when the user presses the Delete key.

#### Scenario: Delete selected rectangle with Delete key
- **WHEN** user selects a rectangle and presses Delete key
- **THEN** system removes the rectangle from the canvas

#### Scenario: Delete selected point with Delete key
- **WHEN** user selects a point and presses Delete key
- **THEN** system removes the point from the canvas

#### Scenario: Delete key does nothing when nothing selected
- **WHEN** user presses Delete key with no shape selected
- **THEN** system does nothing

### Requirement: Multiple shapes can be deleted with delete button
The system SHALL have a delete button that deletes the currently selected shape.

#### Scenario: Delete selected shape with button
- **WHEN** user selects a shape and clicks the delete button
- **THEN** system removes the selected shape from the canvas

#### Scenario: Delete button disabled when nothing selected
- **WHEN** no shape is selected
- **THEN** system disables the delete button

### Requirement: Resize handles have priority in hit detection
The system SHALL prioritize resize handle hit detection over shape hit detection when both are under the cursor.

#### Scenario: Resize handle hit before shape
- **WHEN** user hovers over a corner of a selected rectangle where both the handle and shape are present
- **THEN** system shows resize cursor (not selection cursor)

#### Scenario: Resize handle click starts resize operation
- **WHEN** user clicks on a resize handle
- **THEN** system enters resize mode (not selection mode)
