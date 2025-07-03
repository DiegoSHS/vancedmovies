import { Chip } from "@heroui/chip"

export const MovieDescription = ({
    description,
    maxWords = 20,
    size = 'md'
}: {
    description?: string,
    maxWords?: number,
    size?: 'md' | 'lg' | 'sm'
}) => {
    // Validar si la descripción existe y no está vacía
    if (!description || description.trim() === '') {
        return (
            <Chip
                color="default"
                size={size}
                variant="flat"
            >
                Sin descripción
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
            color="primary"
            size={size}
            variant="flat"
            title={description} // Tooltip con la descripción completa
        >
            {truncatedDescription}
        </Chip>
    );
}
