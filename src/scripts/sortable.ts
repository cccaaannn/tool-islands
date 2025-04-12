import StorageUtils from "@/utils/storage-utils";
import C from "@/utils/constants";
import Sortable from "sortablejs";

const el = document.getElementById(C.ToolLayout.ItemsId);

if (el) {
    Sortable.create(el, {
        animation: 150,
        ghostClass: "bg-blue-500",
        sort: true,
        dataIdAttr: "id",
        filter: 'input,textarea,button,table',
        preventOnFilter: false,
        store: {
            get: () => {
                return StorageUtils.loadJsonArray<string>(C.ToolLayout.OrderKey);
            },
            set: (sortable) => {
                const order = sortable.toArray();
                StorageUtils.saveJsonArray(C.ToolLayout.OrderKey, order);
            }
        }
    });
}
