import Canvas from './Canvas';
import KeyboardEvents from '../components/eventListeners/KeyboardEvents';
import Toolbar from './Toolbar';
import Playbar from './Playbar';
import ToolCursor from './ToolCursor';
import MouseEvents from '../components/eventListeners/MouseEvents';

export default function Home() {
	return (
		<div className="h-[100vh] overflow-hidden">
			<ToolCursor />
			<Toolbar />
			<Playbar />
			<Canvas />
			<KeyboardEvents />
			<MouseEvents />
		</div>
	);
}
