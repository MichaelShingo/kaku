import Canvas from './Canvas';
import KeyboardEvents from '../components/eventListeners/KeyboardEvents';

export default function Home() {
	return (
		<div>
			<Canvas />
			<KeyboardEvents />
		</div>
	);
}
