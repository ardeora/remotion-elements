import React, {FC} from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {z} from 'zod';

export const ZoomOutSchema = z.object({
	delay: z.number().min(0).optional(),
	duration: z.number().min(0).optional(),
	scaleFrom: z.number().min(0).optional(),
	scaleTo: z.number().min(0).optional(),
	easing: z.function().args(z.number()).returns(z.number()).optional(),
	extrapolateLeft: z.enum(['clamp', 'extend', 'identity']).optional(),
	extrapolateRight: z.enum(['clamp', 'extend', 'identity']).optional(),
	children: z.object({}).optional(),
	style: z.object({}).optional(),
});

export type ZoomOutProps = z.infer<typeof ZoomOutSchema> & {
	children?: React.ReactNode;
	style?: React.CSSProperties;
};

export const ZoomOut: FC<ZoomOutProps> = (props) => {
	const {
		delay = 0,
		duration = 60,
		children,
		scaleFrom = 1,
		scaleTo = 0,
		style = {},
		easing = Easing.bezier(0.83, 0, 0.17, 1),
		extrapolateLeft = 'clamp',
		extrapolateRight = 'clamp',
	} = props;

	const frame = useCurrentFrame();
	const scale = interpolate(
		frame - delay,
		[0, duration],
		[scaleFrom, scaleTo],
		{
			extrapolateLeft,
			extrapolateRight,
			easing,
		}
	);

	return (
		<div
			style={{
				...style,
				transform: style.transform
					? `${style.transform} scale(${scale})`
					: `scale(${scale})`,
			}}
		>
			{children}
		</div>
	);
};
