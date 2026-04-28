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
        <BaseMovieChip label="Idioma" showLabel={showLabel} content={displayLanguage}>
            <LanguageIcon size={iconSize} />
        </BaseMovieChip>
    );
};

interface BaseChipProps {
    children: React.ReactNode,
    label: string,
    content: string | number,
    showLabel: boolean
}

export const BaseMovieChip = ({ children, label, content, showLabel }: BaseChipProps) => {
    return (
        <div className="flex flex-col gap-1 items-center justify-center">
            {showLabel && (
                <h2 className="text-lg font-semibold">{label}</h2>
            )}
            <Chip.Root
                className="inline-flex items-center px-2 py-1 rounded-full gap-1"
            >
                {children}
                <Chip.Label>
                    {content}
                </Chip.Label>
            </Chip.Root>
        </div>
    )
}