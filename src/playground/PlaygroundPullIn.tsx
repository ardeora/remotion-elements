import React, {FC} from 'react';
import {
	AbsoluteFill,
	Composition,
	Easing,
	interpolate,
	random,
	Sequence,
	useCurrentFrame,
} from 'remotion';
// Import {
// 	PullIn,
// 	PullInProps,
// 	PullInSchema,
// } from '../components/Text/Wavy/PullIn';
import {loadFont} from '@remotion/google-fonts/Poppins';
import {z} from 'zod';
import {zColor} from '@remotion/zod-types';
import {ZoomOut} from '../components/Motion/ZoomOut/ZoomOut';
import {hexToHsl, hslToHex} from '../utils';
import {PullIn} from '../components/Text/PullIn/PullIn';
// Import {PullIn} from '../components/Text/PullIn/PullIn';
const {fontFamily} = loadFont();

export const PullInPlaygroundSchema = z.object({
	playground: z.object({
		primaryColor: zColor(),
	}),
	pullIn: z.object({
		text: z.string().optional(),
		fontSize: z.number().optional(),
		startGap: z.number().optional(),
		endGap: z.number().optional(),
		fontWeight: z
			.enum(['100', '200', '300', '400', '500', '600', '700', '800', '900'])
			.optional(),
	}),
});

const Background: FC<
	z.infer<typeof PullInPlaygroundSchema>['playground'] & {
		children: React.ReactNode;
	}
> = (props) => {
	const frame = useCurrentFrame();
	const {primaryColor} = props;

	const primaryColorHsl = hexToHsl(primaryColor);

	return (
		<>
			<div
				style={{
					width: 'max-content',
					top: '50%',
					left: '50%',
					position: 'absolute',
					transform: `translate(-50%, -50%)`,
					// Transform: `translate(-50%, -50%) rotate(${rotate}deg)`,

					// border: '2px solid black',
				}}
			>
				{props.children}
			</div>
		</>
	);
};

const MovingCircles: FC<
	z.infer<typeof PullInPlaygroundSchema>['playground'] & {
		size?: number;
	}
> = (props) => {
	const frame = useCurrentFrame();
	const rows = 4;
	const columns = 4;
	const gap = 20;
	const width = props.size ?? 650;
	const height = width;

	const {primaryColor} = props;
	const primaryColorHsl = hexToHsl(primaryColor);

	const primaryColorComplement = hslToHex(
		(primaryColorHsl.h + 180) % 360,
		primaryColorHsl.s,
		primaryColorHsl.l
	);

	const mixBlendMode = 'color-dodge';

	const yMove = interpolate(frame, [0, 40], [0, 35], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
		easing: Easing.bezier(0.65, 0, 0.35, 1),
	});

	const xMove = interpolate(frame, [0, 40], [0, 65], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
		easing: Easing.bezier(0.65, 0, 0.35, 1),
	});

	const rotate = interpolate(frame, [0, 540], [0, 360], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
	});

	return (
		<div
			style={{
				position: 'relative',
				width,
				height,
				transform: `rotate(${rotate}deg)`,
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: `translate(-50%, ${-50 - yMove}%)`,
					zIndex: 1,
					background: primaryColor,
					borderRadius: '50%',
					mixBlendMode,
					opacity: 0.8,
					width,
					height,
				}}
			/>

			<div
				style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					zIndex: 1,
					transform: `translate(-50%, ${-50 + yMove}%)`,
					background: primaryColor,
					borderRadius: '50%',
					opacity: 0.8,
					mixBlendMode,
					width,
					height,
				}}
			/>

			<div
				style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: `translate(${-50 + xMove}%, -50%)`,
					background: primaryColorComplement,
					borderRadius: '50%',
					width,
					height,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: `translate(${-50 - xMove}%, -50%)`,
					background: primaryColorComplement,
					borderRadius: '50%',
					mixBlendMode: 'difference',
					width,
					height,
				}}
			/>
		</div>
	);
};

