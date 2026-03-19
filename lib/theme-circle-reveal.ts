const REVEAL_MARK = "data-docs-theme-reveal";

export interface RunThemeCircleRevealOptions {
	originX: number;
	originY: number;
	/** Previous theme surface; covers the viewport until the mask hole grows. */
	previousSurfaceColor: string;
	/** Run after the overlay is mounted (same tick) so the new theme is never painted without the veil. */
	applyNewTheme: () => void;
	durationMs?: number;
	onComplete?: () => void;
}

function easeOutCubic(t: number): number {
	return 1 - (1 - t) ** 3;
}

function setRevealMask(
	el: HTMLDivElement,
	cx: number,
	cy: number,
	radiusPx: number,
): void {
	// Transparent inside the disk = overlay hidden there = new themed page shows through.
	// Opaque white outside = overlay (old surface) visible.
	if (radiusPx <= 0.5) {
		el.style.maskImage = "linear-gradient(#fff, #fff)";
		el.style.setProperty("-webkit-mask-image", "linear-gradient(#fff, #fff)");
		return;
	}
	const inner = Math.max(0, radiusPx - 0.75);
	const mask = `radial-gradient(circle at ${cx}px ${cy}px, transparent ${inner}px, #fff ${radiusPx}px)`;
	el.style.maskImage = mask;
	el.style.setProperty("-webkit-mask-image", mask);
}

/**
 * Mounts a full-screen veil of the **previous** surface, applies the **new** theme underneath,
 * then grows a circular hole in the mask so real new-themed UI shows inside the disk while the
 * rest still reads as the old surface color.
 */
export function runThemeCircleReveal(options: RunThemeCircleRevealOptions): void {
	const {
		originX,
		originY,
		previousSurfaceColor,
		applyNewTheme,
		durationMs = 480,
		onComplete,
	} = options;

	for (const el of document.querySelectorAll(`[${REVEAL_MARK}]`)) {
		el.remove();
	}

	const div = document.createElement("div");
	div.setAttribute(REVEAL_MARK, "");
	div.setAttribute("aria-hidden", "true");
	div.style.cssText = [
		"position:fixed",
		"inset:0",
		"z-index:9999",
		"pointer-events:none",
		`background:${previousSurfaceColor}`,
		"mask-repeat:no-repeat",
		"-webkit-mask-repeat:no-repeat",
	].join(";");

	const endR =
		Math.hypot(
			Math.max(originX, window.innerWidth - originX),
			Math.max(originY, window.innerHeight - originY),
		) * 1.02;

	document.body.appendChild(div);
	setRevealMask(div, originX, originY, 0);
	applyNewTheme();

	let done = false;
	const finish = () => {
		if (done) return;
		done = true;
		if (div.isConnected) div.remove();
		onComplete?.();
	};

	const start = performance.now();

	function step(now: number) {
		if (!div.isConnected) {
			finish();
			return;
		}
		const t = Math.min(1, (now - start) / durationMs);
		const eased = easeOutCubic(t);
		const r = eased * endR;
		setRevealMask(div, originX, originY, r);
		if (t < 1) {
			requestAnimationFrame(step);
		} else {
			finish();
		}
	}

	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			requestAnimationFrame(step);
		});
	});

	window.setTimeout(finish, durationMs + 120);
}
