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
	faArrowLeft,
	faArrowRight,
	faSave,
	faFileCirclePlus,
	IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { setColor, setSelectedTool, Tool } from '@/redux/features/toolSlice';

const Toolbar = () => {
	const dispatch = useDispatch();
	const color = useAppSelector((state) => {
		return state.toolReducer.value.color;
	});
	return (
		<div className="absolute left-0 top-0 z-10 flex h-[100vh] w-14 flex-col items-center justify-center overflow-hidden bg-off-black">
			<div className="flex h-[85%] flex-col items-center justify-evenly">
				<ToolButton icon={faPaintBrush} toolName="brush" />
				<ToolButton icon={faShapes} toolName="shape" />
				<ToolButton icon={faEraser} toolName="eraser" />
				<ToolButton icon={faHand} toolName="hand" />
				<ToolButton icon={faMagnifyingGlassPlus} toolName="zoomIn" />
				<ToolButton icon={faMagnifyingGlassMinus} toolName="zoomOut" />
				<div id="separator" className="h-[1px] w-[60%] bg-slate-600"></div>
				<FunctionButton icon={faArrowLeft} />
				<FunctionButton icon={faArrowRight} />
				<FunctionButton icon={faSave} />
				<FunctionButton icon={faFileCirclePlus} />
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
	const dispatch = useDispatch();
	const isActive: boolean = toolName === selectedTool;

	return (
		<button
			className="h-12 w-16 hover:cursor-pointer"
			style={{ backgroundColor: isActive ? 'black' : 'transparent' }}
			onClick={() => dispatch(setSelectedTool(toolName))}
		>
			<FontAwesomeIcon icon={icon} color={isActive ? '#01baef' : '#fffffc'} />
		</button>
	);
};

type FunctionButtonProps = {
	icon: IconDefinition;
};
const FunctionButton: React.FC<FunctionButtonProps> = ({ icon }) => {
	return (
		<button className="h-7 w-7 hover:cursor-pointer">
			<FontAwesomeIcon icon={icon} color="#fffffc" />
		</button>
	);
};

export default Toolbar;
