import { useReducer } from "react";

export interface Action<T> {
    type: 'SET' | 'SELECT' | 'RESET' | 'UPDATE_SELECTED';
    payload?: T | T[];
}

export interface BaseState<T> {
    items: T[];
    selectedItem?: T;
}

export function BaseReducer<T>({ items, selectedItem }: BaseState<T>, { type, payload }: Action<T>): BaseState<T> {
    switch (type) {
        case 'SET':
            return { items: payload as T[], selectedItem };
        case 'SELECT':
            return { items, selectedItem: payload as T };
        case 'RESET':
            return { items: [], selectedItem: undefined };
        default:
            return { items, selectedItem };
    }
}

export function useBaseReducer<T>() {
    const [state, dispatch] = useReducer(BaseReducer<T>, {
        items: [],
        selectedItem: undefined,
    });
    return { state, dispatch };
}