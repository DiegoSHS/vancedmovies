import { Chip } from "@heroui/chip";
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
            <Chip
                color="primary"
                size={size}
                variant="flat"
                startContent={<LanguageIcon size={iconSize} />}
            >
                {displayLanguage}
            </Chip>
        </div>
    );
};
