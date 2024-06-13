import React from 'react';
import Label from '../draw/contextualMenu/Label';

interface NumericInputProps {
	labelText?: string;
	postLabel?: string;
	min: number;
	max: number;
	value: number;
	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NumericInput: React.FC<NumericInputProps> = ({
	labelText,
	min,
	max,
	value,
	handleChange,
	postLabel,
}) => {
	return (
		<div className="flex flex-row gap-2">
			<Label text={labelText} />
			<input
				className="h-fit w-fit rounded-md border-[2px] border-off-black text-center"
				type="number"
				min={min}
				max={max}
				value={value}
				onChange={handleChange}
			/>
			<Label text={postLabel} />
		</div>
	);
};

export default NumericInput;
