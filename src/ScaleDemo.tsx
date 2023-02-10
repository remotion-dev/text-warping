import {delayRender} from 'remotion';
import {useEffect, useRef, useState} from 'react';
import {
	AbsoluteFill,
	continueRender,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

import {getBoundingBox, resetPath, scalePath} from '@remotion/paths';
import {getPath} from './helpers/get-path';

export const ScaleDemo = () => {
	const [path, setPath] = useState<string | null>(() => null);
	const ref = useRef<SVGSVGElement>(null);
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const [handle] = useState(() => delayRender());

	const sprY =
		spring({
			fps,
			frame,
			config: {
				damping: 200,
			},
		}) *
			4 +
		1;

	useEffect(() => {
		getPath('REMOTION').then((p) => {
			setPath(p);
			continueRender(handle);
		});
	}, [frame, handle]);

	if (!path) {
		return null;
	}

	const reset = resetPath(path);

	const warped = scalePath(reset, 1, sprY);
	const box = getBoundingBox(warped);

	const {x1, x2, y1, y2} = box;

	return (
		<AbsoluteFill
			style={{
				backgroundColor: 'black',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			{path ? (
				<svg
					ref={ref}
					style={{
						overflow: 'visible',
						height: 100 * sprY,
					}}
					viewBox={`${x1} ${y1} ${x2 - x1} ${y2 - y1}`}
				>
					<path d={warped} fill="transparent" stroke="pink" strokeWidth={2} />
				</svg>
			) : null}
		</AbsoluteFill>
	);
};
