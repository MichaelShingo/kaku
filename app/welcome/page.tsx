'use client';
import { CanvasSize, setCanvasSize } from '@/redux/features/windowSlice';
import { useAppSelector } from '@/redux/store';
import Link from 'next/link';
import { useDispatch } from 'react-redux';

const Welcome = () => {
	const dispatch = useDispatch();
	const canvasSize: CanvasSize = useAppSelector(
		(state) => state.windowReducer.value.canvasSize
	);

	const handleClick = () => {};

	return (
		<div className="flex h-[100vh] w-[100%] items-center justify-center bg-off-white text-off-white">
			<div className="flex h-[85vh] w-[85vw] flex-col items-center justify-center gap-3 bg-[url('/nonagon.svg')] bg-center bg-no-repeat">
				<h1 className="text-center text-7xl text-light-blue">Welcome</h1>
				<h2 className="z-10 mb-9 text-center text-2xl">Choose a canvas size (WxH):</h2>
				<input
					className="m-[-20px] w-[80%] border-off-white p-[-50px] text-center text-8xl"
					min={1}
					max={10000}
					type="number"
					value={canvasSize.x}
					onChange={(e) =>
						dispatch(setCanvasSize({ ...canvasSize, x: parseInt(e.target.value) }))
					}
				/>
				<input
					className="w-[80%] text-center text-8xl"
					min={1}
					max={4000}
					type="number"
					value={canvasSize.y}
					onChange={(e) =>
						dispatch(setCanvasSize({ ...canvasSize, y: parseInt(e.target.value) }))
					}
				/>
				<Link href="/draw">
					<button
						className="fit-content mt-16 bg-off-white p-3 text-4xl text-light-pink hover:bg-light-pink hover:text-off-black"
						onClick={handleClick}
					>
						Create
					</button>
				</Link>
			</div>
		</div>
	);
};

export default Welcome;
