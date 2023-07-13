import React, {FC} from 'react';
import {
	AbsoluteFill,
	Composition,
	Easing,
	interpolate,
	useCurrentFrame,
} from 'remotion';
import {
	WavyText,
	WavyTextProps,
	WavyTextSchema,
} from '../components/Text/Wavy/WavyText';
import {loadFont} from '@remotion/google-fonts/Poppins';
import {z} from 'zod';
import {zColor} from '@remotion/zod-types';
import {ZoomOut} from '../components/Motion/ZoomOut/ZoomOut';
import {hexToHsl, hslToHex} from '../utils';
const {fontFamily} = loadFont();

export const WavyTextPlaygroundSchema = z.object({
	playground: z.object({
		primaryColor: zColor(),
		secondaryColor: zColor(),
	}),
	wavyText: z.object({
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

const Background: FC<z.infer<typeof WavyTextPlaygroundSchema>['playground']> = (
	props
) => {
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

	const width = interpolate(frame - delay, [0, 50], [100, 200], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.83, 0, 0.17, 1),
	});

	return (
		<div
			style={{
				width: '100%',
				display: 'flex',
				position: 'absolute',
				gap: `${yGap}px`,
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100%',
				top: '50%',
				left: '50%',
				transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
			}}
		>
			<div
				style={{
					width: '100%',
					display: 'flex',
					gap: '100px',
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100%',
				}}
			>
				<ConcentricCircles
					primaryColor={primaryColorComplement}
					secondaryColor={secondaryColorComplement}
				/>
			</div>
			<div
				style={{
					width: `${width}%`,
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					height: '100%',
				}}
			>
				<ConcentricCircles {...props} />
				<ConcentricCircles {...props} />
				<ConcentricCircles {...props} />
			</div>
			<div
				style={{
					width: '100%',
					display: 'flex',
					gap: '100px',
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100%',
				}}
			>
				<ConcentricCircles
					primaryColor={primaryColorComplement}
					secondaryColor={secondaryColorComplement}
				/>
			</div>
		</div>
	);
};

const ConcentricCircles: FC<
	z.infer<typeof WavyTextPlaygroundSchema>['playground']
> = ({primaryColor, secondaryColor}) => {
	const frame = useCurrentFrame();
	const {h, s, l} = hexToHsl(primaryColor);
	const circles = [1, 2, 3];
	return (
		<div
			style={{
				flex: 1,
				aspectRatio: '1/1',
				minWidth: '580px',
				maxWidth: '580px',
				backgroundColor: secondaryColor,
				justifyContent: 'center',
				position: 'relative',
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: '100%',
					height: '100%',
				}}
			>
				{circles.map((circle, index) => {
					const width = interpolate(
						frame - index * 7,
						[0, 60],
						[25, 90 - index * 20],
						{
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
							easing: Easing.bezier(0.34, 1.56, 0.64, 1),
						}
					);

					return (
						<div
							key={index}
							style={{
								position: 'absolute',
								aspectRatio: '1/1',
								width: `${width}%`,
								borderRadius: '50%',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
								backgroundColor: `hsl(${h + 10 * circle}, ${s}%, ${
									l + 10 * index
								}%)`,
							}}
						/>
					);
				})}
			</div>
		</div>
	);
};

export const Playground: React.FC<z.infer<typeof WavyTextPlaygroundSchema>> = (
	props
) => {
	const {primaryColor, secondaryColor} = props.playground;

	return (
		<AbsoluteFill
			style={{
				position: 'relative',
				display: 'block',
				backgroundColor: primaryColor,
			}}
		>
			<Background {...props.playground} />

			<ZoomOut
				style={{
					backgroundColor: primaryColor,
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
				<WavyText {...props.wavyText} fontFamily="SF Pro Rounded" />
			</ZoomOut>
		</AbsoluteFill>
	);
};

export const WavyTextPlayground = () => {
	return (
		<Composition
			id="PlaygroundWavyText"
			component={Playground}
			durationInFrames={150}
			fps={30}
			width={1920}
			height={1080}
			schema={WavyTextPlaygroundSchema}
			defaultProps={{
				playground: {
					primaryColor: '#2f80e9',
					secondaryColor: '#041b2f',
				},
				wavyText: {
					text: 'this is a wavy text animation',
					fontSize: 144,
					fontWeight: '600',
					mass: 1,
					damping: 10,
					stiffness: 100,
				},
			}}
		/>
	);
};
