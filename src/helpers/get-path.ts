import {staticFile} from 'remotion';
import opentype from 'opentype.js';

export const getPath = (text: string) => {
	return new Promise<string>((resolve, reject) => {
		opentype.load(staticFile('Roboto-Medium.ttf'), (err, font) => {
			if (err) {
				reject(err);
				return;
			}
			if (!font) {
				reject(new Error('No font found'));
				return;
			}

			const path = font.getPath(text, 0, 150, 72);
			resolve(path.toPathData(2));
		});
	});
};

export const getFont = () => {
	return new Promise<opentype.Font>((resolve, reject) => {
		opentype.load(staticFile('Roboto-Medium.ttf'), (err, font) => {
			if (err) {
				reject(err);
				return;
			}
			if (!font) {
				reject(new Error('No font found'));
				return;
			}

			resolve(font);
		});
	});
};
