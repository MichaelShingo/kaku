import Canvas from './Canvas';
import KeyboardEvents from '../components/eventListeners/KeyboardEvents';
import Toolbar from './tool/Toolbar';
import ToolCursor from './tool/ToolCursor';
import MouseEvents from '../components/eventListeners/MouseEvents';
import ShapePreview from './tool/ShapePreview';
import ContextualMenu from './contextualMenu/ContextualMenu';

export default function Home() {
	return (
		<div className="h-[100vh] overflow-hidden">
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
