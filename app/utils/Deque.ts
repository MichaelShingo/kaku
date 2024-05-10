import { Coordinate } from '@/redux/features/windowSlice';

type DequeItem = Coordinate;

export class Deque {
	items: DequeItem[];
	constructor() {
		this.items = [];
	}

	// Add an element to the front of the deque
	pushRight(element: DequeItem) {
		this.items.unshift(element);
	}

	// Add an element to the back of the deque
	pushLeft(element: DequeItem) {
		this.items.push(element);
	}

	// Remove and return the element from the front of the deque
	popLeft() {
		if (this.isEmpty()) {
			return 'Underflow';
		}
		return this.items.shift();
	}

	// Remove and return the element from the back of the deque
	popRight() {
		if (this.isEmpty()) {
			return 'Underflow';
		}
		return this.items.pop();
	}

	// Return the element at the front of the deque without removing it
	peekFront() {
		if (this.isEmpty()) {
			return 'No elements in the deque';
		}
		return this.items[0];
	}

	// Return the element at the back of the deque without removing it
	peekBack() {
		if (this.isEmpty()) {
			return 'No elements in the deque';
		}
		return this.items[this.items.length - 1];
	}

	// Check if the deque is empty
	isEmpty() {
		return this.items.length === 0;
	}

	// Return the size of the deque
	size() {
		return this.items.length;
	}

	// Clear the deque
	clear() {
		this.items = [];
	}

	// Print the deque
	print() {
		console.log(this.items.toString());
	}
}
