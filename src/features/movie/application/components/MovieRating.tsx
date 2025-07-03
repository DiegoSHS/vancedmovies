import { StarIcon } from "@/components/icons";
import { Chip } from "@heroui/chip"

export const MovieRating = ({ rating, size = 'md', showLabel = false }: { rating: number, size?: 'md' | 'lg' | 'sm', showLabel?: boolean }) => {
    const ratingColor = rating >= 7 ? "success" : rating >= 5 ? "warning" : "danger";
    const ratingContent = rating ? rating.toFixed(1) : "N/A";
    const iconSize = size === 'lg' ? 24 : size === 'sm' ? 16 : 20;
    return (
        <div className="flex flex-col gap-1 items-center justify-center">
            {showLabel && (
                <h3 className="text-lg font-semibold">Calificación</h3>
            )}
            <Chip
                color={ratingColor}
                startContent={
                    <StarIcon size={iconSize} />
                }
                size={size}
                variant="flat"
            >
                {ratingContent}
            </Chip>
        </div>
    )
}