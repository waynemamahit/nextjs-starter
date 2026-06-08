## ADDED Requirements

### Requirement: Canvas can be exported as PNG
The system SHALL provide a way to export the canvas as a PNG image file.

#### Scenario: Export canvas as PNG
- **WHEN** user clicks export button and selects PNG format
- **THEN** system downloads a PNG file containing the canvas drawing

#### Scenario: PNG export includes all shapes
- **WHEN** user exports canvas with points, rectangles, and squares
- **THEN** downloaded PNG includes all shapes as rendered on canvas

### Requirement: Canvas can be exported as JPG
The system SHALL provide a way to export the canvas as a JPG image file.

#### Scenario: Export canvas as JPG
- **WHEN** user clicks export button and selects JPG format
- **THEN** system downloads a JPG file containing the canvas drawing

#### Scenario: JPG export includes all shapes
- **WHEN** user exports canvas with points, rectangles, and squares
- **THEN** downloaded JPG includes all shapes as rendered on canvas

### Requirement: Canvas can be exported as SVG
The system SHALL provide a way to export the canvas as an SVG vector file.

#### Scenario: Export canvas as SVG
- **WHEN** user clicks export button and selects SVG format
- **THEN** system downloads an SVG file containing the canvas drawing

#### Scenario: SVG export is vector-based
- **WHEN** user exports canvas as SVG
- **THEN** downloaded file is a vector graphic that scales without quality loss

### Requirement: Export does not show selection details
The system SHALL export the canvas without any visual indicators of selected shapes, resize handles, or selection highlights.

#### Scenario: Export hides selection indicators
- **WHEN** user exports canvas while a shape is selected
- **THEN** exported image does not show selection border or resize handles

#### Scenario: Export shows clean canvas
- **WHEN** user exports canvas
- **THEN** exported image shows only the shapes without any UI overlays

### Requirement: Export button is available outside canvas
The system SHALL provide an export button located outside the canvas area.

#### Scenario: Export button visible
- **WHEN** user views the canvas page
- **THEN** system displays an export button outside the canvas

#### Scenario: Export button accessible
- **WHEN** user clicks the export button
- **THEN** system presents export format options (PNG, JPG, SVG)

### Requirement: Export format selection
The system SHALL allow users to choose between PNG, JPG, and SVG formats for export.

#### Scenario: Select PNG format
- **WHEN** user selects PNG format and confirms export
- **THEN** system exports as PNG

#### Scenario: Select JPG format
- **WHEN** user selects JPG format and confirms export
- **THEN** system exports as JPG

#### Scenario: Select SVG format
- **WHEN** user selects SVG format and confirms export
- **THEN** system exports as SVG

### Requirement: Exported filename reflects content
The system SHALL generate a meaningful filename for exported files.

#### Scenario: Filename includes timestamp
- **WHEN** user exports canvas
- **THEN** system generates a filename like "canvas-drawing-YYYYMMDD-HHMMSS.png"

#### Scenario: Filename includes format extension
- **WHEN** user exports as PNG
- **THEN** system generates a filename with .png extension

#### Scenario: Filename for JPG export
- **WHEN** user exports as JPG
- **THEN** system generates a filename with .jpg extension

#### Scenario: Filename for SVG export
- **WHEN** user exports as SVG
- **THEN** system generates a filename with .svg extension
