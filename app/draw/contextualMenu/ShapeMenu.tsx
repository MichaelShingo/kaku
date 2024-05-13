import { faCircle, faPlay, faSquare } from '@fortawesome/free-solid-svg-icons';
import ContextualButton from './ShapeButton';
import Label from './Label';

const ShapeMenu = () => {
	return (
		<>
			<div className="flex flex-row items-center gap-2">
				<Label text="Shape Type:" />
				<ContextualButton shapeName="rectangle" icon={faSquare} />
				<ContextualButton shapeName="circle" icon={faCircle} />
				<div className="-rotate-90">
					<ContextualButton shapeName="triangle" icon={faPlay} />
				</div>
			</div>
		</>
	);
};

export default ShapeMenu;
