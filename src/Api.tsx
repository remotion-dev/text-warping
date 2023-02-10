import {useEffect, useRef, useState} from 'react';
import {
	AbsoluteFill,
	continueRender,
	delayRender,
	interpolate,
	useCurrentFrame,
} from 'remotion';

import {
	getBoundingBox,
	resetPath,
	scalePath,
	translatePath,
	warpPath,
	WarpPathFn,
} from '@remotion/paths';
import {getPath} from './helpers/get-path';

function normalDistribution(x: number): number {
	return Math.exp(-(x ** 2) / 2) / Math.sqrt(2 * Math.PI);
}

export const Api = () => {
	const [path, setPath] = useState<string | null>(() => null);
	const ref = useRef<SVGSVGElement>(null);
	const frame = useCurrentFrame();
	const [handle] = useState(() => delayRender());

	useEffect(() => {
		getPath('API').then((p) => {
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

	const start = interpolate(frame, [0, 160], [-0.2, 1.2]) * height;
	const length = 0.12 * height;

	const warpPathFn: WarpPathFn = ({x, y}) => {
		const currentPos = y - start;

		const ease = normalDistribution(currentPos / length);

		return {
			x: x + 100 * ease,
			y,
		};
	};

	const warped = warpPath(scaled, warpPathFn);

	const {x1, x2, y1, y2} = boundingBox;

	return (
		<AbsoluteFill
			style={{
				backgroundColor: 'white',
			}}
		>
			<AbsoluteFill
				style={{
					backgroundColor: '#8093f1',
					justifyContent: 'center',
					alignItems: 'center',
					transform: `scale(0.8)`,
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
							stroke="#f7aef8"
							strokeWidth={3}
						/>
					</svg>
				) : null}
			</AbsoluteFill>

			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					transform: `scale(0.8)`,
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
						<path d={translatePath(warped, 4, 4)} fill="white" />
					</svg>
				) : null}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
