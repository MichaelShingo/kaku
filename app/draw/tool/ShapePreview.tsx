'use client';
import { Coordinate } from '@/redux/features/windowSlice';
import { useAppSelector } from '@/redux/store';
import { ReactNode, useEffect } from 'react';

let initialPosition: Coordinate = { x: Infinity, y: Infinity };
const ShapePreview = () => {
	const isMouseDown = useAppSelector((state) => state.windowReducer.value.isMouseDown);
	const mousePosition: Coordinate = useAppSelector(
		(state) => state.windowReducer.value.mousePosition
	);
	const selectedTool = useAppSelector((state) => state.toolReducer.value.selectedTool);
	const selectedShape = useAppSelector((state) => state.toolReducer.value.selectedShape);
	const selectedColor = useAppSelector((state) => state.toolReducer.value.color);
	const isCursorInCanvas = useAppSelector(
		(state) => state.windowReducer.value.isCursorInCanvas
	);
	const isShapePreviewVisible: boolean =
		isMouseDown && isCursorInCanvas && selectedTool === 'shape';

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

		const mousePositionXDiff = mousePosition.x - initialPosition.x;
		const mousePositionYDiff = mousePosition.y - initialPosition.y;
		const width: number =
			mousePositionXDiff < 0 ? initialPosition.x - mousePosition.x : mousePositionXDiff;
		const height: number =
			mousePositionYDiff < 0 ? initialPosition.y - mousePosition.y : mousePositionYDiff;

		if (selectedShape === 'rectangle' || selectedShape === 'circle') {
			return (
				<div
					className="pointer-events-none fixed z-50"
					style={{
						left: `${
							mousePositionXDiff < 0 ? mousePosition.x + 2.4 : initialPosition.x + 2.4
						}px`,
						top: `${
							mousePositionYDiff < 0 ? mousePosition.y + 2.6 : initialPosition.y + 2.6
						}px`,
						width: `${width}px`,
						height: `${height}px`,
						borderRadius: selectedShape === 'circle' ? '100%' : '0%',
						backgroundColor: selectedColor,
					}}
				></div>
			);
		} else if (selectedShape === 'triangle') {
			return (
				<div
					className="pointer-events-none fixed z-50 h-0 w-0 bg-transparent"
					style={{
						left: `${
							mousePositionXDiff < 0 ? mousePosition.x + 2.4 : initialPosition.x + 2.4
						}px`,
						top: `${
							mousePositionYDiff < 0 ? mousePosition.y + 2.6 : initialPosition.y + 2.6
						}px`,
						borderLeft: `${width / 2}px solid transparent`,
						borderRight: `${width / 2}px solid transparent`,
						borderBottom:
							mousePositionYDiff < 0 ? 'none' : `${height}px solid ${selectedColor}`,
						borderTop:
							mousePositionYDiff > 0 ? 'none' : `${height}px solid ${selectedColor}`,
					}}
				></div>
			);
		}
		return <></>;
	};

	return <>{renderPreview()}</>;
};

export default ShapePreview;
