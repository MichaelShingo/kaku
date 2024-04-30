import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type MousePosition = {
	x: number;
	y: number;
};
export type CanvasSize = {
	x: number;
	y: number;
};
type InitialState = {
	value: WindowState;
};

type WindowState = {
	windowHeight: number;
	windowWidth: number;
	mousePosition: MousePosition;
	isDragging: boolean;
	canvasSize: CanvasSize;
};

const initialState = {
	value: {
		windowHeight: 0,
		windowWidth: 0,
		mousePosition: { x: 0, y: 0 },
		isDragging: false,
		canvasSize: { x: 0, y: 0 },
	} as WindowState,
} as InitialState;

export const window = createSlice({
	name: 'window',
	initialState: initialState,
	reducers: {
		setHeight: (state, action: PayloadAction<number>) => {
			state.value.windowHeight = action.payload;
		},
		setWidth: (state, action: PayloadAction<number>) => {
			state.value.windowWidth = action.payload;
		},
		setMousePosition: (state, action: PayloadAction<MousePosition>) => {
			state.value.mousePosition = action.payload;
		},
		setIsDragging: (state, action: PayloadAction<boolean>) => {
			state.value.isDragging = action.payload;
		},
		setCanvasSize: (state, action: PayloadAction<CanvasSize>) => {
			state.value.canvasSize = action.payload;
		},
	},
});

export const { setHeight, setWidth, setMousePosition, setIsDragging, setCanvasSize } =
	window.actions;
export default window.reducer;
