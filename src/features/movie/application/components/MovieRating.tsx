import { StarIcon } from "@/components/icons";
import { BaseMovieChip } from "./MovieLanguage";

export const MovieRating = ({ rating, size = 'md', showLabel = false }: { rating: number, size?: 'md' | 'lg' | 'sm', showLabel?: boolean }) => {
    const ratingContent = rating ? rating.toFixed(1) : "N/A";
    const iconSize = size === 'lg' ? 24 : size === 'sm' ? 16 : 20;
    const color = rating >= 7 ? 'green' : rating >= 5 ? 'yellow' : 'red';
    return (
        <BaseMovieChip showLabel={showLabel} content={ratingContent} label="Calificación" >
            <StarIcon size={iconSize} className={`text-${color}-500`} />
        </BaseMovieChip>
    )
}