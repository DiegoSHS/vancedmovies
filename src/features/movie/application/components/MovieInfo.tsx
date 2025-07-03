import { Chip } from "@heroui/chip";
import { StarIcon, LanguageIcon, TimeIcon } from "@/components/icons";

interface MovieInfoProps {
    type: 'year' | 'rating' | 'language' | 'runtime' | 'quality' | 'size' | 'custom';
    value?: string | number;
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default';
    size?: 'sm' | 'md' | 'lg';
    customIcon?: React.ReactNode;
    customLabel?: string;
}

export const MovieInfo: React.FC<MovieInfoProps> = ({
    type,
    value,
    color = 'primary',
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

    const getColor = () => {
        if (color !== 'primary') return color;

        switch (type) {
            case 'rating':
                if (typeof value === 'number') {
                    return value >= 7 ? 'success' : value >= 5 ? 'warning' : 'danger';
                }
                return 'primary';
            case 'year':
                return 'secondary';
            default:
                return 'primary';
        }
    };

    const displayValue = getDisplayValue();
    const icon = getIcon();
    const chipColor = getColor();

    return (
        <Chip
            color={chipColor}
            size={size}
            variant="flat"
            startContent={icon}
        >
            {displayValue}
        </Chip>
    );
};
