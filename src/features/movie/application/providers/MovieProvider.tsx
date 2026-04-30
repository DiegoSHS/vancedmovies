import { createContext, useContext } from "react";
import { MovieRepositoryImp } from "../../infrastructure/repository/MovieRepository";
import { MovieDatasourceImp } from "../../infrastructure/datasources/MovieDatasource";
import { Movie } from "../../domain/entities/Movie";
import { HashResult } from "../../domain/entities/Hashes";
import { BaseState, ProviderState, useBaseProviderState, useBaseReducer } from "@/utils/baseProvider";
import { MovieStateHandler } from "../../infrastructure/repository/MovieStateHandler";
import { Torrent } from "../../domain/entities/Torrent";
interface MovieProviderProps {
  children: React.ReactNode;
}

interface MovieContextType extends ProviderState {
  state: BaseState<Movie>;
  torrentState: BaseState<Torrent>
  getMovies: (page: number) => Promise<Movie[]>;
  getMoreMovies: (page: number) => Promise<Movie[]>
  getMovieById: (id: number) => Promise<Movie | undefined>;
  searchMovies: (page: number) => Promise<Movie[]>;
  updateQuery: (newQuery: string) => void;
  resetQuery: () => void;
  selectMovie: (movie: Movie) => void
  addCommunityHash: (id: string, hash: string) => Promise<number>
  getCommunityHashes: () => Promise<HashResult[]>
  getMovieSuggestions: (id: number) => Promise<Movie[]>
  getMoreTorrents: (title: string) => Promise<Torrent[]>
  addTorrents: (torrents: Torrent[], initial?: Torrent[]) => Promise<Torrent[]>
  selectTorrent: (magnet: Torrent) => Promise<void>
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<MovieProviderProps> = ({ children }) => {
  const {
    status,
    query,
    totalResults,
    modifyProviderState
  } = useBaseProviderState()
  const {
    state,
    dispatch
  } = useBaseReducer<Movie>()
  const {
    state: torrentState,
    dispatch: torrentDispatch
  } = useBaseReducer<Torrent>()
  const movieDatasource = new MovieDatasourceImp();
  const movieRepository = new MovieRepositoryImp(movieDatasource);
  const handler = new MovieStateHandler(modifyProviderState, dispatch)
  const getMovies = async (page: number) => {
    return handler.many(movieRepository.getMovies(page))
  };
  const getMoreMovies = async (page: number) => {
    const data = await handler.many(movieRepository.getMovies(page))
    const merged = [...state.items, ...data]
    const hashes = new Set<string>()
    const filtered = merged.filter((item) => {
      if (!hashes.has(item.imdb_code)) {
        hashes.add(item.imdb_code)
        return true
      }
      return false
    })
    return filtered
  }
  const getMovieById = async (id: number) => {
    return handler.unique(movieRepository.getMovieById(id))
  }
  const searchMovies = async (page: number) => {
    if (query.trim() === '') return []
    const data = await handler.many(movieRepository.searchMovies(query, page))
    if (!data.length) {
      const { toast } = await import('@heroui/react')
      toast.info('A veces las peliculas tienen títulos muy raros, intenta con otro nombre')
      return []
    }
    return data
  }
  const getMovieSuggestions = async (id: number) => {
    return handler.many(movieRepository.getMovieSuggestions(id))
  }

  const addCommunityHash = async (id: string, hash: string) => {
    const { toast } = await import('@heroui/react')
    const result = await movieRepository.addCommunityHash(id, hash)
    const message =
      result > 0 ? "Torrent añadido" :
        result === -1 ? "Error al añadir el torrent" :
          "El torrent ya existe"
    toast(message)
    return result
  }
  const getCommunityHashes = async () => {
    return handler.base(movieRepository.getCommunityHashes())
  }
  const addTorrents = async (torrents: Torrent[], initial: Torrent[] = []) => {
    const merged = [...torrents, ...initial]
    if (!merged.length) return []
    const { filterUniqueTorrents } = await import("@/utils/torrent")
    const filtered = filterUniqueTorrents(merged)
    const sorted = filtered.sort((p, n) => n.seeds - p.seeds)
    torrentDispatch({ type: "SET", payload: sorted })
    return sorted
  }
  const getMoreTorrents = async (title: string) => {
    const data = await handler.base(movieRepository.getMoreTorrents(title))
    if (!data.length) {
      autoSelectTorrent(torrentState.items)
      return data
    }
    const merged = await addTorrents(data, torrentState.items)
    const dualMagnet = merged.find(item => item.type.toUpperCase().includes('DUAL'))
    if (dualMagnet) {
      selectTorrent(dualMagnet)
    } else {
      autoSelectTorrent(merged)
    }
    return data
  }
  const autoSelectTorrent = async (magnets?: Torrent[]) => {
    const { getBestQualityMagnets } = await import("@/utils/magnet/filter")
    const bestMagnets = getBestQualityMagnets(magnets || torrentState.items)
    if (!bestMagnets.length) return
    torrentDispatch({ type: 'SELECT', payload: bestMagnets[0] })
    const { toast } = await import('@heroui/react')
    toast.info('Torrent óptimo seleccionado')
    return bestMagnets[0]
  }
  const selectTorrent = async (magnet: Torrent) => {
    torrentDispatch({ type: 'SELECT', payload: magnet })
    const { toast } = await import('@heroui/react')
    toast.info('Torrent seleccionado')
  }
  const selectMovie = (movie: Movie) => {
    dispatch({ type: 'SELECT', payload: movie })
  }
  const updateQuery = (newQuery: string) => {
    modifyProviderState({ query: newQuery });
  };
  const resetQuery = () => {
    modifyProviderState({ query: '' });
  };
  const value: MovieContextType = {
    state,
    torrentState,
    getMovies,
    getMoreMovies,
    getMovieById,
    searchMovies,
    updateQuery,
    resetQuery,
    selectMovie,
    addCommunityHash,
    getCommunityHashes,
    getMovieSuggestions,
    getMoreTorrents,
    selectTorrent,
    addTorrents,
    query,
    totalResults,
    status
  }

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};

export const useMovieContext = (): MovieContextType => {
  const context = useContext(MovieContext);

  if (context === undefined) {
    throw new Error("useMovieContext must be used within a MovieProvider");
  }

  return context;
};
