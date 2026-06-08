"use client";

import { useState } from "react";
import { Canvas, Controls, Statistics, UserGuide } from "./lib/canvas";

/**
 * Home page with interactive canvas
 * Main page that displays the canvas with controls, statistics, and user guide
 */
export default function HomePage() {
	const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(
		null,
	);

	return (
		<div className="min-h-screen bg-base-100 p-6">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold text-center mb-8 text-base-content">
					Interactive Canvas
				</h1>

				<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
					<div className="xl:col-span-2">
						<div className="card bg-base-100 border border-base-300 shadow-md">
							<div className="card-body p-4">
								<Canvas
									width={800}
									height={600}
									onCanvasMount={setCanvasElement}
								/>
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<Controls canvasElement={canvasElement} />
						<Statistics />
						<UserGuide />
					</div>
				</div>
			</div>
		</div>
	);
}
