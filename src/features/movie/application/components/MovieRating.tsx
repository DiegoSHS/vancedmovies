import { StarIcon } from "@/components/icons";
import { Chip } from "@heroui/react"

export const MovieRating = ({ rating, size = 'md', showLabel = false }: { rating: number, size?: 'md' | 'lg' | 'sm', showLabel?: boolean }) => {
    const ratingContent = rating ? rating.toFixed(1) : "N/A";
    const iconSize = size === 'lg' ? 24 : size === 'sm' ? 16 : 20;
    return (
        <div className="flex flex-col gap-1 items-center justify-center">
            {showLabel && (
                <h3 className="text-lg font-semibold">Calificación</h3>
            )}
            <Chip.Root
                className="inline-flex items-center gap-1 px-2 py-1"
            >
                <StarIcon size={iconSize} />
                <Chip.Label>{ratingContent}</Chip.Label>
            </Chip.Root>
        </div>
    )
}