import { Chip } from "@heroui/react/chip";

export const MovieDescription = ({
    description,
    maxWords = 10,
    full = false,
}: {
    description?: string,
    maxWords?: number,
    full?: boolean
}) => {
    // Validar si la descripción existe y no está vacía
    if (!description || description.trim() === '') {
        return (
            <Chip
                className="px-2 py-1"
            >
                <Chip.Label>
                    Sin descripción
                </Chip.Label>
            </Chip>
        );
    }
    if (full) {
        return (
            <Chip
                className="px-2 py-1"
                title={description} // Tooltip con la descripción completa
            >
                <Chip.Label>
                    {description}
                </Chip.Label>
            </Chip>
        );
    }
    // Truncar la descripción si excede el límite de palabras
    const words = description.trim().split(' ');
    const truncatedDescription = words.length > maxWords
        ? words.slice(0, maxWords).join(' ') + '...'
        : description;

    return (
        <Chip
            className="px-2 py-1"
            title={description} // Tooltip con la descripción completa
        >
            <Chip.Label>
                {truncatedDescription}
            </Chip.Label>
        </Chip>
    );
}
