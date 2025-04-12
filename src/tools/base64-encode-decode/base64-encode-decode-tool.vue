<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CopyButton from '@/tools/base64-encode-decode/copy-button.vue'
import type { Base64History } from '@/tools/base64-encode-decode/types'
import StorageUtils from '@/utils/storage-utils'
import C from '@/utils/constants'
import ResourceUtils from '@/utils/resource-utils'

const decoded = ref("");
const encodeError = ref("");

const encoded = ref("");
const decodeError = ref("");

const history = ref<Base64History[]>([]);

const isExpanded = ref(false);

const toggleExpand = () => {
	isExpanded.value = !isExpanded.value;
	StorageUtils.toggleJsonArrayItem(C.ToolLayout.ExpandedKey, C.ToolId.Base64EncodeDecode, isExpanded.value);
}

onMounted(() => {
	const expandedTools = StorageUtils.loadJsonArray<string>(C.ToolLayout.ExpandedKey);
	const existingHistory = StorageUtils.loadJsonArray<Base64History>(C.ToolId.Base64EncodeDecode);

	isExpanded.value = expandedTools.includes(C.ToolId.Base64EncodeDecode);
	history.value = existingHistory;
})

const saveToLocalStorage = (newItem: Base64History) => {
	const storageHistory = StorageUtils.loadJsonArray<Base64History>(C.ToolId.Base64EncodeDecode);
	const newHistory = [newItem, ...storageHistory].slice(0, C.History.Max);

	history.value = newHistory;
	StorageUtils.saveJsonArray(C.ToolId.Base64EncodeDecode, newHistory);
}

const clearHistory = () => {
	history.value = [];
	StorageUtils.removeJsonArray(C.ToolId.Base64EncodeDecode);
}

const clearText = () => {
	decoded.value = "";
	encoded.value = "";
	decodeError.value = "";
	encodeError.value = "";
}

const clearError = () => {
	decodeError.value = "";
	encodeError.value = "";
}

const onDecode = (event: Event) => {
	const value = (event?.target as HTMLInputElement).value;

	if (!value || value.trim() === "") {
		clearText();
		return;
	}

	try {
		encoded.value = value;
		decoded.value = atob(encoded.value);
		clearError();

		saveToLocalStorage({
			encoded: encoded.value,
			decoded: decoded.value,
			date: new Date().toISOString()
		});
	}
	catch (error) {
		console.error(error);
		decodeError.value = "Cannot decode string";
	}
}

const onEncode = (event: Event) => {
	const value = (event?.target as HTMLInputElement).value;

	if (!value || value.trim() === "") {
		clearText();
		return;
	}

	try {
		decoded.value = value;
		encoded.value = btoa(decoded.value);
		clearError();

		saveToLocalStorage({
			encoded: encoded.value,
			decoded: decoded.value,
			date: new Date().toISOString()
		})
	}
	catch (error) {
		console.error(error);
		encodeError.value = "Cannot encode string";
	}
}
</script>

<template>
	<div class="card card-border w-full h-fit transition-all duration-500 ease-out overflow-hidden bg-inherit bg-gradient-to-br from-emerald-500/20 via-emerald-900/20 to-transparent border-emerald-900/70"
		:class="{
			'md:w-2xl h-[800px]': isExpanded,
			'md:w-sm h-[140px]': !isExpanded
		}">
		<div class="card-body">
			<div class="flex justify-between items-center">
				<h2 class="card-title lg:text-2xl sm:text-xl text-lg">
					Base64 encode-decode
				</h2>
				<button @click="toggleExpand" class="btn btn-ghost btn-info btn-xs px-1 py-2">
					<template v-if="isExpanded">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
							stroke="currentColor" class="size-4">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
						</svg>
					</template>
					<template v-if="!isExpanded">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
							stroke="currentColor" class="size-4">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
						</svg>
					</template>
				</button>
			</div>

			<div class="transition-all duration-500 ease-out" :class="{
				'opacity-100 max-h-[800px]': isExpanded,
				'opacity-0 max-h-0 overflow-hidden': !isExpanded
			}">
				<fieldset class="fieldset">
					<legend class="fieldset-legend">
						Encoded
						<CopyButton :text="encoded" />
					</legend>
					<textarea :value="encoded" @input="onDecode" type="text" placeholder="Enter base64 string to decode"
						class="textarea textarea-lg textarea-primary w-full h-28 border-emerald-900 focus:outline-2 focus:outline-emerald-700"></textarea>
					<div class="fieldset-label text-error">{{ decodeError }}</div>
				</fieldset>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">
						Decoded
						<CopyButton :text="decoded" />
					</legend>
					<textarea :value="decoded" @input="onEncode" type="text" placeholder="Enter string to base64 encode"
						class="textarea textarea-lg textarea-primary w-full h-28 border-emerald-900 focus:outline-2 focus:outline-emerald-700"></textarea>
					<div class="fieldset-label text-error">{{ encodeError }}</div>
				</fieldset>

				<div class="flex justify-between items-center mt-4">
					<h3 class="text-lg">History ({{ history.length }}/{{ C.History.Max }})</h3>
					<button @click="clearHistory" class="btn btn-ghost btn-error btn-sm px-1 py-2">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
							stroke="currentColor" class="size-4">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
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
							<tr v-if="history.length === 0">
								<td colspan="4" class="text-center">
									No history items
								</td>
							</tr>

							<tr v-for="(item, index) in history" :key="index">
								<td class="text-left p-2">
									<div class="tooltip tooltip-right" :data-tip="new Date(item.date).toLocaleString()">
										<kbd class="kbd">{{ index + 1 }}</kbd>
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
										<CopyButton :text="item.encoded" />
										<CopyButton :text="item.decoded" />
									</div>
								</td>
								<td class="p-2">
									<div class="flex flex-col gap-1 break-keep text-nowrap">
										<p>{{ item.encoded }}</p>
										<p>{{ item.decoded }}</p>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>


			<div class="transition-all duration-500 ease-out" :class="{
				'opacity-0 max-h-0 overflow-hidden': isExpanded,
				'opacity-100 max-h-[80px]': !isExpanded
			}">
				<div class="text-center">
					<p class="mb-2 text-sm opacity-70">Base64 encoding/decoding tool</p>

					<div class="flex items-end justify-center rounded-lg p-2">
						<span class="text-xs opacity-70 mr-1">Built with</span>
						<div class="tooltip tooltip-top" data-tip="Vue.js">
							<a href="https://vuejs.org" target="_blank" rel="noopener noreferrer">
								<img :src="ResourceUtils.getLogo('vue')"  alt="Vue" loading="lazy" decoding="async" width="20"
									height="20" class="inline" />
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
