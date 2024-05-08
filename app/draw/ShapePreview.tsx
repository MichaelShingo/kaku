'use client';
import { MousePosition } from '@/redux/features/windowSlice';
import { useAppSelector } from '@/redux/store';
import { ReactNode, useEffect } from 'react';

let initialPosition: MousePosition = { x: Infinity, y: Infinity };
const ShapePreview = () => {
	const isMouseDown = useAppSelector((state) => state.windowReducer.value.isMouseDown);
	const mousePosition: MousePosition = useAppSelector(
		(state) => state.windowReducer.value.mousePosition
	);
	const selectedTool = useAppSelector((state) => state.toolReducer.value.selectedTool);
	const selectedShape = useAppSelector((state) => state.toolReducer.value.selectedShape);
	const selectedColor = useAppSelector((state) => state.toolReducer.value.color);
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

	const renderPreview = (): ReactNode => {
		if (!isShapePreviewVisible) {
			return <></>;
		}
		if (selectedShape === 'rectangle' || selectedShape === 'circle') {
			return (
				<div
					className="absolute z-50 pointer-events-none"
					style={{
						left: `${initialPosition.x + 2.4}px`,
						top: `${initialPosition.y + 2.6}px`,
						width: `${mousePosition.x - initialPosition.x}px`,
						height: `${mousePosition.y - initialPosition.y}px`,
						borderRadius: selectedShape === 'circle' ? '100%' : '0%',
						backgroundColor: selectedColor,
					}}
				></div>
			);
		} else if (selectedShape === 'triangle') {
			return (
				<div
					className="absolute z-50 w-0 h-0 bg-transparent pointer-events-none"
					style={{
						left: `${initialPosition.x + 2.4}px`,
						top: `${initialPosition.y + 2.6}px`,
						borderLeft: `${
							(mousePosition.x - initialPosition.x) / 2
						}px solid transparent`,
						borderRight: `${
							(mousePosition.x - initialPosition.x) / 2
						}px solid transparent`,
						borderBottom: `${
							mousePosition.y - initialPosition.y
						}px solid ${selectedColor}`,
					}}
				></div>
			);
		}
		return <></>;
	};

	return <>{renderPreview()}</>;
};

export default ShapePreview;
