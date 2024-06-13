import {
	MAX_BRUSH_SIZE,
	MIN_BRUSH_SIZE,
	setBrushOpacity,
	setBrushSize,
	Tool,
} from '@/redux/features/toolSlice';
import Label from './Label';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import NumericInput from '@/app/components/NumericInput';
import React from 'react';

const BrushMenu = () => {
	const dispatch = useDispatch();

	const brushOpacity: number = useAppSelector(
		(state) => state.toolReducer.value.brushOpacity
	);

	const selectedTool: Tool = useAppSelector(
		(state) => state.toolReducer.value.selectedTool
	);
	const brushSize: number = useAppSelector((state) => state.toolReducer.value.brushSize);
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
				<NumericInput
					min={MIN_BRUSH_SIZE}
					max={MAX_BRUSH_SIZE}
					value={brushSize}
					handleChange={(e) => dispatch(setBrushSize(parseInt(e.target.value)))}
					postLabel="px"
				/>
			</div>
			<div className="flex flex-row items-center gap-2">
				<NumericInput
					labelText="Opacity:"
					min={0}
					max={100}
					value={brushOpacity}
					handleChange={(e) => dispatch(setBrushOpacity(parseInt(e.target.value)))}
					postLabel="%"
				/>
			</div>
		</>
	);
};

export default BrushMenu;
