'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';
import {
	faEraser,
	faHand,
	faShapes,
	faPaintBrush,
	faMagnifyingGlassPlus,
	faMagnifyingGlassMinus,
	faMusic,
	faArrowLeft,
	faArrowRight,
	faSave,
	faFileCirclePlus,
	IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { setColor, setSelectedTool, Tool } from '@/redux/features/toolSlice';
import { getCanvasContext } from '../../utils/canvasContext';
import {
	setCurrentHistoryIndex,
	setIsModalOpen,
	setModalContent,
} from '@/redux/features/windowSlice';
import { COLORS } from '@/app/utils/colors';
import { setIsAudioReady } from '@/redux/features/audioSlice';

const Toolbar = () => {
	const dispatch = useDispatch();

	const color = useAppSelector((state) => {
		return state.toolReducer.value.color;
	});
	const canvasHistory: string[] = useAppSelector(
		(state) => state.windowReducer.value.canvasHistory
	);
	const currentHistoryIndex: number = useAppSelector(
		(state) => state.windowReducer.value.currentHistoryIndex
	);

	const undo = () => {
		if (currentHistoryIndex === 0) {
			return;
		}
		dispatch(setIsAudioReady(false));
		const ctx: CanvasRenderingContext2D = getCanvasContext();
		const canvasImage: HTMLImageElement = new Image();
		canvasImage.src = canvasHistory[currentHistoryIndex - 1];
		canvasImage.onload = () => {
			ctx.drawImage(canvasImage, 0, 0);
		};
		dispatch(setCurrentHistoryIndex(currentHistoryIndex - 1));
	};

	const redo = () => {
		if (currentHistoryIndex >= canvasHistory.length - 1) {
			return;
		}
		dispatch(setIsAudioReady(false));
		const ctx: CanvasRenderingContext2D = getCanvasContext();
		const canvasImage: HTMLImageElement = new Image();
		canvasImage.src = canvasHistory[currentHistoryIndex + 1];
		canvasImage.onload = () => {
			ctx.drawImage(canvasImage, 0, 0);
		};
		dispatch(setCurrentHistoryIndex(currentHistoryIndex + 1));
	};

	const save = () => {
		dispatch(setIsModalOpen(true));
		dispatch(setModalContent('save'));
	};

	const createNewFile = () => {
		console.log('new file');
	};

	return (
		<div
			className="absolute left-0 top-0 z-10 flex h-[100vh] w-14 flex-col items-center justify-center overflow-hidden bg-off-black"
			onClick={(e) => e.stopPropagation()}
		>
			<div className="flex h-[85%] flex-col items-center justify-evenly">
				<ToolButton icon={faPaintBrush} toolName="brush" />
				<ToolButton icon={faShapes} toolName="shape" />
				<ToolButton icon={faEraser} toolName="eraser" />
				<ToolButton icon={faHand} toolName="hand" />
				<ToolButton icon={faMagnifyingGlassPlus} toolName="zoomIn" />
				<ToolButton icon={faMagnifyingGlassMinus} toolName="zoomOut" />
				<ToolButton icon={faMusic} toolName="music" />
				<div id="separator" className="h-[1px] w-[60%] bg-slate-600"></div>
				<FunctionButton id="undo" icon={faArrowLeft} handleClick={undo} />
				<FunctionButton id="redo" icon={faArrowRight} handleClick={redo} />
				<FunctionButton icon={faSave} handleClick={save} />
				<FunctionButton icon={faFileCirclePlus} handleClick={createNewFile} />
				<input
					className="h-11 w-11"
					type="color"
					value={color}
					onChange={(e) => {
						dispatch(setColor(e.target.value));
					}}
				/>
			</div>
		</div>
	);
};

type ToolButtonProps = {
	toolName: Tool;
	icon: IconDefinition;
};

const ToolButton: React.FC<ToolButtonProps> = ({ toolName, icon }) => {
	const selectedTool = useAppSelector((state) => state.toolReducer.value.selectedTool);
	const isLoading = useAppSelector((state) => state.audioReducer.value.isLoading);
	const isPlaying = useAppSelector((state) => state.audioReducer.value.isPlaying);

	const dispatch = useDispatch();
	const isActive: boolean = toolName === selectedTool;
	const isDisabled = isLoading || isPlaying;

	const generateIconColor = (): string => {
		if (isActive) {
			return COLORS['light-blue'];
		}
		if (isDisabled) {
			return COLORS['light-grey'];
		} else {
			return COLORS['off-white'];
		}
	};

	return (
		<button
			className="h-12 w-16"
			style={{
				backgroundColor: isActive ? 'black' : 'transparent',
				cursor: isDisabled ? 'auto' : 'pointer',
			}}
			onClick={() => {
				isDisabled ? () => {} : dispatch(setSelectedTool(toolName));
			}}
		>
			<FontAwesomeIcon icon={icon} color={generateIconColor()} />
		</button>
	);
};

type FunctionButtonProps = {
	id?: string;
	icon: IconDefinition;
	handleClick: () => void;
};
const FunctionButton: React.FC<FunctionButtonProps> = ({ id, icon, handleClick }) => {
	const isLoading = useAppSelector((state) => state.audioReducer.value.isLoading);
	const isPlaying = useAppSelector((state) => state.audioReducer.value.isPlaying);

	const isDisabled = isLoading || isPlaying;
	return (
		<button
			id={id}
			className="h-7 w-7"
			style={{
				cursor: isDisabled ? 'default' : 'pointer',
			}}
			onClick={() => {
				isDisabled ? () => {} : handleClick();
			}}
		>
			<FontAwesomeIcon
				icon={icon}
				color={isDisabled ? COLORS['light-grey'] : COLORS['off-white']}
			/>
		</button>
	);
};

export default Toolbar;
