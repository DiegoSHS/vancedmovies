import { Chip } from "@heroui/chip"

export const MovieGenres = ({ genres, show = 0 }: { genres: string[], show?: number }) => {
    if (!genres || !Array.isArray(genres)) {
        return null
    }
    if (Array.isArray(genres) && genres.length === 0) {
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
                <Chip
                    key={`${genre}-${index}`}
                    color="secondary"
                    variant="flat"
                >
                    {genre}
                </Chip>
            ))}
        </div>
    )
}