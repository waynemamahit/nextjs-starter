## ADDED Requirements

### Requirement: User guide is displayed outside the canvas
The system SHALL display a user guide explaining how to use the interactive canvas. The guide SHALL be positioned outside the canvas area.

#### Scenario: User guide visible on page load
- **WHEN** user navigates to canvas page
- **THEN** system displays user guide outside the canvas

#### Scenario: User guide contains instructions
- **WHEN** user views the guide
- **THEN** system shows instructions for creating points, rectangles, squares, and manipulating shapes

### Requirement: Shape count statistics are displayed outside the canvas
The system SHALL display real-time statistics showing the count of created points, rectangles, and squares outside the canvas area.

#### Scenario: Statistics display point count
- **WHEN** user creates 3 points
- **THEN** system displays "Points: 3" in the statistics

#### Scenario: Statistics display rectangle count
- **WHEN** user creates 2 rectangles
- **THEN** system displays "Rectangles: 2" in the statistics

#### Scenario: Statistics display square count
- **WHEN** user creates 1 square via Shift+drag
- **THEN** system displays "Squares: 1" in the statistics

#### Scenario: Statistics display rectangle resized to square
- **WHEN** user creates a rectangle and resizes it to a square
- **THEN** system updates statistics to count it as a square

#### Scenario: Statistics update on shape deletion
- **WHEN** user deletes a shape
- **THEN** system decrements the appropriate count in statistics

### Requirement: Delete button is available outside the canvas
The system SHALL provide a delete button located outside the canvas area for deleting the currently selected shape.

#### Scenario: Delete button visible
- **WHEN** user views the canvas page
- **THEN** system displays a delete button outside the canvas

#### Scenario: Delete button deletes selected shape
- **WHEN** user selects a shape and clicks delete button
- **THEN** system removes the selected shape from the canvas

### Requirement: Undo button is available outside the canvas
The system SHALL provide an undo button located outside the canvas area.

#### Scenario: Undo button visible
- **WHEN** user views the canvas page
- **THEN** system displays an undo button outside the canvas

#### Scenario: Undo button undoes last action
- **WHEN** user performs an action and clicks undo button
- **THEN** system reverses the last action

#### Scenario: Undo button disabled when nothing to undo
- **WHEN** no actions can be undone
- **THEN** system disables the undo button

### Requirement: Redo button is available outside the canvas
The system SHALL provide a redo button located outside the canvas area.

#### Scenario: Redo button visible
- **WHEN** user views the canvas page
- **THEN** system displays a redo button outside the canvas

#### Scenario: Redo button redoes last undone action
- **WHEN** user undoes an action and clicks redo button
- **THEN** system reapplies the undone action

#### Scenario: Redo button disabled when nothing to redo
- **WHEN** no actions can be redone
- **THEN** system disables the redo button

### Requirement: Export button is available outside the canvas
The system SHALL provide an export button located outside the canvas area.

#### Scenario: Export button visible
- **WHEN** user views the canvas page
- **THEN** system displays an export button outside the canvas

### Requirement: Reset button is available outside the canvas
The system SHALL provide a reset button located outside the canvas area for clearing the entire canvas.

#### Scenario: Reset button visible
- **WHEN** user views the canvas page
- **THEN** system displays a reset button outside the canvas

#### Scenario: Reset button clears canvas
- **WHEN** user clicks reset button
- **THEN** system removes all shapes from the canvas

### Requirement: Keyboard shortcuts for undo and redo
The system SHALL support keyboard shortcuts for undo and redo operations.

#### Scenario: Ctrl+Z undoes last action
- **WHEN** user presses Ctrl+Z (Cmd+Z on Mac)
- **THEN** system undoes the last action

#### Scenario: Ctrl+Y redoes last undone action
- **WHEN** user presses Ctrl+Y (Cmd+Y on Mac)
- **THEN** system redoes the last undone action

### Requirement: UI controls are responsive
The system SHALL ensure all UI controls (buttons, statistics, guide) are properly laid out and accessible on different screen sizes.

#### Scenario: Controls visible on desktop
- **WHEN** user views canvas on desktop (1024px+ width)
- **THEN** system displays all controls in a readable layout

#### Scenario: Controls visible on mobile
- **WHEN** user views canvas on mobile (< 768px width)
- **THEN** system displays all controls in a compact, usable layout
