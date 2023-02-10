import React from 'react';
import {Series} from 'remotion';
import {Api} from './Api';
import {Blocks} from './Blocks';
import {Styled} from './Styled';

export const Promo: React.FC = () => {
	return (
		<Series>
			<Series.Sequence durationInFrames={200}>
				<Styled />
			</Series.Sequence>
			<Series.Sequence durationInFrames={200}>
				<Blocks />
			</Series.Sequence>
			<Series.Sequence durationInFrames={200}>
				<Api />
			</Series.Sequence>
		</Series>
	);
};
