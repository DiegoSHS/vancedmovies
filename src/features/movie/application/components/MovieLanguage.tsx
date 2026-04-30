import { LanguageIcon } from "@/components/icons";
import { lazy } from "react";
const BaseMovieChip = lazy(() => import("@/components/BaseMovieChip"))
interface MovieLanguageProps {
    language?: string;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export const MovieLanguage: React.FC<MovieLanguageProps> = ({
    language,
    size = 'md',
    showLabel = false
}) => {
    const displayLanguage = language ? language.toUpperCase() : "No especificado";
    const iconSize = size === 'lg' ? 20 : size === 'sm' ? 14 : 16;

    return (
        <BaseMovieChip label="Idioma" showLabel={showLabel} content={displayLanguage}>
            <LanguageIcon size={iconSize} />
        </BaseMovieChip>
    );
};

