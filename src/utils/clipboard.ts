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
        const { checkMagnet } = await import('@/utils/magnet/regexp')
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




