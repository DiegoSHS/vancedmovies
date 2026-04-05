import { useState } from "react";

export function useLocalStorage(key: string, value: string) {
    const getItem = (key: string) => {
        const item = localStorage.getItem(key)
        if (item === null) return value
        return item
    }
    const setItem = (value: string) => {
        setLocalItem(value)
        localStorage.setItem(key, value)
    }
    const [localItem, setLocalItem] = useState(() => getItem(key));
    return {
        item: localItem,
        setItem
    }
}