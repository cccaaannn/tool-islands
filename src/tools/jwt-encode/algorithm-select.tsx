/* @jsxImportSource react */

import CopyButton from "@/tools/jwt-encode/copy-button";


export const SignAlgorithms = ["HS256", "HS384", "HS512"]

interface Props {
	alg: string;
	onChange: (alg: string) => void;
}

const AlgorithmSelect = (props: Props) => {

	const { alg, onChange } = props;

	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedAlg = event.target.value;
		onChange(selectedAlg);
	};

	return (
		<fieldset className="fieldset">
			<legend className="fieldset-label">
				Algorithm
				<CopyButton text={alg} size="sm" />
			</legend>
			<select
				className="select w-full border-sky-900 focus:outline-2 focus:outline-sky-700"
				value={alg}
				onChange={handleChange}
			>
				{SignAlgorithms.map((alg) => <option key={alg} value={alg}>{alg}</option>)}
			</select>
		</fieldset>
	)
}

export default AlgorithmSelect;
