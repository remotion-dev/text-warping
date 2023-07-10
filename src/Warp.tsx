import {useEffect, useRef, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender} from 'remotion';

import {getBoundingBox, resetPath, warpPath, WarpPathFn} from '@remotion/paths';
import {getPath} from './helpers/get-path';

export const WarpDemo = () => {
	const [path, setPath] = useState<string | null>(() => null);
	const ref = useRef<SVGSVGElement>(null);
	const [handle] = useState(() => delayRender());

	useEffect(() => {
		getPath('REMOTION').then((p) => {
			setPath(p);
			continueRender(handle);
		});
	}, [handle]);

	if (!path) {
		return null;
	}

	const reset = resetPath(path);

	const warpPathFn: WarpPathFn = ({x, y}) => ({
		x: x + Math.sin(y / 4) * 3,
		y: y * 3,
	});

	const warped = warpPath(reset, warpPathFn, {
		interpolationThreshold: 1,
	});
	const box = getBoundingBox(warped);

	const {x1, x2, y1, y2} = box;

	return (
		<AbsoluteFill
			style={{
				backgroundColor: 'white',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			{path ? (
				<svg
					ref={ref}
					style={{
						overflow: 'visible',
						height: 300,
					}}
					viewBox={`${x1} ${y1} ${x2 - x1} ${y2 - y1}`}
				>
					<path d={warped} fill="black" stroke="black" strokeWidth={3} />
				</svg>
			) : null}
		</AbsoluteFill>
	);
};
