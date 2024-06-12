'use client';
import { useAppSelector } from '@/redux/store';
import { ReactNode } from 'react';
import MusicMenu from './MusicMenu';
import BrushMenu from './BrushMenu';
import ShapeMenu from './ShapeMenu';
import { Tool } from '@/redux/features/toolSlice';

const ContextualMenu = () => {
	const selectedTool: Tool = useAppSelector(
		(state) => state.toolReducer.value.selectedTool
	);

	const renderButtons = (): ReactNode => {
		switch (selectedTool) {
			case 'brush':
			case 'eraser':
				return <BrushMenu />;
			case 'shape':
				return <ShapeMenu />;
			case 'music':
				return <MusicMenu />;
			default:
				return <></>;
		}
	};

	return (
		<div className="absolute left-0 top-0 z-10 flex h-14 w-[100vw] flex-col items-center justify-center overflow-hidden bg-transparent shadow-md shadow-black-trans">
			<div className="justify-left flex w-[85%] flex-row items-center gap-5">
				{renderButtons()}
			</div>
			<div className="absolute -z-10 h-full w-full bg-gradient-to-r from-light-pink to-light-blue opacity-20"></div>
		</div>
	);
};

export default ContextualMenu;
