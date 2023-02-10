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
import {getFont} from './helpers/get-path';
import {noise2D} from '@remotion/noise';

export const Blocks = () => {
	const [font, setFont] = useState<opentype.Font | null>(() => null);
	const ref = useRef<SVGSVGElement>(null);
	const frame = useCurrentFrame();
	const [handle] = useState(() => delayRender());

	useEffect(() => {
		getFont().then((p) => {
			setFont(p);
			continueRender(handle);
		});
	}, [frame, handle]);

	if (!font) {
		return null;
	}

	const path = font.getPath('WARPPATH', 0, 150, 72).toPathData(2);

	const reset = resetPath(path);
	const box1 = getBoundingBox(reset);
	const height = box1.y2;

	const warpPathFn: WarpPathFn = ({x, y}) => {
		const section = Math.floor((y / (height + 0.0001)) * 4);
		return {
			x: x + noise2D('blocks' + section, frame / 100, 0) * 10,
			y,
		};
	};

	const warped = scalePath(
		warpPath(reset, warpPathFn, {
			interpolationThreshold: 1,
		}),
		2.5,
		2.5
	);
	const box = getBoundingBox(warped);

	const {x1, x2, y1, y2} = box;

	return (
		<AbsoluteFill
			style={{
				backgroundColor: 'white',
			}}
		>
			<AbsoluteFill
				style={{
					backgroundColor: '#3a0ca3',
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
							height: y2 - y1,
						}}
						viewBox={`${x1} ${y1} ${x2 - x1} ${y2 - y1}`}
					>
						<path d={warped} fill="#4cc9f0" />
					</svg>
				) : null}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
