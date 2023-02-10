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
	warpPath,
	WarpPathFn,
} from '@remotion/paths';
import {getFont} from './helpers/get-path';

export const Styled = () => {
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

	const path = font.getPath('REMOTION', 0, 150, 72).toPathData(2);

	const reset = resetPath(path);

	const warpPathFn: WarpPathFn = ({x, y}) => ({
		x: x + Math.sin(y / 4 + frame / 20) * 3,
		y: y * interpolate(Math.sin(frame / 100), [-1, 1], [4, 1]),
	});

	const warped = scalePath(
		warpPath(reset, warpPathFn, {
			interpolationThreshold: 1,
		}),
		2,
		2
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
					backgroundColor: '#ffca3a',
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
						<path d={warped} fill="#8ac926" stroke="#000" strokeWidth={5} />
					</svg>
				) : null}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
