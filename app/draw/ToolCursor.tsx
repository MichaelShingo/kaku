'use client';
import React, { ReactNode } from 'react';
import { useAppSelector } from '@/redux/store';
import { MousePosition } from '@/redux/features/windowSlice';
import { Tool } from '@/redux/features/toolSlice';
import {
	faPlus,
	faHand,
	faHandBackFist,
	IconDefinition,
	faMagnifyingGlassPlus,
	faMagnifyingGlassMinus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';

const ToolCursor = () => {
	const mousePosition: MousePosition = useAppSelector(
		(state) => state.windowReducer.value.mousePosition
	);
	const selectedTool: Tool = useAppSelector(
		(state) => state.toolReducer.value.selectedTool
	);
	const isMouseDown: boolean = useAppSelector(
		(state) => state.windowReducer.value.isMouseDown
	);
	const isCursorInCanvas: boolean = useAppSelector(
		(state) => state.windowReducer.value.isCursorInCanvas
	);
	const brushSize: number = useAppSelector((state) => state.toolReducer.value.brushSize);

	const brushSizePx = `${brushSize}px`;

	const renderCursor = (): ReactNode => {
		if (!isCursorInCanvas) {
			return <></>;
		}
		switch (selectedTool) {
			case 'brush':
			case 'eraser':
				return (
					<div
						className="pointer-events-none absolute rounded-full border-2 opacity-50 z-50"
						style={{
							top: `${mousePosition.y}px`,
							left: `${mousePosition.x}px`,
							width: brushSizePx,
							height: brushSizePx,
							transform: `translateX(-50%) translateY(-50%)`,
							borderColor: selectedTool === 'eraser' ? 'red' : 'black',
						}}
					></div>
				);
			case 'shape':
				return <IconCursor icon={faPlus} size={2} />;
			case 'hand':
				return <IconCursor icon={isMouseDown ? faHandBackFist : faHand} size={1} />;
			case 'zoomIn':
				return <IconCursor icon={faMagnifyingGlassPlus} size={2} />;
			case 'zoomOut':
				return <IconCursor icon={faMagnifyingGlassMinus} size={2} />;
			default:
				return <></>;
		}
	};

	return <>{renderCursor()}</>;
};

interface IconCursorProps {
	icon: IconDefinition;
	size: number;
}

const IconCursor: React.FC<IconCursorProps> = ({ icon, size }) => {
	const mousePosition: MousePosition = useAppSelector(
		(state) => state.windowReducer.value.mousePosition
	);

	return (
		<div
			className="pointer-events-none absolute z-50 flex h-14 w-14 items-center justify-center opacity-55"
			style={{
				top: `${mousePosition.y}px`,
				left: `${mousePosition.x}px`,
				transform: `translateX(-50%) translateY(-50%)`,
			}}
		>
			<FontAwesomeIcon icon={icon} size={`${size}x` as SizeProp} />
		</div>
	);
};

export default ToolCursor;
