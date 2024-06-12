import Canvas from './Canvas';
import KeyboardEvents from '../components/eventListeners/KeyboardEvents';
import Toolbar from './tool/Toolbar';
import ToolCursor from './tool/ToolCursor';
import MouseEvents from '../components/eventListeners/MouseEvents';
import ShapePreview from './tool/ShapePreview';
import ContextualMenu from './contextualMenu/ContextualMenu';
import Modal from './modal/Modal';

export default function Home() {
	return (
		<div className="h-[100vh] w-[100vw] overflow-scroll bg-[url('/kakuBackdrop.svg')] bg-[size:200%] bg-no-repeat">
			<Modal />
			<ShapePreview />
			<ToolCursor />
			<ContextualMenu />
			<Toolbar />
			<Canvas />
			<KeyboardEvents />
			<MouseEvents />
		</div>
	);
}
