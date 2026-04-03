import { Chip } from "@heroui/react";
import { TimeIcon } from "@/components/icons";

interface MovieRuntimeProps {
    runtime?: number;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export const MovieRuntime: React.FC<MovieRuntimeProps> = ({
    runtime,
    size = 'md',
    showLabel = false
}) => {
    const formatRuntime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins} min`;
    };

    const finalDisplay = runtime ? formatRuntime(runtime) : "No especificada";
    const iconSize = size === 'lg' ? 20 : size === 'sm' ? 14 : 16;

    return (
        <div className="flex flex-col gap-1 items-center justify-center">
            {showLabel && (
                <h3 className="text-lg font-semibold">Duración</h3>
            )}
            <Chip.Root
                className="inline-flex items-center px-2 py-1 rounded-full gap-1"
            >
                <TimeIcon size={iconSize} />
                <Chip.Label>{finalDisplay}</Chip.Label>
            </Chip.Root>
        </div>
    );
};
