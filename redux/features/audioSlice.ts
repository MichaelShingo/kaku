import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
	value: AudioState;
};

type AudioState = {
	isPlaying: boolean;
	volume: number;
	tempo: number;
	seconds: number;
	isMidiScheduled: boolean;
	isMidiUpdated: boolean;
};

const initialState = {
	value: {
		isPlaying: false,
		volume: 100,
		tempo: 100,
		seconds: 0,
		isMidiScheduled: false,
		isMidiUpdated: false,
	} as AudioState,
} as InitialState;

export const audio = createSlice({
	name: 'audio',
	initialState: initialState,
	reducers: {
		setIsPlaying: (state, action: PayloadAction<boolean>) => {
			state.value.isPlaying = action.payload;
		},
		setVolume: (state, action: PayloadAction<number>) => {
			state.value.volume = action.payload;
		},
		setTempo: (state, action: PayloadAction<number>) => {
			state.value.tempo = action.payload;
		},
		setSeconds: (state, action: PayloadAction<number>) => {
			state.value.seconds = action.payload;
		},
		setIsMidiScheduled: (state, action: PayloadAction<boolean>) => {
			state.value.isMidiScheduled = action.payload;
		},
		setIsMidiUpdated: (state, action: PayloadAction<boolean>) => {
			state.value.isMidiUpdated = action.payload;
		},
	},
});

export const {
	setIsPlaying,
	setVolume,
	setTempo,
	setSeconds,
	setIsMidiScheduled,
	setIsMidiUpdated,
} = audio.actions;
export default audio.reducer;
