import { Skeleton } from "@heroui/react/skeleton"

export const MovieDetailsCardSkeleton = () => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-start gap-8 justify-evenly items-center gap-2">
            {/* Image Skeleton */}
            <div className="relative overflow-hidden w-[320px] h-[568px] flex-shrink-0 p-0 m-0 rounded-xl">
                <Skeleton className="w-full h-full rounded-xl" />
            </div>

            {/* Details Skeleton */}
            <div className="flex flex-col gap-2 h-[350px] w-full">
                {/* Title Skeleton */}
                <div className="mb-2">
                    <Skeleton className="w-3/4 h-10 rounded-lg bg-white/20" />
                </div>

                {/* Metadata Skeletons (Year, Rating, Runtime, Language) */}
                <div className="flex flex-wrap gap-2">
                    <Skeleton className="w-24 h-8 rounded-full bg-white/20" />
                    <Skeleton className="w-20 h-8 rounded-full bg-white/20" />
                    <Skeleton className="w-28 h-8 rounded-full bg-white/20" />
                    <Skeleton className="w-24 h-8 rounded-full bg-white/20" />
                </div>

                {/* Genres Section */}
                <div className="flex flex-col gap-2 items-start mt-2">
                    <Skeleton className="w-20 h-6 rounded-lg bg-white/20" />
                    <div className="flex flex-wrap gap-2 w-full">
                        <Skeleton className="w-20 h-8 rounded-full bg-white/10" />
                        <Skeleton className="w-24 h-8 rounded-full bg-white/10" />
                        <Skeleton className="w-16 h-8 rounded-full bg-white/10" />
                    </div>
                </div>

                {/* Description Section */}
                <div className="flex flex-col gap-2 items-start mt-2">
                    <Skeleton className="w-28 h-6 rounded-lg bg-white/20" />
                    <Skeleton className="w-full h-5 rounded-lg bg-white/10" />
                    <Skeleton className="w-full h-5 rounded-lg bg-white/10" />
                    <Skeleton className="w-4/5 h-5 rounded-lg bg-white/10" />
                </div>
            </div>
        </div>
    )
}