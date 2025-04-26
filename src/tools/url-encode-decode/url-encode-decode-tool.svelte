<script lang="ts">
	import { onMount } from "svelte";
	import CopyButton from "@/tools/url-encode-decode/copy-button.svelte";
	import type { UrlHistory } from "@/tools/url-encode-decode/types";
	import StorageUtils from "@/utils/storage-utils";
	import C from "@/utils/constants";
    import ResourceUtils from "@/utils/resource-utils";

	let decoded = $state("");
	let encodeError = $state("");

	let encoded = $state("");
	let decodeError = $state("");

	let history = $state<UrlHistory[]>([]);

	let isExpanded = $state(false);

	const toggleExpand = () => {
		isExpanded = !isExpanded;
		StorageUtils.toggleJsonArrayItem(
			C.ToolLayout.ExpandedKey,
			C.ToolId.UrlEncodeDecode,
			isExpanded,
		);
	};

	onMount(() => {
		const expandedTools = StorageUtils.loadJsonArray<string>(
			C.ToolLayout.ExpandedKey,
		);
		const existingHistory = StorageUtils.loadJsonArray<UrlHistory>(
			C.ToolId.UrlEncodeDecode,
		);

		isExpanded = expandedTools.includes(C.ToolId.UrlEncodeDecode);
		history = existingHistory;
	});

	const saveToLocalStorage = (newItem: UrlHistory) => {
		const storageHistory = StorageUtils.loadJsonArray<UrlHistory>(
			C.ToolId.UrlEncodeDecode,
		);
		const newHistory = [newItem, ...storageHistory].slice(0, C.History.Max);

		history = newHistory;
		StorageUtils.saveJsonArray(C.ToolId.UrlEncodeDecode, newHistory);
	};

	const clearHistory = () => {
		history = [];
		StorageUtils.removeJsonArray(C.ToolId.UrlEncodeDecode);
	};

	const clearText = () => {
		decoded = "";
		encoded = "";
		decodeError = "";
		encodeError = "";
	};

	const clearError = () => {
		decodeError = "";
		encodeError = "";
	};

	const onDecode = (event: Event) => {
		const value = (event?.target as HTMLInputElement).value;

		if (!value || value.trim() === "") {
			clearText();
			return;
		}

		try {
			encoded = value;
			decoded = decodeURI(encoded);
			clearError();

			saveToLocalStorage({
				encoded: encoded,
				decoded: decoded,
				date: new Date().toISOString(),
			});
		} catch (error) {
			console.error(error);
			decodeError = "Cannot decode string";
		}
	};

	const onEncode = (event: Event) => {
		const value = (event?.target as HTMLInputElement).value;

		if (!value || value.trim() === "") {
			clearText();
			return;
		}

		try {
			decoded = value;
			encoded = encodeURI(decoded);
			clearError();

			saveToLocalStorage({
				encoded: encoded,
				decoded: decoded,
				date: new Date().toISOString(),
			});
		} catch (error) {
			console.error(error);
			encodeError = "Cannot encode string";
		}
	};
</script>

<div
	class="card card-border w-full h-fit transition-all duration-500 ease-out overflow-hidden bg-gradient-to-br from-orange-600/20 via-orange-900/20 to-transparent border-orange-900/70"
	class:md:w-2xl={isExpanded}
	class:md:w-sm={!isExpanded}
	class:h-[800px]={isExpanded}
	class:h-[140px]={!isExpanded}
>
	<div class="card-body">
		<div class="flex justify-between items-center">
			<h2 class="card-title lg:text-2xl sm:text-xl text-lg">
				URL encode-decode
			</h2>
			<button
				onclick={toggleExpand}
				class="btn btn-ghost btn-info btn-xs px-1 py-2"
			>
				{#if isExpanded}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25"
						/>
					</svg>
				{/if}
				{#if !isExpanded}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
						/>
					</svg>
				{/if}
			</button>
		</div>

		<div
			class="transition-all duration-500 ease-out"
			class:opacity-100={isExpanded}
			class:max-h-[800px]={isExpanded}
			class:opacity-0={!isExpanded}
			class:max-h-0={!isExpanded}
			class:overflow-hidden={!isExpanded}
		>
			<fieldset class="fieldset">
				<legend class="fieldset-legend">
					Encoded
					<CopyButton text={encoded} />
				</legend>
				<textarea
					value={encoded}
					oninput={onDecode}
					placeholder="Enter URL string to decode"
					class="textarea textarea-lg textarea-primary w-full h-28 border-orange-900 focus:outline-2 focus:outline-orange-800"
				></textarea>
				<div class="fieldset-label text-error">
					{decodeError}
				</div>
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">
					Decoded
					<CopyButton text={decoded} />
				</legend>
				<textarea
					value={decoded}
					oninput={onEncode}
					placeholder="Enter string to URL encode"
					class="textarea textarea-lg textarea-primary w-full h-28 border-orange-900 focus:outline-2 focus:outline-orange-800"
				></textarea>
				<div class="fieldset-label text-error">
					{encodeError}
				</div>
			</fieldset>

			<div class="flex justify-between items-center mt-4">
				<h3 class="text-lg">
					History ({history.length}/{C.History.Max})
				</h3>
				<button
					onclick={clearHistory}
					class="btn btn-ghost btn-error btn-sm px-1 py-2"
					aria-label="Clear history"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
						/>
					</svg>
				</button>
			</div>

			<div class="overflow-auto max-h-[330px]">
				<table class="table table-pin-rows table-zebra text-left">
					<thead>
						<tr>
							<th class="p-2">#</th>
							<th class="p-2">Lbl</th>
							<th class="p-2">Copy</th>
							<th class="p-2">Item</th>
						</tr>
					</thead>
					<tbody>
						{#if history.length === 0}
							<tr>
								<td colspan="4" class="text-center">
									No history items
								</td>
							</tr>
						{/if}

						{#each history as item, index}
							<tr>
								<td class="text-left p-2">
									<div
										class="tooltip tooltip-right"
										data-tip={new Date(
											item.date,
										).toLocaleString()}
									>
										<kbd class="kbd">{history.length - index}</kbd>
									</div>
								</td>
								<td class="text-left p-2">
									<div class="flex flex-col gap-1">
										<p>Enc</p>
										<p>Dec</p>
									</div>
								</td>
								<td class="text-left p-2">
									<div class="flex flex-col gap-1">
										<CopyButton text={item.encoded} />
										<CopyButton text={item.decoded} />
									</div>
								</td>
								<td class="p-2">
									<div
										class="flex flex-col gap-1 break-keep text-nowrap"
									>
										<p>{item.encoded}</p>
										<p>{item.decoded}</p>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<div
			class="transition-all duration-500 ease-out"
			class:opacity-0={isExpanded}
			class:max-h-0={isExpanded}
			class:overflow-hidden={isExpanded}
			class:opacity-100={!isExpanded}
			class:max-h-[80px]={!isExpanded}
		>
			<div class="text-center">
				<p class="mb-2 text-sm opacity-70">
					Url encoding/decoding tool
				</p>

				<div class="flex items-end justify-center rounded-lg p-2">
					<span class="text-xs opacity-70 mr-1">Built with</span>
					<div class="tooltip tooltip-top" data-tip="Svelte">
						<a
							href="https://svelte.dev"
							target="_blank"
							rel="noopener noreferrer"
						>
							<img
								src={ResourceUtils.getLogo("svelte")}
								alt="Svelte"
								loading="lazy"
								decoding="async"
								width="15"
								height="15"
								class="inline"
							/>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
