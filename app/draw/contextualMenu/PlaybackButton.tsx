import { COLORS } from '@/app/utils/colors';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface PlaybackButtonProps {
	isActive: boolean;
	icon: IconDefinition;
	handleClick: () => void;
}
const PlaybackButton: React.FC<PlaybackButtonProps> = ({
	isActive,
	icon,
	handleClick,
}) => {
	return (
		<>
			<button
				className="h-10 w-10"
				onClick={() => {
					isActive ? handleClick() : () => {};
				}}
				style={{ cursor: isActive ? 'pointer' : 'auto' }}
			>
				<FontAwesomeIcon
					size="lg"
					icon={icon}
					color={isActive ? COLORS['light-pink'] : 'grey'}
				/>
			</button>
		</>
	);
};

export default PlaybackButton;
