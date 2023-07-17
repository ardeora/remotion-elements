import {continueRender} from 'remotion';
import {delayRender} from 'remotion';
import React, {FC, useEffect, useRef} from 'react';
import {
	AbsoluteFill,
	Composition,
	Easing,
	interpolate,
	random,
	Sequence,
	staticFile,
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
import * as THREE from 'three';
import './styles/playground.css';
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
let camera: THREE.OrthographicCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let uniforms: {
	time: {value: number};
	uTexture: THREE.Uniform<THREE.Texture>;
};

const setup = (container: HTMLDivElement) => {
	camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
	scene = new THREE.Scene();
	const texture = new THREE.TextureLoader().load(
		staticFile('displacement1.jpg')
	);
	const geometry = new THREE.PlaneGeometry(2, 2);
	uniforms = {
		time: {value: 1.0},
		uTexture: new THREE.Uniform(texture),
	};
	const material = new THREE.ShaderMaterial({
		uniforms,
		vertexShader: `
			varying vec2 vUv;
			void main() {
				gl_Position = vec4( position, 1.0 );
				vUv = uv;
			}
		`,
		fragmentShader: `
			varying vec2 vUv;
			uniform float time;

			void main()	{

				vec2 uv = vUv * 2.0 - 1.0; 
				
				gl_FragColor = vec4(uv, 0.0, 1.0);

			}
		`,
	});
	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(900, 900);
	renderer.useLegacyLights = false;
	container.appendChild(renderer.domElement);
};

export const Playground: React.FC = () => {
	const frame = useCurrentFrame();

	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!ref.current) return;
		setup(ref.current);
	}, []);

	useEffect(() => {
		uniforms.time.value = frame * 0.03;
		renderer.render(scene, camera);
	}, [frame]);

	const scaleUp = interpolate(
		frame,
		Array.from({length: 13}, (_, i) => i * 150),
		Array.from({length: 13}, (_, i) => (i % 2 ? 1.1 : 1.0)),
		{}
	);

	const inhaleWeight = interpolate(
		frame,
		Array.from({length: 13}, (_, i) => i * 150),
		Array.from({length: 13}, (_, i) => (i % 2 ? 120 : 20)),
		{}
	);
	const inhaleOpacity = interpolate(
		frame,
		Array.from({length: 13}, (_, i) => i * 150),
		Array.from({length: 13}, (_, i) => (i % 2 ? 1 : 0.5)),
		{}
	);
	const inhaleScale = interpolate(
		frame,
		Array.from({length: 13}, (_, i) => i * 150),
		Array.from({length: 13}, (_, i) => (i % 2 ? 1.05 : 1)),
		{}
	);

	const exhaleWeight = interpolate(
		frame,
		Array.from({length: 13}, (_, i) => i * 150),
		Array.from({length: 13}, (_, i) => (i % 2 ? 20 : 120)),
		{}
	);
	const exhaleOpacity = interpolate(
		frame,
		Array.from({length: 13}, (_, i) => i * 150),
		Array.from({length: 13}, (_, i) => (i % 2 ? 0.5 : 1)),
		{}
	);
	const exhaleScale = interpolate(
		frame,
		Array.from({length: 13}, (_, i) => i * 150),
		Array.from({length: 13}, (_, i) => (i % 2 ? 1 : 1.05)),
		{}
	);

	if (renderer?.domElement) {
		renderer.domElement.style.opacity = '0.8';
		renderer.domElement.style.transform = `scale(${scaleUp})`;
	}

	return (
		<div
			style={{
				flex: 1,
				position: 'relative',
				backgroundColor: '#1d1d23',
			}}
		>
			<div ref={ref} className="gl-container" />
			<section
				style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: '75%',
					color: 'white',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					fontSize: 110,
				}}
			>
				<div
					style={{
						maxWidth: 400,
						textAlign: 'center',
						fontVariationSettings: `"wght" ${inhaleWeight}, "wdth" 120`,
						fontFamily: 'Sprat',
						opacity: inhaleOpacity,
						// Transform: `scale(${inhaleScale})`,
					}}
				>
					Inhale Deeply
				</div>
				<div
					style={{
						maxWidth: 400,
						textAlign: 'center',
						fontVariationSettings: `"wght" ${exhaleWeight}, "wdth" 120`,
						fontFamily: 'Sprat',
						opacity: exhaleOpacity,
						// Transform: `scale(${exhaleScale})`,
					}}
				>
					Exhale Softly
				</div>
			</section>
		</div>
	);
};

export const GLPlayground = () => {
	const waitForFont = delayRender();
	const font = new FontFace(
		`Sprat`,
		`url('${staticFile('sprat.woff2')}') format('woff2')`
	);

	font
		.load()
		.then(() => {
			document.fonts.add(font);
			continueRender(waitForFont);
		})
		.catch((err) => console.log('Error loading font', err));

	return (
		<Composition
			id="PlaygroundGL"
			component={Playground}
			durationInFrames={900}
			fps={30}
			width={1920}
			height={1080}
			// Schema={PullInPlaygroundSchema}
			// defaultProps={{
			// 	playground: {
			// 		primaryColor: '#ff6524',
			// 	},
			// 	pullIn: {
			// 		text: 'Geometry',
			// 		fontSize: 200,
			// 		fontWeight: '700',
			// 		startGap: 100,
			// 		endGap: 0,
			// 	},
			// }}
		/>
	);
};
