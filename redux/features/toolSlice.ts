import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
	value: ToolState;
};

export const MAX_BRUSH_SIZE = 1000;
export const MIN_BRUSH_SIZE = 1;

export type Tool = 'brush' | 'shape' | 'eraser' | 'hand' | 'zoomIn' | 'zoomOut' | 'music';
export type Shape =
	| 'rectangle'
	| 'circle'
	| 'triangle'
	| 'pentagon'
	| 'hexagon'
	| 'octagon';

type ToolState = {
	brushSize: number;
	color: string;
	selectedTool: Tool;
	selectedShape: Shape;
	brushOpacity: number;
};

const initialState = {
	value: {
		brushSize: 10,
		color: '#000000',
		selectedTool: 'brush',
		selectedShape: 'rectangle',
		brushOpacity: 100,
	} as ToolState,
} as InitialState;

export const tool = createSlice({
	name: 'tool',
	initialState: initialState,
	reducers: {
		setBrushSize: (state, action: PayloadAction<number>) => {
			state.value.brushSize = action.payload;
		},
		incrementBrushSize: (state) => {
			if (state.value.brushSize === MAX_BRUSH_SIZE) {
				return;
			}
			state.value.brushSize++;
		},
		decrementBrushSize: (state) => {
			if (state.value.brushSize === MIN_BRUSH_SIZE) {
				return;
			}
			state.value.brushSize--;
		},
		setColor: (state, action: PayloadAction<string>) => {
			state.value.color = action.payload;
		},
		setSelectedTool: (state, action: PayloadAction<Tool>) => {
			state.value.selectedTool = action.payload;
		},
		setSelectedShape: (state, action: PayloadAction<Shape>) => {
			state.value.selectedShape = action.payload;
		},
		setBrushOpacity: (state, action: PayloadAction<number>) => {
			let val = action.payload > 100 ? 100 : action.payload;
			val = action.payload < 0 ? 0 : val;
			state.value.brushOpacity = val;
		},
	},
});

export const {
	setBrushSize,
	setColor,
	setSelectedTool,
	incrementBrushSize,
	decrementBrushSize,
	setSelectedShape,
	setBrushOpacity,
} = tool.actions;
export default tool.reducer;
