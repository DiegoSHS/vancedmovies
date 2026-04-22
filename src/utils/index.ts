import { useReducer, useState } from "react";

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

export interface ProviderState {
    query: string;
    totalResults: number;
    loading: boolean;
    error: string | null;
}

export const defaultProviderState: ProviderState = {
    error: null,
    loading: false,
    query: '',
    totalResults: 0
}

export function useBaseProviderState(initialState: ProviderState = defaultProviderState) {
    const [providerState, setProviderState] = useState<ProviderState>(initialState);
    const modifyProviderState = (newState: Partial<ProviderState>) => {
        setProviderState((prev) => ({
            ...prev,
            ...newState
        }))
    }
    return {
        ...providerState,
        modifyProviderState
    }
}

export const getQualityFromName = (name: string) => {
    return name.match(/(\d{3,4}p)/)?.[1] || 'HD'
}

/**
 * Copia un enlace magnet al portapapeles
 * @param text - El enlace magnet a copiar
 * @returns Promise que se resuelve cuando se copia exitosamente
 * @throws Error si el enlace magnet no es válido o no se puede copiar
 */
export const copyTextToClipboard = async (
    text: string,
): Promise<void> => {
    try {
        const { checkMagnet } = await import('@/utils/magnetGenerator')
        if (!checkMagnet(text)) {
            throw new Error("El enlace magnet no tiene un formato válido");
        }
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            // Fallback para navegadores que no soportan clipboard API
            const textArea = document.createElement("textarea");

            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand("copy");
                if (!successful) {
                    throw new Error("No se pudo copiar el enlace magnet usando el método fallback");
                }
            } finally {
                document.body.removeChild(textArea);
            }
        }
    } catch (error) {
        throw new Error(`Error al copiar el enlace magnet: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
};