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
import { setColor } from '@/redux/features/toolSlice';

const iconList: IconDefinition[] = [
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
];

const Toolbar = () => {
	const dispatch = useDispatch();
	const [color] = useAppSelector((state) => {
		return [state.toolReducer.value.color];
	});
	return (
		<div className="absolute left-0 top-0 z-10 flex h-[100vh] w-14 flex-col items-center justify-center bg-off-black">
			<div className="flex h-[85%] flex-col items-center justify-evenly">
				{iconList.map((icon, index) => (
					<ToolButton key={index} icon={icon} isActive={false} />
				))}
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
	isActive: boolean;
	icon: IconDefinition;
};

const ToolButton: React.FC<ToolButtonProps> = ({ isActive, icon }) => {
	return (
		<button className="h-7 w-7 hover:cursor-pointer">
			<FontAwesomeIcon icon={icon} color="#fffffc" shake={true} />
		</button>
	);
};

export default Toolbar;
