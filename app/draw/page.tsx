import Canvas from './Canvas';
import KeyboardEvents from '../components/eventListeners/KeyboardEvents';
import Toolbar from './Toolbar';
import Playbar from './Playbar';
import Brush from './Brush';

export default function Home() {
	return (
		<div className="h-[100vh]">
			<Brush />
			<Toolbar />
			<Playbar />
			<Canvas />
			<KeyboardEvents />
		</div>
	);
}
