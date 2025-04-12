/* @jsxImportSource react */

import { useState } from "react";


interface Props {
	text: string;
	size?: "sm" | "md";
}

const CopyButton = (props: Props) => {

	const [isCopied, setIsCopied] = useState(false);
	const [copyTimeout, setCopyTimeout] = useState<number | null>(null);

	const copyToClipboard = () => {
		if (!navigator?.clipboard?.writeText) return;
		if (!props.text) return;

		try {
			navigator.clipboard.writeText(props.text);
			setIsCopied(true);

			if (copyTimeout) {
				clearTimeout(copyTimeout);
			}

			const timeout = window.setTimeout(() => {
				setIsCopied(false);
			}, 1000);

			setCopyTimeout(timeout);
		}
		catch (err) {
			console.error("Failed to copy: ", err);
		}
	};

	return (
		<div>
			<div className="tooltip" data-tip={isCopied ? 'Copied!' : 'Copy'}>
				<button onClick={copyToClipboard} className="btn btn-ghost btn-info btn-xs px-1 py-2"
				>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
						stroke="currentColor" className={props.size === "sm" ? "size-3" : "size-4"}>
						<path strokeLinecap="round" strokeLinejoin="round"
							d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
					</svg>
				</button>
			</div>
		</div>
	)
}

export default CopyButton;
