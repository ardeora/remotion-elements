import React from 'react';
import {z} from 'zod';
import {zColor} from '@remotion/zod-types';
import {
	Easing,
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

export const PullInSchema = z.object({
	text: z.string().optional(),
	color: zColor().optional(),
	fontFamily: z.string().optional(),
	fontSize: z.number().optional(),
	fontWeight: z
		.enum(['100', '200', '300', '400', '500', '600', '700', '800', '900'])
		.optional(),
	startGap: z.number().optional(),
	endGap: z.number().optional(),
});

export type PullInProps = z.infer<typeof PullInSchema>;

export const PullIn: React.FC<PullInProps> = ({
	text = 'Hello World',
	color = 'white',
	fontFamily = 'sans-serif',
	fontSize = 32,
	fontWeight = '400',
	startGap = 40,
	endGap = 0,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const splitText = splitStringWithSpaces(text);

	const gap = interpolate(frame, [0, 40], [startGap, endGap], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
		easing: Easing.bezier(0.65, 0, 0.35, 1),
	});

	return (
		<span
			style={{
				fontFamily,
				color,
				fontSize,
				fontWeight,
				display: 'inline-flex',
				gap,
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			{splitText.map((char, i) => {
				return (
					<span
						key={i}
						style={{
							position: 'relative',
							display: 'inline-block',
						}}
					>
						{char === ' ' ? '\u00A0' : char}
					</span>
				);
			})}
		</span>
	);
};
