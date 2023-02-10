import {Composition} from 'remotion';
import {WarpDemo} from './Composition';
import {ScaleDemo} from './ScaleDemo';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="Warp"
				component={WarpDemo}
				durationInFrames={200}
				fps={30}
				width={1280}
				height={720}
			/>
			<Composition
				id="Scale"
				component={ScaleDemo}
				durationInFrames={200}
				fps={30}
				width={1280}
				height={720}
			/>
		</>
	);
};
