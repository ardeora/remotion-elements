import React, {FC} from 'react';
import {
	AbsoluteFill,
	Composition,
	Easing,
	interpolate,
	random,
	useCurrentFrame,
} from 'remotion';
// Import {
// 	FadeReveal,
// 	FadeRevealProps,
// 	FadeRevealSchema,
// } from '../components/Text/Wavy/FadeReveal';
import {loadFont} from '@remotion/google-fonts/Poppins';
import {z} from 'zod';
import {zColor} from '@remotion/zod-types';
import {ZoomOut} from '../components/Motion/ZoomOut/ZoomOut';
import {hexToHsl, hslToHex} from '../utils';
import {FadeReveal} from '../components/Text/FadeReveal/FadeReveal';
const {fontFamily} = loadFont();

export const FadeRevealPlaygroundSchema = z.object({
	playground: z.object({
		primaryColor: zColor(),
		secondaryColor: zColor(),
	}),
	fadeReveal: z.object({
		text: z.string().optional(),
		fontSize: z.number().optional(),
		fontWeight: z
			.enum(['100', '200', '300', '400', '500', '600', '700', '800', '900'])
			.optional(),
		mass: z.number().optional(),
		damping: z.number().gt(0).optional(),
		stiffness: z.number().optional(),
	}),
});

const Background: FC<
	z.infer<typeof FadeRevealPlaygroundSchema>['playground']
> = (props) => {
	const frame = useCurrentFrame();
	const {primaryColor, secondaryColor} = props;

	const primaryColorHsl = hexToHsl(primaryColor);
	const secondaryColorHsl = hexToHsl(secondaryColor);

	const primaryColorComplement = hslToHex(
		(primaryColorHsl.h + 60) % 360,
		primaryColorHsl.s,
		primaryColorHsl.l
	);

	const secondaryColorComplement = hslToHex(
		(secondaryColorHsl.h + 60) % 360,
		secondaryColorHsl.s,
		secondaryColorHsl.l
	);

	const delay = 38;

	const rotate = interpolate(frame - delay, [0, 40], [0, -90], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.83, 0, 0.17, 1),
	});

	const yGap = interpolate(frame - delay, [0, 50], [800, 100], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.83, 0, 0.17, 1),
	});

	const top = interpolate(frame, [0, 250], [80, -100], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0, 0.55, 0.45, 1),
	});

	return (
		<>
			<div
				style={{
					width: 'max-content',
					top: '50%',
					left: '10px',
					position: 'absolute',
					transform: `translate(0%, -50%)`,
					// Transform: `translate(-50%, -50%) rotate(${rotate}deg)`,

					// border: '2px solid black',
				}}
			>
				<MovingCirclesGrid {...props} />
			</div>
			<div
				style={{
					fontSize: 4000,
					top: `${top}%`,
					left: '-18%',
					transform: `scaleX(1.05)`,
					position: 'absolute',
					fontFamily: 'esthetique',
					color: primaryColor,
				}}
			>
				C
			</div>
		</>
	);
};

const MovingCirclesGrid: FC<
	z.infer<typeof FadeRevealPlaygroundSchema>['playground']
