const loadJsonArray = <T,>(key: string): Array<T> => {
    const storageHistory = localStorage.getItem(key) ?? "[]";
    return storageHistory ? JSON.parse(storageHistory) : [];
};

const saveJsonArray = <T,>(key: string, items: Array<T>) => {
    localStorage.setItem(key, JSON.stringify(items));
};

const updateJsonArray = <T,>(key: string, item: T) => {
    const storageHistory = localStorage.getItem(key) ?? "[]";
    const newHistory = [...new Set([item, ...JSON.parse(storageHistory)])];
    saveJsonArray(key, newHistory);
}

const removeItemJsonArray = <T,>(key: string, item: T) => {
    const storageHistory = localStorage.getItem(key) ?? "[]";
    const newHistory = JSON.parse(storageHistory).filter((i: T) => i !== item);
    saveJsonArray(key, newHistory);
}

const removeJsonArray = (key: string) => {
    localStorage.removeItem(key);
}

const toggleJsonArrayItem = (key: string, item: string, toggle: boolean) => {
    if (toggle) {
        StorageUtils.updateJsonArray<string>(key, item);
    } else {
        StorageUtils.removeItemJsonArray<string>(key, item);
    }
}

const StorageUtils = {
    loadJsonArray,
    saveJsonArray,
    updateJsonArray,
    removeItemJsonArray,
    removeJsonArray,
    toggleJsonArrayItem
}

export default StorageUtils;
