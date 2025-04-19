/* @jsxImportSource solid-js */

import CopyButton from "@/tools/jwt-decode/copy-button"
import { createSignal, For, Show, onMount } from "solid-js"
import * as jose from "jose";
import type { JwtHistory } from "@/tools/jwt-decode/types";
import StorageUtils from "@/utils/storage-utils";
import SwitchButton from "@/tools/jwt-decode/switch-button";
import C from "@/utils/constants";
import ResourceUtils from "@/utils/resource-utils";

const JwtDecodeTool = () => {

	const [decodedPayload, setDecodedPayload] = createSignal("");
	const [decodedHeader, setDecodedHeader] = createSignal("");
	const [decodeError, setDecodeError] = createSignal("");

	const [encoded, setEncoded] = createSignal("");

	const [history, setHistory] = createSignal<JwtHistory[]>([])

	const [isExpanded, setIsExpanded] = createSignal(false);

	const toggleExpand = () => {
		setIsExpanded(!isExpanded());
		StorageUtils.toggleJsonArrayItem(C.ToolLayout.ExpandedKey, C.ToolId.JwtDecode, isExpanded());
	}

	onMount(() => {
		const expandedTools = StorageUtils.loadJsonArray<string>(C.ToolLayout.ExpandedKey);
		const existingHistory = StorageUtils.loadJsonArray<JwtHistory>(C.ToolId.JwtDecode);

		setIsExpanded(expandedTools.includes(C.ToolId.JwtDecode));
		setHistory(existingHistory);
	});

	const saveToLocalStorage = (newItem: JwtHistory) => {
		const storageHistory = StorageUtils.loadJsonArray<JwtHistory>(C.ToolId.JwtDecode);
		const newHistory = [newItem, ...storageHistory].slice(0, C.History.Max);

		setHistory(newHistory);
		StorageUtils.saveJsonArray(C.ToolId.JwtDecode, newHistory);
	}

	const clearHistory = () => {
		setHistory([]);
		StorageUtils.removeJsonArray(C.ToolId.JwtDecode);
	}

	const clearText = () => {
		setEncoded("");
		setDecodedHeader("");
		setDecodedPayload("");
		setDecodeError("");
	};

	const onSwitch = (item: JwtHistory) => {
		setEncoded(item.encoded);
		setDecodedHeader(item.decodedHeader);
		setDecodedPayload(item.decodedPayload);
		setDecodeError("");
	}

	const onDecode = (value: string) => {
		setEncoded(value);

		if (!value || value.trim() === "") {
			clearText();
			return;
		}

		try {
			const _decodedHeader = jose.decodeProtectedHeader(value);
			const header = JSON.stringify(_decodedHeader, null, 2);
			setDecodedHeader(header);

			const _decodedBody = jose.decodeJwt(value)
			const body = JSON.stringify(_decodedBody, null, 2);
			setDecodedPayload(body);

			setDecodeError("");

			saveToLocalStorage({
				encoded: encoded(),
				decodedHeader: header,
				decodedPayload: body,
				date: new Date().toISOString()
			});
		}
		catch (error) {
			console.error(error);
			setDecodedPayload("");
			setDecodeError("Invalid JWT")
		}
	}

	return (
		<div
			class={
				`card card-border w-full h-fit transition-all duration-500 ease-out overflow-hidden bg-inherit 
				 bg-gradient-to-br from-blue-500/20 via-blue-900/20 to-transparent border-blue-900/70 
				${isExpanded() ? 'md:w-2xl h-[800px]' : 'md:w-sm h-[140px]'}`
			}
		>
			<div class="card-body">
				<div class="flex justify-between items-center">
					<h2 class="card-title lg:text-2xl sm:text-xl text-lg">
						Jwt decode
					</h2>
					<button onClick={toggleExpand} class="btn btn-ghost btn-info btn-xs px-1 py-2">
						<Show when={isExpanded()}>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
								stroke="currentColor" class="size-4">
								<path stroke-linecap="round" stroke-linejoin="round"
									d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
							</svg>
						</Show>
						<Show when={!isExpanded()}>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
								stroke="currentColor" class="size-4">
								<path stroke-linecap="round" stroke-linejoin="round"
									d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
							</svg>
						</Show>
					</button>
				</div>

				<div
					class={
						`transition-all duration-500 ease-out
						${isExpanded() ? 'opacity-100 max-h-[800px]' : 'opacity-0 max-h-0 overflow-hidden'}`
					}
				>
					<div class="flex justify-between gap-2">
						<div class="flex flex-col gap-1 w-1/2">
							<fieldset class="fieldset">
								<legend class="fieldset-legend">
									Encoded
									<CopyButton text={encoded()} />
								</legend>
								<textarea value={encoded()} onInput={e => onDecode(e.currentTarget.value)}
									placeholder="Enter JWT to decode"
									class="textarea textarea-lg textarea-primary w-full h-28 border-blue-900 focus:outline-2 focus:outline-blue-700"></textarea>
								<div class="fieldset-label text-error">{decodeError()}</div>
							</fieldset>

							<fieldset class="fieldset">
								<legend class="fieldset-legend">
									Header
									<CopyButton text={decodedHeader()} />
								</legend>
								<textarea disabled value={decodedHeader()}
									placeholder="JWT header"
									style={{ color: "white", cursor: "text" }}
									class="textarea textarea-lg textarea-primary w-full h-28"></textarea>
							</fieldset>
						</div>

						<fieldset class="fieldset w-1/2 flex">
							<legend class="fieldset-legend">
								Payload
								<CopyButton text={decodedPayload()} />
							</legend>
							<textarea disabled value={decodedPayload()}
								placeholder="JWT body"
								style={{ color: "white", cursor: "text" }}
								class="textarea textarea-lg textarea-primary w-full h-full"></textarea>
						</fieldset>
					</div>

					<div class="flex justify-between items-center mt-4">
						<h3 class="text-lg">History ({history().length}/{C.History.Max})</h3>
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
									<th class="p-2">Swc</th>
									<th class="p-2">Copy</th>
									<th class="p-2">Token</th>
								</tr>
							</thead>
							<tbody>
								<For each={history()}
									fallback={
										<tr>
											<td colspan="4" class="text-center">
												No history items
											</td>
										</tr>
									}
								>
									{
										(item, index) => (
											<tr>
												<td class="text-left p-2">
													<div class="tooltip tooltip-right" data-tip={new Date(item.date).toLocaleString()}>
														<kbd class="kbd">{history().length - index()}</kbd>
													</div>
												</td>
												<td class="text-left p-2">
													<SwitchButton onSwitch={() => onSwitch(item)} />
												</td>
												<td class="text-left p-2">
													<CopyButton text={item.encoded} />
												</td>
												<td class="p-2 break-keep text-nowrap">
													<p>{item.encoded}</p>
												</td>
											</tr>
										)
									}
								</For>
							</tbody>
						</table>
					</div>
				</div>

				<div
					class={
						`transition-all duration-500 ease-out 
						${isExpanded() ? 'opacity-0 max-h-0 overflow-hidden' : 'opacity-100 max-h-[80px]'}`
					}
				>
					<div class="text-center">
						<p class="mb-2 text-sm opacity-70">Jwt decoding tool</p>

						<div class="flex items-end justify-center rounded-lg p-2">
							<span class="text-xs opacity-70 mr-2">Built with</span>
							<div class="tooltip tooltip-top" data-tip="SolidJs">
								<a href="https://www.solidjs.com" target="_blank" rel="noopener noreferrer">
									<img src={ResourceUtils.getLogo("solid")} alt="SolidJS" loading="lazy" decoding="async" width="20" height="20" class="inline" />
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default JwtDecodeTool;
