'use client';
import * as Tone from 'tone';
import {
	MAX_BRUSH_SIZE,
	MIN_BRUSH_SIZE,
	setBrushOpacity,
	setBrushSize,
	setSelectedShape,
	Shape,
	Tool,
} from '@/redux/features/toolSlice';
import { faSquare, faCircle, faPlay } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector } from '@/redux/store';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { COLORS } from '../utils/colors';
import { getCanvasContext } from '../utils/canvasContext';
import { generateMusic, Island } from '../utils/pixelAnalysis';
import { calcSecondsFromPixels, hlToFrequency } from '../utils/pixelToAudioConversion';

let polySynth: Tone.PolySynth;

const ContextualMenu = () => {
	const dispatch = useDispatch();
	const canvasSize = useAppSelector((state) => state.windowReducer.value.canvasSize);
	const selectedTool: Tool = useAppSelector(
		(state) => state.toolReducer.value.selectedTool
	);
	const brushOpacity: number = useAppSelector(
		(state) => state.toolReducer.value.brushOpacity
	);
	const brushSize: number = useAppSelector((state) => state.toolReducer.value.brushSize);

	const handleGenerateMusic = (): void => {
		const ctx = getCanvasContext();
		const imageData: ImageData = ctx.getImageData(0, 0, canvasSize.x, canvasSize.y);
		const islands: Island[] = generateMusic(imageData);
		scheduleMidi(islands);
		Tone.Transport.start();
	};

	const scheduleMidi = (islands: Island[]): void => {
		islands.forEach((island) => {
			const duration = calcSecondsFromPixels(island.maxCol - island.minCol);
			if (duration > 0) {
				const frequency = hlToFrequency(island.hsl.h, island.hsl.l);
				const startTime = calcSecondsFromPixels(island.minCol);
				polySynth.triggerAttackRelease(frequency, duration, startTime);
			}
		});
	};

	useEffect(() => {
		polySynth = new Tone.PolySynth(Tone.Synth, {
			envelope: {
				attack: 0.02,
				decay: 0.1,
				sustain: 0.3,
				release: 1,
			},
		}).toDestination();
	}, []);

	const renderButtons = (): ReactNode => {
		switch (selectedTool) {
			case 'brush':
			case 'eraser':
				return (
					<>
						<div className="flex flex-row items-center gap-2">
							<Label text={selectedTool === 'brush' ? 'Brush Size:' : 'Eraser Size:'} />
							<input
								className="h-2 w-24 cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
								type="range"
								min={MIN_BRUSH_SIZE}
								max={MAX_BRUSH_SIZE}
								value={brushSize}
								onChange={(e) => dispatch(setBrushSize(parseInt(e.target.value)))}
							/>
							<input
								className="h-fit w-fit rounded-md border-[2px] border-off-black text-center"
								type="number"
								min={MIN_BRUSH_SIZE}
								max={MAX_BRUSH_SIZE}
								value={brushSize}
								onChange={(e) => dispatch(setBrushSize(parseInt(e.target.value)))}
							/>
							<Label text="px" />
						</div>
						<div className="flex flex-row items-center gap-2">
							<Label text="Opacity:" />
							<input
								className="h-fit w-fit rounded-md border-[2px] border-off-black text-center"
								type="number"
								min="0"
								max="100"
								value={brushOpacity}
								onChange={(e) => dispatch(setBrushOpacity(parseInt(e.target.value)))}
							/>
							<Label text="%" />
						</div>
					</>
				);
			case 'shape':
				return (
					<>
						<div className="flex flex-row items-center gap-2">
							<Label text="Shape Type:" />
							<ContextualButton shapeName="rectangle" icon={faSquare} />
							<ContextualButton shapeName="circle" icon={faCircle} />
							<div className="-rotate-90">
								<ContextualButton shapeName="triangle" icon={faPlay} />
							</div>
						</div>
					</>
				);
			case 'music':
				return (
					<div className="flex flex-row items-center gap-2">
						<button
							className="bg-light-pink p-2 text-off-white transition-all hover:animate-color-shift"
							onClick={handleGenerateMusic}
						>
							Generate Music
						</button>
					</div>
				);

			default:
				return <></>;
		}
	};

	return (
		<div className="absolute left-0 top-0 z-10 flex h-14 w-[100vw] flex-col items-center justify-center overflow-hidden bg-transparent">
			<div className="justify-left flex w-[85%] flex-row items-center gap-5">
				{renderButtons()}
			</div>
		</div>
	);
};

interface LabelProps {
	text: string;
}
const Label: React.FC<LabelProps> = ({ text }) => {
	return (
		<label className="text-base" htmlFor="brush-size">
			{text}
		</label>
	);
};

interface ContextualButtonProps {
	shapeName: Shape;
	icon: IconDefinition;
}

const ContextualButton: React.FC<ContextualButtonProps> = ({ shapeName, icon }) => {
	const selectedShape = useAppSelector((state) => state.toolReducer.value.selectedShape);
	const dispatch = useDispatch();
	const isActive: boolean = shapeName === selectedShape;

	return (
		<button
			className="h-10 w-10 hover:cursor-pointer"
			onClick={() => {
				dispatch(setSelectedShape(shapeName));
			}}
		>
			<FontAwesomeIcon
				size="lg"
				icon={icon}
				color={isActive ? COLORS['light-pink'] : COLORS['off-black']}
			/>
		</button>
	);
};

export default ContextualMenu;