export const Playground: React.FC<z.infer<typeof PullInPlaygroundSchema>> = (
	props
) => {
	const frame = useCurrentFrame();
	const {primaryColor} = props.playground;

	const primaryColorHsl = hexToHsl(primaryColor);

	const primaryColorDark = hslToHex(primaryColorHsl.h, 50, 15);

	const blur = interpolate(frame - 40, [0, 30], [12, 0], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
	});

	const primaryColorComplement = hslToHex(
		(primaryColorHsl.h + 180) % 360,
		primaryColorHsl.s,
		primaryColorHsl.l
	);

	const marqueeSize = 1000;

	const marqueeMove = interpolate(frame, [0, 120], [0, -1040], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				position: 'relative',
				display: 'block',
				backgroundColor: primaryColorDark,
			}}
		>
			<Sequence name="First" durationInFrames={50}>
				<Background {...props.playground}>
					<MovingCircles {...props.playground} />
				</Background>
				<div
					style={{
						padding: '10px 40px',
						borderRadius: '16px',
						position: 'absolute',
						top: '50%',
						left: '50%',
						width: 'max-content',
						transform: 'translate(-50%, -50%)',
						mixBlendMode: 'difference',
					}}
				>
					<PullIn {...props.pullIn} fontFamily="Product Sans" />
				</div>
			</Sequence>

			<Sequence name="Second" from={5}>
				<div
					style={{
						display: frame < 50 ? 'none' : 'block',
						flex: 1,
					}}
				>
					<Background {...props.playground}>
						<MovingCircles {...props.playground} size={400} />
					</Background>

					<div
						style={{
							// Border: `2px solid ${primaryColorComplement}`,
							display: 'block',
							position: 'absolute',
							width: '100%',
							bottom: 0,
							left: 0,
							transform: 'rotate(45deg) translate(-200px, 600px) scaleY(1.1)',
							overflow: 'hidden',
						}}
					>
						<div
							style={{
								color: 'transparent',
								fontSize: marqueeSize,
							}}
						>
							{props.pullIn.text}
						</div>
						<div
							style={{
								color: primaryColorComplement,
								fontSize: marqueeSize,
								fontWeight: '700',
								fontFamily: 'Product Sans',
								position: 'absolute',
								top: 0,
								left: `${marqueeMove}px`,
							}}
						>
							{Array.from({length: 30}, () => props.pullIn.text).join(' ')}
						</div>
					</div>

					<div
						style={{
							// Border: `2px solid ${primaryColorComplement}`,
							display: 'block',
							position: 'absolute',
							width: '100%',
							bottom: 0,
							left: 0,
							transform: 'rotate(45deg) translate(200px, -850px) scaleY(1.1)',
							overflow: 'hidden',
						}}
					>
						<div
							style={{
								color: 'transparent',
								fontSize: marqueeSize,
							}}
						>
							{props.pullIn.text}
						</div>
						<div
							style={{
								color: primaryColorComplement,
								fontSize: marqueeSize,
								fontWeight: '700',
								fontFamily: 'Product Sans',
								position: 'absolute',
								top: 0,
								right: `${marqueeMove}px`,
							}}
						>
							{Array.from({length: 30}, () => props.pullIn.text).join(' ')}
						</div>
					</div>
				</div>
			</Sequence>
		</AbsoluteFill>
	);
};

export const PullInPlayground = () => {
	return (
		<Composition
			id="PlaygroundPullIn"
			component={Playground}
			durationInFrames={150}
			fps={30}
			width={1920}
			height={1080}
			schema={PullInPlaygroundSchema}
			defaultProps={{
				playground: {
					primaryColor: '#ff6524',
				},
				pullIn: {
					text: 'Geometry',
					fontSize: 200,
					fontWeight: '700',
					startGap: 100,
					endGap: 0,
				},
			}}
		/>
	);
};
