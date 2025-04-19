import Alpine from "alpinejs";
window.Alpine = Alpine;

// App state
import C from "@/utils/constants";
import StorageUtils from "@/utils/storage-utils";
import type { GuidHistory } from "@/tools/guid-generate/types";

document.addEventListener("alpine:init", () => {
	Alpine.data("guidGenerator", () => ({
		C: C,

		isExpanded: StorageUtils.loadJsonArray<string>(C.ToolLayout.ExpandedKey).includes(C.ToolId.GuidGenerate),
		saveExpandedState() {
			this.isExpanded = !this.isExpanded;

			StorageUtils.toggleJsonArrayItem(
				C.ToolLayout.ExpandedKey,
				C.ToolId.GuidGenerate,
				this.isExpanded,
			);
		},

		generatedGuid: "",
		generateGuid() {
			this.generatedGuid = crypto.randomUUID();
			const newItem: GuidHistory = {
				guid: this.generatedGuid,
				date: new Date().toISOString()
			};
			this.history = [newItem, ...this.history].slice(0, C.History.Max);
			StorageUtils.saveJsonArray<GuidHistory>(C.ToolId.GuidGenerate, this.history);
		},

		history: StorageUtils.loadJsonArray<GuidHistory>(C.ToolId.GuidGenerate),
		clearHistory() {
			StorageUtils.removeJsonArray(C.ToolId.GuidGenerate);
			this.history = [];
		},

		copyTimeouts: new Map<string, number>(),
		copyToClipboard(text: string, buttonId: string) {
			if (!navigator?.clipboard?.writeText) return;

			try {
				navigator.clipboard.writeText(text);

				// Update tooltip
				const tooltip = document.getElementById(buttonId)?.parentElement;
				if (tooltip) {
					tooltip.setAttribute("data-tip", "Copied!");
				}

				// Reset tooltip
				if (this.copyTimeouts.has(buttonId)) {
					clearTimeout(this.copyTimeouts.get(buttonId));
				}

				const copyTimeout = window.setTimeout(() => {
					if (tooltip) {
						tooltip.setAttribute("data-tip", "Copy");
					}
				}, 2000);

				this.copyTimeouts.set(buttonId, copyTimeout);
			} catch (err) {
				console.error("Failed to copy: ", err);
			}
		}
	}));
});

// Init Alpine after listeners
Alpine.start();
