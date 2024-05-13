import { COLORS } from '@/app/utils/colors';
import { setSelectedShape, Shape } from '@/redux/features/toolSlice';
import { useAppSelector } from '@/redux/store';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';

interface ContextualButtonProps {
	shapeName: Shape;
	icon: IconDefinition;
}

const ContextualButton: React.FC<ContextualButtonProps> = ({ shapeName, icon }) => {
	const selectedShape = useAppSelector((state) => state.toolReducer.value.selectedShape);
	const dispatch = useDispatch();
	const isActive: boolean = shapeName === selectedShape;

	return (
		<button
			className="h-10 w-10 hover:cursor-pointer"
			onClick={() => {
				dispatch(setSelectedShape(shapeName));
			}}
		>
			<FontAwesomeIcon
				size="lg"
				icon={icon}
				color={isActive ? COLORS['light-pink'] : COLORS['off-black']}
			/>
		</button>
	);
};

export default ContextualButton;
