import {useEffect, useRef, useState} from 'react';
import opentype from 'opentype.js';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';

import {interpolate, transform} from '@jonny/warpts';

type FontInfo = {
	path: string;
	box: opentype.BoundingBox;
};

const getPath = () => {
	return new Promise<FontInfo>((resolve, reject) => {
		opentype.load(staticFile('Roboto-Medium.ttf'), (err, font) => {
			if (err) {
				reject(err);
				return;
			}
			if (!font) {
				reject(new Error('No font found'));
				return;
			}

			const path = font.getPath('REMOTION', 0, 150, 72);
			const p = path.toPathData(2);
			const box = path.getBoundingBox();
			resolve({path: p, box});
		});
	});
};

export const MyComposition = () => {
	const [path, setPath] = useState<FontInfo | null>(() => null);
	const ref = useRef<SVGSVGElement>(null);
	const frame = useCurrentFrame();

	useEffect(() => {
		getPath().then((p) => {
			const interpolated = interpolate(p.path, 4);
			const warped = transform(
				interpolated,
				([x, y]: number[]) =>
					[x + 2 * Math.sin(frame / 20 + y / 4), y] as [number, number]
			);
			setPath({
				box: p.box,
				path: warped,
			});
		});
	}, [frame]);

	if (!path) {
		return null;
	}

	const {box} = path;
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
						height: 150,
					}}
					viewBox={`${x1} ${y1} ${x2 - x1} ${y2 - y1}`}
				>
					<path d={path.path} stroke="black" fill="transparent" />
				</svg>
			) : null}
		</AbsoluteFill>
	);
};
