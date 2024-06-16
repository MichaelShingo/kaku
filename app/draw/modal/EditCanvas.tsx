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
	const [canvasWidth, setCanvasWidth] = useState<string>(canvasSize.x.toString());
	const [canvasHeight, setCanvasHeight] = useState<string>(canvasSize.y.toString());
	const [widthError, setWidthError] = useState<boolean>(false);
	const [heightError, setHeightError] = useState<boolean>(false);
	const dispatch = useDispatch();

	const resizeCanvas = () => {
		if (widthError || heightError) {
			return;
		}
		setWidthError(false);
		setHeightError(false);
		const canvas: HTMLCanvasElement = document.getElementById(
			'canvas'
		) as HTMLCanvasElement;
		localStorage.setItem('canvasWidth', canvasWidth.toString());
		localStorage.setItem('canvasHeight', canvasHeight.toString());
		const canvasWidthNum = parseInt(canvasWidth);
		const canvasHeightNum = parseInt(canvasHeight);
		canvas.width = canvasWidthNum;
		canvas.height = canvasHeightNum;
		dispatch(setCanvasSize({ x: canvasWidthNum, y: canvasHeightNum }));
		loadLocalStorageImage();
	};

	const clearCanvas = () => {
		const ctx: CanvasRenderingContext2D = getCanvasContext();
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvasSize.x, canvasSize.y);
	};

	return (
		<div className="flex flex-col items-center gap-5">
			<NumericInput
				labelText="Width:"
				postLabel="px"
				min={0}
				max={9999}
				value={canvasWidth}
				handleChange={(e) => {
					const val = e.target.value;
					setCanvasWidth(val);
					val === '' || val === '0' ? setWidthError(true) : setWidthError(false);
				}}
				error={widthError}
			/>
			<NumericInput
				labelText="Height:"
				postLabel="px"
				min={0}
				max={5000}
				value={canvasHeight}
				handleChange={(e) => {
					const val = e.target.value;
					setCanvasHeight(val);
					val === '' || val === '0' ? setHeightError(true) : setHeightError(false);
				}}
				error={heightError}
			/>
			<div className="flex flex-row gap-7">
				<MainActionButton
					label="Clear Canvas"
					isActive={true}
					handleClick={clearCanvas}
				/>
				<MainActionButton
					label="Resize Canvas"
					isActive={!(widthError || heightError) ? true : false}
					handleClick={resizeCanvas}
				/>
			</div>
		</div>
	);
};

export default EditCanvas;