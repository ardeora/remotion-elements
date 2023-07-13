import React from 'react';
import {z} from 'zod';
import {zColor} from '@remotion/zod-types';
import {
	interpolate,
	random,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

function splitStringWithSpaces(string: string): string[] {
	const result: string[] = [];
	for (let i = 0; i < string.length; i++) {
		result.push(string.charAt(i));
	}
	return result;
}

export const FadeRevealSchema = z.object({
	text: z.string().optional(),
	color: zColor().optional(),
	fontFamily: z.string().optional(),
	fontSize: z.number().optional(),
	fontWeight: z
		.enum(['100', '200', '300', '400', '500', '600', '700', '800', '900'])
		.optional(),
	waveDuration: z.number().min(1).optional(),
	staggerDelay: z.number().min(0).optional(),
	mass: z.number().optional(),
	damping: z.number().gt(0).optional(),
	stiffness: z.number().optional(),
});

export type FadeRevealProps = z.infer<typeof FadeRevealSchema>;

export const FadeReveal: React.FC<FadeRevealProps> = ({
	text = 'Hello World',
	color = 'white',
	fontFamily = 'sans-serif',
	fontSize = 32,
	fontWeight = '400',
	staggerDelay = 1,
	mass = 1,
	damping = 10,
	stiffness = 100,
	waveDuration,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const splitText = splitStringWithSpaces(text);

	waveDuration = waveDuration || fps;

	return (
		<span
			style={{
				fontFamily,
				color,
				fontSize,
				fontWeight,
				display: 'inline-block',
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			{splitText.map((char, i) => {
				const delay = random(i) * 50 + 5;

				const springVal = spring({
					fps,
					frame,
					delay,
					durationInFrames: waveDuration,
					config: {
						mass,
						damping,
						stiffness,
					},
				});

				const opacity = interpolate(frame - delay, [0, 40], [0, 1]);

				return (
					<span
						key={i}
						style={{
							position: 'relative',
							display: 'inline-block',
						}}
					>
						<span
							style={{
								opacity: 0,
							}}
						>
							{char === ' ' ? '\u00A0' : char}
						</span>
						<span
							style={{
								opacity,
								position: 'absolute',
								top: 0,
								left: 0,
							}}
						>
							{char === ' ' ? '\u00A0' : char}
						</span>
					</span>
				);
			})}
		</span>
	);
};
