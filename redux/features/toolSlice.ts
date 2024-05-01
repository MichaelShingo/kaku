import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
	value: ToolState;
};

export type Tool = 'brush' | 'gradient' | 'shape' | 'color picker' | 'eraser' | 'move';

type ToolState = {
	brushSize: number;
	color: string;
	selectedTool: Tool;
};

const initialState = {
	value: {
		brushSize: 1,
		color: '#000000',
		selectedTool: 'move',
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
			state.value.brushSize++;
		},
		decrementBrushSize: (state) => {
			state.value.brushSize--;
		},
		setColor: (state, action: PayloadAction<string>) => {
			state.value.color = action.payload;
		},
		setSelectedTool: (state, action: PayloadAction<Tool>) => {
			state.value.selectedTool = action.payload;
		},
	},
});

export const {
	setBrushSize,
	setColor,
	setSelectedTool,
	incrementBrushSize,
	decrementBrushSize,
} = tool.actions;
export default tool.reducer;
