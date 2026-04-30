import { Chip } from "@heroui/react/chip"

interface BaseChipProps {
    children: React.ReactNode,
    label: string,
    content: string | number,
    showLabel: boolean
}

const BaseMovieChip = ({ children, label, content, showLabel }: BaseChipProps) => {
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

export default BaseMovieChip