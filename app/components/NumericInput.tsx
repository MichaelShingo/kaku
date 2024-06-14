import React from 'react';
import Label from '../draw/contextualMenu/Label';

interface NumericInputProps {
	labelText?: string;
	postLabel?: string;
	min: number;
	max: number;
	value: string;
	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	error: boolean;
}

const NumericInput: React.FC<NumericInputProps> = ({
	labelText,
	min,
	max,
	value,
	handleChange,
	postLabel,
	error,
}) => {
	return (
		<div className="flex flex-row gap-2">
			<Label text={labelText} />
			<input
				className="h-fit w-fit min-w-16 rounded-md border-[2px] border-off-black text-center shadow-sm transition duration-300 focus:border-light-blue"
				type="number"
				min={min}
				max={max}
				value={value}
				onChange={handleChange}
				style={{ borderColor: error ? 'red' : '' }}
			/>
			<Label text={postLabel} />
		</div>
	);
};

export default NumericInput;
