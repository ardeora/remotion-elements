import {Composition, Folder} from 'remotion';
import {WavyTextSchema} from './components/Text/Wavy/WavyText';
import {Story, WavyTextStory} from './components/Text/Wavy/WavyText.story';
import {FadeRevealPlayground} from './playground/PlaygroundFadeReveal';
import {PullInPlayground} from './playground/PlaygroundPullIn';
import {WavyTextPlayground} from './playground/PlaygroundWavyText';

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<WavyTextStory />
			<Folder name="Playground">
				<WavyTextPlayground />
				<FadeRevealPlayground />
				<PullInPlayground />
			</Folder>
		</>
	);
};
