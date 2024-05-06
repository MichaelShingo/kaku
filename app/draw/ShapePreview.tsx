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
					className="absolute border-2 border-black bg-transparent z-50"
					style={{
						left: `${initialPosition.x}px`,
						top: `${initialPosition.y}px`,
						width: `${mousePosition.x - initialPosition.x}px`,
						height: `${mousePosition.y - initialPosition.y}px`,
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
