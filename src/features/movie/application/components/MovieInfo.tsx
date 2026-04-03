import { Chip } from "@heroui/react";
import { StarIcon, LanguageIcon, TimeIcon } from "@/components/icons";

interface MovieInfoProps {
    type: 'year' | 'rating' | 'language' | 'runtime' | 'quality' | 'size' | 'custom';
    value?: string | number;
    color?: 'accent' | 'default' | 'success' | 'warning' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    customIcon?: React.ReactNode;
    customLabel?: string;
}

export const MovieInfo: React.FC<MovieInfoProps> = ({
    type,
    value,
    color = 'default',
    size = 'md',
    customIcon,
    customLabel
}) => {
    const getIconSize = () => {
        return size === 'lg' ? 20 : size === 'sm' ? 14 : 16;
    };

    const getDisplayValue = () => {
        if (value === undefined || value === null) {
            return "N/A";
        }

        switch (type) {
            case 'year':
                return value.toString();
            case 'rating':
                return typeof value === 'number' ? value.toFixed(1) : value;
            case 'language':
                return typeof value === 'string' ? value.toUpperCase() : value;
            case 'runtime':
                if (typeof value === 'number') {
                    const hours = Math.floor(value / 60);
                    const mins = value % 60;
                    return hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;
                }
                return value.toString();
            case 'quality':
                return value.toString();
            case 'size':
                return value.toString();
            case 'custom':
                return customLabel || value.toString();
            default:
                return value.toString();
        }
    };

    const getIcon = () => {
        const iconSize = getIconSize();

        switch (type) {
            case 'rating':
                return <StarIcon size={iconSize} />;
            case 'language':
                return <LanguageIcon size={iconSize} />;
            case 'runtime':
                return <TimeIcon size={iconSize} />;
            case 'custom':
                return customIcon;
            default:
                return null;
        }
    };

    const displayValue = getDisplayValue();
    const icon = getIcon();

    const colorClass = color === 'accent'
        ? 'bg-accent-100 text-accent-800'
        : color === 'success'
            ? 'bg-success-100 text-success-800'
            : color === 'warning'
                ? 'bg-warning-100 text-warning-800'
                : color === 'danger'
                    ? 'bg-danger-100 text-danger-800'
                    : 'bg-default-100 text-default-800';

    return (
        <Chip.Root
            className={`inline-flex items-center gap-1 px-2 py-1 ${colorClass}`}
        >
            {icon && <span className="inline-flex items-center">{icon}</span>}
            <Chip.Label>{displayValue}</Chip.Label>
        </Chip.Root>
    );
};
