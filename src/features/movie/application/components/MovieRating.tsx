import { StarIcon } from "@/components/icons";
import { Chip } from "@heroui/chip"

export const MovieRating = ({ rating, size = 'md' }: { rating: number, size?: 'md' | 'lg' | 'sm' }) => {
    const ratingColor = rating >= 7 ? "success" : rating >= 5 ? "warning" : "danger";
    const ratingContent = rating ? rating.toFixed(1) : "N/A";
    const iconSize = size === 'lg' ? 24 : size === 'sm' ? 16 : 20;
    return (
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
    )
}