> = (props) => {
	const frame = useCurrentFrame();
	const rows = 4;
	const columns = 4;
	const gap = 20;
	const width = 250;
	const height = width;

	const {primaryColor, secondaryColor} = props;

	const opacityEasing = Easing.bezier(0.65, 0, 0.35, 1);

	const topLeftOpacity = interpolate(frame - 15, [0, 20], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: opacityEasing,
	});

	const topRightOpacity = interpolate(frame - 20, [0, 20], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: opacityEasing,
	});

	const bottomRightOpacity = interpolate(frame - 25, [0, 20], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: opacityEasing,
	});

	const bottomLeftOpacity = interpolate(frame - 30, [0, 20], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: opacityEasing,
	});

	const topLeftTranslateY = interpolate(
		frame - 40,
		[0, 20],
		[(width + gap) * 1, 0],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.bezier(0.83, 0, 0.17, 1),
		}
	);

	const bottomLeftTranslateY = interpolate(
		frame - 43,
		[0, 20],
		[(height + gap) * 2, (height + gap) * 1],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.bezier(0.83, 0, 0.17, 1),
		}
	);

	const bottomRightTranslateY = interpolate(
		frame - 48,
		[0, 20],
		[(height + gap) * 2, height + gap],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.bezier(0.83, 0, 0.17, 1),
		}
	);

	const bottomRightTranslateX = interpolate(
		frame - 48 - 23,
		[0, 20],
		[(width + gap) * 2, (width + gap) * 3],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.bezier(0.83, 0, 0.17, 1),
		}
	);

	return (
		<div
			style={{
				position: 'relative',
				display: 'flex',
				flexDirection: 'column',
				gap: gap + 'px',
			}}
		>
			{Array.from({length: rows}).map((_, rowIndex) => {
				return (
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: gap + 'px',
						}}
					>
						{Array.from({length: columns}).map((_, columnIndex) => {
							const delay = random(`${rowIndex}${columnIndex}`) * 20 + 10;

							const opacity = interpolate(frame - delay, [0, 30], [0, 0.2], {
								extrapolateLeft: 'clamp',
								extrapolateRight: 'clamp',
							});

							return (
								<div
									style={{
										width: width + 'px',
										height: height + 'px',
										backgroundColor: primaryColor,
										borderRadius: '50%',
										opacity,
									}}
								/>
							);
						})}
					</div>
				);
			})}

			<div
				style={{
					width: width + 'px',
					height: height + 'px',
					backgroundColor: primaryColor,
					position: 'absolute',
					top: `${(height + gap) * 1}px`,
					left: `${topLeftTranslateY}px`,
					borderRadius: '50%',
					opacity: topLeftOpacity,
				}}
			/>
			<div
				style={{
					width: width + 'px',
					height: height + 'px',
					backgroundColor: primaryColor,
					position: 'absolute',
					top: `${(height + gap) * 1}px`,
					left: `${(width + gap) * 2}px`,
					borderRadius: '50%',
					opacity: topRightOpacity,
				}}
			/>
			<div
				style={{
					width: width + 'px',
					height: height + 'px',
					backgroundColor: primaryColor,
					position: 'absolute',
					top: `${bottomRightTranslateY}px`,
					left: `${bottomRightTranslateX}px`,
					borderRadius: '50%',
					opacity: bottomRightOpacity,
				}}
			/>
			<div
				style={{
					width: width + 'px',
					height: height + 'px',
					backgroundColor: primaryColor,
					position: 'absolute',
					top: `${bottomLeftTranslateY}px`,
					left: `${(width + gap) * 1}px`,
					borderRadius: '50%',
					opacity: bottomLeftOpacity,
				}}
			/>
		</div>
	);
};

export const Playground: React.FC<
	z.infer<typeof FadeRevealPlaygroundSchema>
> = (props) => {
	const {primaryColor, secondaryColor} = props.playground;

	return (
		<AbsoluteFill
			style={{
				position: 'relative',
				display: 'block',
				backgroundColor: secondaryColor,
			}}
		>
			<Background {...props.playground} />

			<ZoomOut
				style={{
					padding: '10px 40px',
					borderRadius: '16px',
					position: 'absolute',
					top: '50%',
					left: '50%',
					width: 'max-content',
					transform: 'translate(-50%, -50%)',
				}}
				delay={30}
				scaleTo={0.7}
			>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<div
						style={{
							position: 'relative',
							top: '20px',
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'flex-end',
						}}
					>
						<FadeReveal
							text="TITLE"
							fontWeight="600"
							fontSize={70}
							fontFamily="Inter"
						/>
					</div>
					<FadeReveal {...props.fadeReveal} fontFamily="Inter" />
				</div>
			</ZoomOut>
		</AbsoluteFill>
	);
};

export const FadeRevealPlayground = () => {
	return (
		<Composition
			id="PlaygroundFadeReveal"
			component={Playground}
			durationInFrames={150}
			fps={30}
			width={1920}
			height={1080}
			schema={FadeRevealPlaygroundSchema}
			defaultProps={{
				playground: {
					primaryColor: '#ff6524',
					secondaryColor: '#1c110d',
				},
				fadeReveal: {
					text: 'PHOTOGRAPHIC',
					fontSize: 200,
					fontWeight: '700',
					mass: 1,
					damping: 10,
					stiffness: 100,
				},
			}}
		/>
	);
};
