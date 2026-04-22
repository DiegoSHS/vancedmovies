import { Link } from '@heroui/react';
import { VideoPlayer } from '../components/VideoPlayer';
import { useMovieContext } from '../providers/MovieProvider';

export const CommunityMovieScreen = () => {
    const {
        state: { selectedItem }
    } = useMovieContext()
    return (
        <div className="flex flex-col gap-2">
            <div className="text-2xl text-center font-bold">
                Pelicula de la comunidad
            </div>
            <Link href="/page/1" className="no-underline button button--ghost button--sm">
                ← Volver
            </Link>
            <VideoPlayer movieTitle={selectedItem?.title || 'Disfruta de la película'} />
        </div>
    )
}