import { Chip } from "@heroui/react";
import { LanguageIcon } from "@/components/icons";

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
        <div className="flex flex-col gap-1 items-center justify-center">
            {showLabel && (
                <h3 className="text-lg font-semibold">Idioma</h3>
            )}
            <Chip.Root
                className="inline-flex items-center gap-1 px-2 py-1"
            >
                <LanguageIcon size={iconSize} />
                <Chip.Label>{displayLanguage}</Chip.Label>
            </Chip.Root>
        </div>
    );
};
