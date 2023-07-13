import React from 'react';
import {AbsoluteFill, Composition} from 'remotion';
import {WavyText, WavyTextProps, WavyTextSchema} from './FadeReveal';
import {loadFont} from '@remotion/google-fonts/Poppins';

const {fontFamily} = loadFont();

export const Story: React.FC<WavyTextProps> = (props) => {
	return (
		<div
			style={{
				display: 'inline-block',
			}}
		>
			<WavyText {...props} />
		</div>
	);
};

export const WavyTextStory = () => {
	return (
		<Composition
			id="WavyText"
			component={Story}
			durationInFrames={150}
			fps={30}
			width={1920}
			height={1080}
			schema={WavyTextSchema}
			defaultProps={{
				text: 'this is a wavy text animation',
				color: 'white',
				fontFamily,
				fontSize: 100,
				fontWeight: '400',
				waveDuration: 30,
				staggerDelay: 1,
				mass: 1,
				damping: 10,
				stiffness: 100,
			}}
		/>
	);
};
