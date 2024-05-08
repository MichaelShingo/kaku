'use client';
import { MousePosition } from '@/redux/features/windowSlice';
import { useAppSelector } from '@/redux/store';
import { useEffect } from 'react';

let initialPosition: MousePosition = { x: Infinity, y: Infinity };
const ShapePreview = () => {
	const isMouseDown = useAppSelector((state) => state.windowReducer.value.isMouseDown);
	const mousePosition: MousePosition = useAppSelector(
		(state) => state.windowReducer.value.mousePosition
	);
	const selectedTool = useAppSelector((state) => state.toolReducer.value.selectedTool);
	const selectedShape = useAppSelector((state) => state.toolReducer.value.selectedShape);
	const isCursorInCanvas = useAppSelector(
		(state) => state.windowReducer.value.isCursorInCanvas
	);
	const isShapePreviewVisible: boolean =
		isMouseDown &&
		isCursorInCanvas &&
		selectedTool === 'shape' &&
		mousePosition.x - initialPosition.x > 0 &&
		mousePosition.y - initialPosition.y > 0;

	useEffect(() => {
		if (isMouseDown) {
			initialPosition = mousePosition;
		} else {
			initialPosition = { x: Infinity, y: Infinity };
		}
	}, [isMouseDown]);

	return (
		<>
			{isShapePreviewVisible ? (
				<div
					className="absolute z-50 border-2 border-black bg-transparent"
					style={{
						left: `${initialPosition.x}px`,
						top: `${initialPosition.y}px`,
						width: `${mousePosition.x - initialPosition.x}px`,
						height: `${mousePosition.y - initialPosition.y}px`,
						borderRadius: selectedShape === 'circle' ? '100%' : '0%',
					}}
				></div>
			) : (
				<></>
			)}
		</>
	);
};

export default ShapePreview;

// mouse down on canvas with shape tool triggers shapepreview visibility and sets initial position top,left
// update current position to adjust width and height of rectangle
