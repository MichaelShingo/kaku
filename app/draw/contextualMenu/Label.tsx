interface LabelProps {
	text: string;
}
const Label: React.FC<LabelProps> = ({ text }) => {
	return (
		<label className="text-base" htmlFor="brush-size">
			{text}
		</label>
	);
};

export default Label;
