/* @jsxImportSource preact */

import CopyButton from "@/tools/str-escape/copy-button"
import { useState, useEffect } from 'preact/hooks';
import type { StrEscapeHistory } from "@/tools/str-escape/types";
import StorageUtils from "@/utils/storage-utils";
import C from "@/utils/constants";
import ResourceUtils from "@/utils/resource-utils";


const StrEscapeTool = () => {

	const [nonEscaped, setNonEscaped] = useState("");
	const [escaped, setEscaped] = useState("");

	const [history, setHistory] = useState<StrEscapeHistory[]>([]);

	const [isExpanded, setIsExpanded] = useState(false);

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
		StorageUtils.toggleJsonArrayItem(C.ToolLayout.ExpandedKey, C.ToolId.StrEscape, !isExpanded);
	};

	useEffect(() => {
		const expandedTools = StorageUtils.loadJsonArray<string>(C.ToolLayout.ExpandedKey);
		const existingHistory = StorageUtils.loadJsonArray<StrEscapeHistory>(C.ToolId.StrEscape);

		setIsExpanded(expandedTools.includes(C.ToolId.StrEscape));
		setHistory(existingHistory);
	}, []);

	const saveToLocalStorage = (newItem: StrEscapeHistory) => {
		const storageHistory = StorageUtils.loadJsonArray<StrEscapeHistory>(C.ToolId.StrEscape);
		const newHistory = [newItem, ...storageHistory].slice(0, C.History.Max);

		setHistory(newHistory);
		StorageUtils.saveJsonArray(C.ToolId.StrEscape, newHistory);
	};

	const clearHistory = () => {
		setHistory([]);
		StorageUtils.removeJsonArray(C.ToolId.StrEscape);
	};

	const onEscape = (value: string) => {
		setNonEscaped(value);

		const escapedStr = value
			.replace(/\\/g, '\\\\')
			.replace(/'/g, "\\'")
			.replace(/"/g, '\\"')
			.replace(/\n/g, '\\n')
			.replace(/\r/g, '\\r')
			.replace(/\t/g, '\\t');

		setEscaped(escapedStr);

		saveToLocalStorage({
			originalStr: value,
			escapedStr: escapedStr,
			date: new Date().toISOString()
		});
	}

	return (
		<div
			class={
				`card card-border w-full h-fit transition-all duration-500 ease-out overflow-hidden bg-inherit 
				 bg-gradient-to-br from-purple-500/20 via-purple-900/20 to-transparent border-purple-900/70 
				${isExpanded ? 'md:w-2xl h-[800px]' : 'md:w-sm h-[140px]'}`
			}
		>
			<div class="card-body">
				<div class="flex justify-between items-center">
					<h2 class="card-title lg:text-2xl sm:text-xl text-lg">
						String Escape
					</h2>
					<button onClick={toggleExpand} className="btn btn-ghost btn-info btn-xs px-1 py-2">
						{
							isExpanded &&
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
								stroke="currentColor" className="size-4">
								<path strokeLinecap="round" strokeLinejoin="round"
									d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
							</svg>
						}
						{
							!isExpanded &&
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
								stroke="currentColor" className="size-4">
								<path strokeLinecap="round" strokeLinejoin="round"
									d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
							</svg>
						}
					</button>
				</div>

				<div
					class={
						`transition-all duration-500 ease-out
						${isExpanded ? 'opacity-100 max-h-[800px]' : 'opacity-0 max-h-0 overflow-hidden'}`
					}
				>
					<fieldset class="fieldset">
						<legend class="fieldset-legend">
							String to Escape
							<CopyButton text={nonEscaped} />
						</legend>
						<textarea value={nonEscaped} onInput={e => onEscape(e.currentTarget.value)}
							placeholder="Enter string to escape"
							class="textarea textarea-lg textarea-primary w-full h-28 border-purple-900 focus:outline-2 focus:outline-purple-700"></textarea>
					</fieldset>

					<fieldset class="fieldset">
						<legend class="fieldset-legend">
							Escaped String
							<CopyButton text={escaped} />
						</legend>
						<textarea disabled value={escaped}
							placeholder="Escaped string"
							style={{ color: "white", cursor: "text" }}
							class="textarea textarea-lg textarea-primary w-full h-28 whitespace-pre overflow-auto"></textarea>
					</fieldset>

					<div class="flex justify-between items-center mt-4">
						<h3 class="text-lg">History ({history.length}/{C.History.Max})</h3>
						<button onClick={clearHistory} class="btn btn-ghost btn-error btn-sm px-1 py-2">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
								stroke="currentColor" class="size-4">
								<path stroke-linecap="round" stroke-linejoin="round"
									d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
							</svg>
						</button>
					</div>

					<div class="overflow-auto max-h-[330px]">
						<table class="table table-pin-rows table-zebra">
							<thead>
								<tr>
									<th class="p-2">#</th>
									<th class="p-2">Lbl</th>
									<th class="p-2">Copy</th>
									<th class="p-2">Item</th>
								</tr>
							</thead>
							<tbody>
								{
									history.length === 0 &&
									<tr>
										<td colSpan={4} className="text-center">
											No history items
										</td>
									</tr>
								}
								{
									history.map((item, index) =>
										<tr key={index}>
											<td className="text-left p-2">
												<div className="tooltip tooltip-right" data-tip={new Date(item.date).toLocaleString()}>
													<kbd className="kbd">{history.length - index}</kbd>
												</div>
											</td>

											<td class="text-left p-2">
												<div class="flex flex-col gap-1">
													<p>Org</p>
													<p>Esc</p>
												</div>
											</td>
											<td class="text-left p-2">
												<div class="flex flex-col gap-1">
													<CopyButton text={item.originalStr} />
													<CopyButton text={item.escapedStr} />
												</div>
											</td>
											<td class="p-2">
												<div class="flex flex-col gap-1 break-keep text-nowrap">
													<p>{item.originalStr}</p>
													<p>{item.escapedStr}</p>
												</div>
											</td>
										</tr>
									)
								}
							</tbody>
						</table>
					</div>
				</div>

				<div
					class={
						`transition-all duration-500 ease-out 
						${isExpanded ? 'opacity-0 max-h-0 overflow-hidden' : 'opacity-100 max-h-[80px]'}`
					}
				>
					<div class="text-center">
						<p class="mb-2 text-sm opacity-70">String escape tool</p>

						<div class="flex items-end justify-center rounded-lg p-2">
							<span class="text-xs opacity-70 mr-2">Built with</span>
							<div class="tooltip tooltip-top" data-tip="PreactJS">
								<a href="https://preactjs.com" target="_blank" rel="noopener noreferrer">
									<img src={ResourceUtils.getLogo("preact")} alt="PreactJS" loading="lazy" decoding="async" width="20" height="20" class="inline" />
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default StrEscapeTool;
