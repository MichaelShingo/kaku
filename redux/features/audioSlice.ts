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
	isLoading: boolean;
	loadingMessage: string;
	isAudioReady: boolean;
	isRecording: boolean;
	blobString: string | null;
};

const initialState = {
	value: {
		isPlaying: false,
		volume: 100,
		tempo: 100,
		seconds: 0,
		isMidiScheduled: false,
		isMidiUpdated: false,
		isLoading: false,
		loadingMessage: '',
		isAudioReady: false,
		isRecording: false,
		blobString: null,
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
		setIsLoading: (state, action: PayloadAction<boolean>) => {
			state.value.isLoading = action.payload;
		},
		setLoadingMessage: (state, action: PayloadAction<string>) => {
			state.value.loadingMessage = action.payload;
		},
		setIsAudioReady: (state, action: PayloadAction<boolean>) => {
			state.value.isAudioReady = action.payload;
		},

		setIsRecording: (state, action: PayloadAction<boolean>) => {
			state.value.isRecording = action.payload;
		},
		setBlobString: (state, action: PayloadAction<string>) => {
			state.value.blobString = action.payload;
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
	setIsLoading,
	setLoadingMessage,
	setIsAudioReady,
	setIsRecording,
	setBlobString,
} = audio.actions;
export default audio.reducer;
