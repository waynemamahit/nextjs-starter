/**
 * Canvas Exporter
 * Handles export functionality for canvas (PNG, JPG, SVG)
 */

import type { Shape } from "../types";
import { isPoint, isRectangle, isSquare, SQUARE_TOLERANCE } from "../types";

/** Export format */
export type ExportFormat = "png" | "jpg" | "svg";

/** Canvas Exporter class */
export class CanvasExporter {
	private canvas: HTMLCanvasElement;

	/**
	 * Create a new CanvasExporter
	 * @param canvas - The canvas element to export
	 */
	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
	}

	/**
	 * Export canvas to PNG
	 */
	exportToPNG(): void {
		this.downloadImage("png", "image/png");
	}

	/**
	 * Export canvas to JPG
	 */
	exportToJPG(quality: number = 0.92): void {
		this.downloadImage("jpg", "image/jpeg", quality);
	}

	/**
	 * Export canvas to SVG
	 */
	exportToSVG(shapes: Shape[]): void {
		const svgContent = this.generateSVG(shapes);
		this.downloadFile(svgContent, "svg", "image/svg+xml");
	}

	/**
	 * Generate SVG content from shapes
	 */
	private generateSVG(shapes: Shape[]): string {
		const points = shapes.filter(isPoint);
		const rectangles = shapes.filter(isRectangle);

		const pointElements = points
			.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#ff0000" />`)
			.join("\n");

		const rectElements = rectangles
			.map((r) => {
				const isSq = isSquare(r, SQUARE_TOLERANCE);
				const strokeColor = isSq ? "#00aa00" : "#0000ff";
				const fillColor = isSq
					? "rgba(0, 170, 0, 0.1)"
					: "rgba(0, 0, 255, 0.1)";
				return `<rect x="${r.x}" y="${r.y}" width="${r.width}" height="${r.height}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2" />`;
			})
			.join("\n");

		const width = this.canvas.offsetWidth;
		const height = this.canvas.offsetHeight;

		return `<?xml version="1.0" standalone="no"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f5f5f5" />
  ${rectElements}
  ${pointElements}
</svg>`;
	}

	/**
	 * Download canvas as image (PNG or JPG)
	 */
	private downloadImage(
		format: ExportFormat,
		mimeType: string,
		quality?: number,
	): void {
		const dataUrl = quality
			? this.canvas.toDataURL(mimeType, quality)
			: this.canvas.toDataURL(mimeType);

		const timestamp = this.getTimestamp();
		const filename = `canvas-drawing-${timestamp}.${format}`;

		this.downloadDataUrl(dataUrl, filename);
	}

	/**
	 * Download SVG content
	 */
	private downloadFile(
		content: string,
		format: ExportFormat,
		mimeType: string,
	): void {
		const timestamp = this.getTimestamp();
		const filename = `canvas-drawing-${timestamp}.${format}`;

		const blob = new Blob([content], { type: mimeType });
		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	/**
	 * Download from data URL
	 */
	private downloadDataUrl(dataUrl: string, filename: string): void {
		const link = document.createElement("a");
		link.href = dataUrl;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	/**
	 * Get formatted timestamp for filename
	 */
	private getTimestamp(): string {
		const now = new Date();
		return now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
	}

	/**
	 * Set the canvas to export
	 * @param canvas - The canvas element to use for exports
	 */
	setCanvas(canvas: HTMLCanvasElement): void {
		this.canvas = canvas;
	}
}
