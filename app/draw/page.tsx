import Canvas from './Canvas';
import KeyboardEvents from '../components/eventListeners/KeyboardEvents';
import Toolbar from './Toolbar';
import Playbar from './Playbar';

export default function Home() {
	return (
		<div>
			<Toolbar />
			<Playbar />
			<Canvas />
			<KeyboardEvents />
		</div>
	);
}
