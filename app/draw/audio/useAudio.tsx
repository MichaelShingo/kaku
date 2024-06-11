import { Island } from '@/app/utils/pixelAnalysis';
import {
	calcMaxSimultaneousVoices,
	calcPixelsFromSeconds,
	calcSecondsFromPixels,
	doesRangeOverlap,
	hlToFrequency,
	mapRange,
} from '@/app/utils/pixelToAudioConversion';
let gainFunctionRepeaterIds: number[] = [];
import { Coordinate } from '@/redux/features/windowSlice';
import { useAppSelector } from '@/redux/store';
import { useEffect, useState } from 'react';
import * as Tone from 'tone';

const gainNodes: Tone.Gain[] = [];
const synths: Tone.PolySynth[] = [];
const useAudio = () => {
	const canvasSize = useAppSelector((state) => state.windowReducer.value.canvasSize);
	const [recorderDestination, setRecorderDestination] =
		useState<MediaStreamAudioDestinationNode | null>(null);
	// const [synths, setSynths] = useState<Tone.PolySynth[]>([]);
	const [recorder, setRecorder] = useState<MediaRecorder | null>(null);

	useEffect(() => {
		const setup = async () => {
			const context: Tone.BaseContext = Tone.context;
			const recorderDestination: MediaStreamAudioDestinationNode =
				context.createMediaStreamDestination();
			const recorder: MediaRecorder = new MediaRecorder(recorderDestination.stream);
			setRecorderDestination(recorderDestination);
			setRecorder(recorder);
		};

		setup();
	}, []);

	const setupPolySynth = () => {
		if (!recorderDestination) {
			return;
		}
		const polySynth = new Tone.PolySynth().toDestination();
		const gainNode = new Tone.Gain(-0.99).toDestination();
		polySynth.connect(recorderDestination);
		gainNode.connect(recorderDestination);
		polySynth.sync();
		polySynth.connect(gainNode);
		synths.push(polySynth);
		gainNodes.push(gainNode);
	};

	const scheduleMidi = (islands: Island[]): void => {
		gainFunctionRepeaterIds.forEach((id) => {
			Tone.Transport.clear(id);
		});
		gainFunctionRepeaterIds = [];
		const maxSimultaneousVoices: number = calcMaxSimultaneousVoices(islands);
		Tone.Transport.cancel();

		const newSynthCount = maxSimultaneousVoices - synths.length;
		for (let i = 0; i < newSynthCount; i++) {
			setupPolySynth();
		}

		const scheduledRanges: number[][][] = [];
		for (let i = 0; i < maxSimultaneousVoices; i++) {
			scheduledRanges.push([]);
		}

		islands.forEach((island) => {
			const duration = calcSecondsFromPixels(island.maxCol - island.minCol);
			const startTime = calcSecondsFromPixels(island.minCol);
			const frequency = hlToFrequency(island.hsl.h, island.hsl.l);

			let currentSynthIndex = 0;
			let isOverlapping = true;
			const currentRange = [island.minCol, island.maxCol];

			while (isOverlapping && currentSynthIndex < maxSimultaneousVoices) {
				isOverlapping = doesRangeOverlap(
					scheduledRanges[currentSynthIndex],
					currentRange
				);
				if (!isOverlapping) {
					scheduledRanges[currentSynthIndex].push(currentRange);
					island.synthIndex = currentSynthIndex;
					synths[currentSynthIndex].triggerAttackRelease(frequency, duration, startTime);
				}
				currentSynthIndex++;
			}

			const calcGainAtTime = (time: number): void => {
				const pixelX = calcPixelsFromSeconds(time);
				const point1: Coordinate = {
					x: Math.floor(pixelX),
					y: island.colCounts[Math.floor(pixelX)],
				};
				const point2: Coordinate = {
					x: Math.ceil(pixelX),
					y: island.colCounts[Math.ceil(pixelX)],
				};

				const slope = (point2.y - point1.y) / (point2.x - point1.x);
				const estimatedHeightPixels: number =
					slope * pixelX - slope * point1.x + point1.y;
				const gainRange = 1.98 / maxSimultaneousVoices;
				const volume = mapRange(
					estimatedHeightPixels,
					0,
					canvasSize.y,
					-0.99,
					-0.99 + gainRange
				);
				if (volume) {
					gainNodes[island.synthIndex].gain.value = volume;
				}
			};

			const gainFunctionRepeaterId: number = Tone.Transport.scheduleRepeat(
				() => {
					calcGainAtTime(Tone.Transport.seconds);
				},
				0.05,
				startTime,
				duration
			);

			gainFunctionRepeaterIds.push(gainFunctionRepeaterId);
		});
	};
	return { scheduleMidi, synths, recorder, recorderDestination };
};

export default useAudio;
