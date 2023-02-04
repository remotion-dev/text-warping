import {useEffect, useRef, useState} from 'react';
import opentype from 'opentype.js';
import {AbsoluteFill, staticFile} from 'remotion';
// @ts-expect-error no types
import Warp = require('warpjs');

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

	useEffect(() => {
		getPath().then((p) => {
			setPath(p);
		});
	}, []);

	useEffect(() => {
		if (!path) {
			return;
		}
		const warp = new Warp(ref.current);

		warp.interpolate(4);

		warp.transform(([x, y]: [number, number]) => [x + 2 * Math.sin(y / 4), y]);
	}, [path]);

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
					<path d={path.path} fill="black" />
				</svg>
			) : null}
		</AbsoluteFill>
	);
};
