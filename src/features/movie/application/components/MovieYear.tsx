import { Chip } from "@heroui/chip";

export const MovieYear = ({ year, size = 'md', showLabel = false }: { year: number, size?: 'md' | 'lg' | 'sm', showLabel?: boolean }) => {
    return (
        <div className="flex flex-col gap-1 items-center justify-center">
            {showLabel && (
                <h3 className="text-lg font-semibold">Año</h3>
            )}
            <Chip
                size={size}
                variant="flat"
            >
                {year}
            </Chip>
        </div>
    )
}