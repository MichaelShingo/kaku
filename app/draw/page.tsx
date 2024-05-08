import Canvas from './Canvas';
import KeyboardEvents from '../components/eventListeners/KeyboardEvents';
import Toolbar from './Toolbar';
import Playbar from './Playbar';
import ToolCursor from './ToolCursor';
import MouseEvents from '../components/eventListeners/MouseEvents';
import ShapePreview from './ShapePreview';
import ContextualMenu from './ContextualMenu';

export default function Home() {
	return (
		<div className="h-[100vh] overflow-hidden">
			<ShapePreview />
			<ToolCursor />
			<ContextualMenu />
			<Toolbar />
			<Playbar />
			<Canvas />
			<KeyboardEvents />
			<MouseEvents />
		</div>
	);
}
