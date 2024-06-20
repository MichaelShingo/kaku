import { getCanvasContext, setLocalStorageImage } from '@/app/utils/canvasContext';
import { setCanvasSize } from '@/redux/features/windowSlice';
import React, { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';

const UploadModal: React.FC = () => {
	const dispatch = useDispatch();

	const [placement, setPlacement] = useState<string>('place-existing');

	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		console.log('file was uploaded');
		const file: File | null = e.target.files?.[0];
		if (!file) {
			return;
		}
		if (placement === 'place-new') {
			const reader = new FileReader();
			reader.onload = (readerEvent) => {
				const imageUrl = readerEvent.target.result as string;
				getImageDimensions(imageUrl).then(({ width, height }) => {
					dispatch(setCanvasSize({ x: width, y: height }));
					drawImageOnCanvas(imageUrl);
					setLocalStorageImage(imageUrl);
				});
			};
			reader.readAsDataURL(file);
		} else {
			console.log('not');
		}
	};

	const getImageDimensions = async (
		imageUrl: string
	): Promise<{ width: number; height: number }> => {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => {
				resolve({ width: img.width, height: img.height });
			};
			img.onerror = (error) => {
				reject(error);
			};
			img.src = imageUrl;
		});
	};

	const drawImageOnCanvas = (imageUrl: string) => {
		const ctx = getCanvasContext();
		const img = new Image();
		img.onload = () => {
			ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
		};
		img.src = imageUrl;
	};

	const handleRadioClick = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setPlacement(e.target.value);
	};

	return (
		<div className="flex flex-col items-center gap-8">
			<RadioButton
				label="Place in Existing Canvas"
				name="placement"
				value="place-existing"
				handleClick={handleRadioClick}
				defaultChecked={true}
			/>
			<RadioButton
				label="Place in New Canvas"
				name="placement"
				value="place-new"
				handleClick={handleRadioClick}
			/>
			<button className="w-fit min-w-48 cursor-pointer overflow-hidden bg-light-pink px-5 py-[10px] text-off-white shadow-outer-sm transition-all hover:scale-105 hover:animate-color-shift hover:border-transparent focus:scale-105 focus:border-none active:shadow-inner-md">
				Choose File
				<input
					className="absolute left-0 h-full w-full cursor-pointer opacity-0"
					type="file"
					accept="image/*"
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e)}
					style={{ cursor: 'pointer' }}
				/>
			</button>
		</div>
	);
};

interface RadioButtonProps {
	label: string;
	name: string;
	value: string;
	handleClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
	defaultChecked?: boolean;
}
const RadioButton: React.FC<RadioButtonProps> = ({
	label,
	name,
	value,
	handleClick,
	defaultChecked,
}) => {
	return (
		<div className="flex cursor-pointer flex-row gap-3">
			<input
				className="z-10 m-0 grid h-5 w-5 translate-y-1 cursor-pointer appearance-none place-content-center border-[2px] border-off-black bg-off-white opacity-100"
				type="radio"
				id={value}
				name={name}
				value={value}
				onChange={(e) => handleClick(e)}
				defaultChecked={defaultChecked}
			/>
			<label htmlFor={value}>{label}</label>
		</div>
	);
};

export default UploadModal;
