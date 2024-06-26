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
	faPenToSquare,
	faArrowUpFromBracket,
	IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { setColor, setSelectedTool, Tool } from '@/redux/features/toolSlice';
import { setIsModalOpen, setModalContent } from '@/redux/features/windowSlice';
import { COLORS } from '@/app/utils/colors';
import useActions from '@/app/customHooks/useActions';
import { ChangeEvent } from 'react';

const Toolbar = () => {
	const dispatch = useDispatch();
	const { undo, redo } = useActions();
	const color = useAppSelector((state) => {
		return state.toolReducer.value.color;
	});

	const save = () => {
		dispatch(setIsModalOpen(true));
		dispatch(setModalContent('Save'));
	};

	const editCanvas = () => {
		dispatch(setIsModalOpen(true));
		dispatch(setModalContent('Edit Canvas'));
	};

	const upload = () => {
		dispatch(setIsModalOpen(true));
		dispatch(setModalContent('Upload'));
	};

	return (
		<div
			className="fixed left-0 top-0 z-20 flex h-[100vh] w-14 flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-slate-600 to-off-black shadow-md shadow-black"
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
				<FunctionButton icon={faPenToSquare} handleClick={editCanvas} />
				<FunctionButton icon={faArrowUpFromBracket} handleClick={upload} />

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

	return (
		<button
			className="h-12 w-16 transition-all duration-300"
			style={{
				backgroundColor: isActive ? 'transparent' : 'transparent',
				cursor: isDisabled ? 'auto' : 'pointer',
			}}
			onClick={() => {
				isDisabled ? () => {} : dispatch(setSelectedTool(toolName));
			}}
		>
			<FontAwesomeIcon
				className="bg-none transition-all hover:opacity-70"
				icon={icon}
				color="white"
				size={isActive ? 'lg' : '1x'}
			/>
			<div
				className="absolute -z-10 h-12 w-[150%] -translate-y-[75%] bg-gradient-to-br from-light-pink to-light-blue transition duration-300"
				style={{
					opacity: isActive ? '100%' : '0%',
					boxShadow: 'inset 0 2px 3px 0px rgb(0 0 0 / 0.8)',
				}}
			></div>
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
