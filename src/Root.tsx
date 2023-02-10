import {Composition} from 'remotion';
import {WarpDemo} from './Warp';
import {ScaleDemo} from './ScaleDemo';
import {SoGood} from './SoGood';
import {Styled} from './Styled';
import {Blocks} from './Blocks';
import {Api} from './Api';
import {Promo} from './Promo';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="Warp"
				component={WarpDemo}
				durationInFrames={200}
				fps={30}
				width={1080}
				height={1080}
			/>
			<Composition
				id="Scale"
				component={ScaleDemo}
				durationInFrames={200}
				fps={30}
				width={1280}
				height={720}
			/>
			<Composition
				id="SoGood"
				component={SoGood}
				durationInFrames={200}
				fps={30}
				width={1080}
				height={1080}
			/>
			<Composition
				id="Styled"
				component={Styled}
				durationInFrames={200}
				fps={30}
				width={1080}
				height={1080}
			/>
			<Composition
				id="Blocks"
				component={Blocks}
				durationInFrames={200}
				fps={30}
				width={1080}
				height={1080}
			/>
			<Composition
				id="Api"
				component={Api}
				durationInFrames={200}
				fps={30}
				width={1080}
				height={1080}
			/>
			<Composition
				id="Promo"
				component={Promo}
				durationInFrames={600}
				fps={30}
				width={1080}
				height={1080}
			/>
		</>
	);
};
