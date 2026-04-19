import { Chip } from "@heroui/react"

export const MovieGenres = ({ genres, show = 0 }: { genres: string[], show?: number }) => {
    if (!genres || !Array.isArray(genres)) {
        return null
    }
    if (genres.length === 0) {
        return (
            <div className="text-gray-500 dark:text-gray-400">
                No hay géneros disponibles
            </div>
        )
    }
    const genresToShow = show ? genres.slice(0, show) : genres
    return (
        <div className="flex flex-wrap gap-2">
            {genresToShow.map((genre, index) => (
                <Chip.Root
                    key={`${genre}-${index}`}
                    className="inline-flex items-center px-2 py-1"
                >
                    <Chip.Label>{genre}</Chip.Label>
                </Chip.Root>
            ))}
        </div>
    )
}