'use client';
import MainActionButton from '@/app/components/MainActionButton';
import NumericInput from '@/app/components/NumericInput';
import { getCanvasContext, loadLocalStorageImage } from '@/app/utils/canvasContext';
import { Coordinate, setCanvasSize } from '@/redux/features/windowSlice';
import { useAppSelector } from '@/redux/store';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

const EditCanvas = () => {
	const canvasSize: Coordinate = useAppSelector(
		(state) => state.windowReducer.value.canvasSize
	);
	const [canvasWidth, setCanvasWidth] = useState<number>(canvasSize.x);
	const [canvasHeight, setCanvasHeight] = useState<number>(canvasSize.y);

	const dispatch = useDispatch();

	const resizeCanvas = () => {
		const canvas: HTMLCanvasElement = document.getElementById(
			'canvas'
		) as HTMLCanvasElement;
		localStorage.setItem('canvasWidth', canvasWidth.toString());
		localStorage.setItem('canvasHeight', canvasHeight.toString());
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		loadLocalStorageImage();
		dispatch(setCanvasSize({ x: canvasWidth, y: canvasHeight }));
	};

	const clearCanvas = () => {
		const ctx: CanvasRenderingContext2D = getCanvasContext();
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvasSize.x, canvasSize.y);
	};

	return (
		<div className="flex flex-col items-center gap-5">
			<NumericInput
				labelText="Canvas Width:"
				postLabel="px"
				min={0}
				max={10000}
				value={canvasWidth}
				handleChange={(e) =>
					e.target.value ? setCanvasWidth(parseInt(e.target.value)) : () => {}
				}
			/>
			<NumericInput
				labelText="Canvas Height:"
				postLabel="px"
				min={0}
				max={5000}
				value={canvasHeight}
				handleChange={(e) =>
					e.target.value ? setCanvasHeight(parseInt(e.target.value)) : () => {}
				}
			/>
			<div className="flex flex-row gap-7">
				<MainActionButton
					label="Clear Canvas"
					isActive={true}
					handleClick={clearCanvas}
				/>
				<MainActionButton
					label="Resize Canvas"
					isActive={true}
					handleClick={resizeCanvas}
				/>
			</div>
		</div>
	);
};

export default EditCanvas;
