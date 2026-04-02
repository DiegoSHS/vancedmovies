import { Chip } from "@heroui/react";

export const MovieYear = ({ year, size = 'md', showLabel = false }: { year: number, size?: 'md' | 'lg' | 'sm', showLabel?: boolean }) => {
    return (
        <div className="flex flex-col gap-1 items-center justify-center">
            {showLabel && (
                <h3 className="text-lg font-semibold">Año</h3>
            )}
            <Chip.Root
                className="inline-flex items-center px-2 py-1"
            >
                <Chip.Label>{year}</Chip.Label>
            </Chip.Root>
        </div>
    )
}