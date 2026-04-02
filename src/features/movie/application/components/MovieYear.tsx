import { CalendarIcon } from "@/components/icons";
import { BaseMovieChip } from "./MovieLanguage";

export const MovieYear = ({ year, size, showLabel = false }: { year: number, size: 'lg' | 'md' | 'sm', showLabel?: boolean }) => {
    const iconSize = size === 'lg' ? 24 : size === 'sm' ? 16 : 20;
    return (
        <BaseMovieChip showLabel={showLabel} content={year} label="Año">
            <CalendarIcon size={iconSize} />
        </BaseMovieChip>
    )
}