import {useEffect, useRef, useState} from 'react';
import {
	AbsoluteFill,
	continueRender,
	delayRender,
	useCurrentFrame,
} from 'remotion';

import {
	getBoundingBox,
	resetPath,
	scalePath,
	warpPath,
	WarpPathFn,
} from '@remotion/paths';
import {getPath} from './helpers/get-path';

// Recreating the album cover typography from https://en.wikipedia.org/wiki/So_Good_(Zara_Larsson_album)

function normalDistribution(x: number): number {
	return Math.exp(-(x ** 2) / 2) / Math.sqrt(2 * Math.PI);
}

export const SoGood = () => {
	const [path, setPath] = useState<string | null>(() => null);
	const ref = useRef<SVGSVGElement>(null);
	const frame = useCurrentFrame();
	const [handle] = useState(() => delayRender());

	useEffect(() => {
		getPath('SO GOOD').then((p) => {
			setPath(p);
			continueRender(handle);
		});
	}, [frame, handle]);

	if (!path) {
		return null;
	}

	const reset = resetPath(path);
	const scaled = scalePath(reset, 1, 5);

	const boundingBox = getBoundingBox(scaled);
	const height = boundingBox.y2 - boundingBox.y1;

	const start = 0.4 * height;
	const length = 0.07 * height;

	const warpPathFn: WarpPathFn = ({x, y}) => {
		const currentPos = y - start;

		const ease = normalDistribution(currentPos / length);

		return {
			x: x + 50 * ease,
			y,
		};
	};

	const warped = warpPath(scaled, warpPathFn);

	const {x1, x2, y1, y2} = boundingBox;

	return (
		<AbsoluteFill
			style={{
				backgroundColor: 'rgb(87 132 153)',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			{path ? (
				<svg
					ref={ref}
					style={{
						overflow: 'visible',
						height: 500,
					}}
					viewBox={`${x1} ${y1} ${x2 - x1} ${y2 - y1}`}
				>
					<path
						d={warped}
						fill="transparent"
						stroke="#E2BECC"
						strokeWidth={3}
					/>
				</svg>
			) : null}
		</AbsoluteFill>
	);
};
