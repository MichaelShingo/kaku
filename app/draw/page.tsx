import Canvas from '../components/Canvas';
import KeyboardEvents from '../components/eventListeners/KeyboardEvents';

export default function Home() {
	return (
		<div>
			<Canvas />
			<KeyboardEvents />
		</div>
	);
}
