import { Button } from "@heroui/react/button";
import { Input } from "@heroui/react/input";
import { useNavigate } from "react-router-dom";

import { useMovieActions, useMovieState } from "../providers/MovieProvider";

import { CrossIcon, SearchIcon } from "@/components/icons";

export const MovieSearch: React.FC = ({}) => {
  const { getMovies, searchMovies, resetQuery, updateQuery } =
    useMovieActions();
  const { query, status } = useMovieState();
  const navigate = useNavigate();
  const loading = status === "loading";
  const handleSearch = async () => {
    if (!query.trim()) {
      getMovies(1);
      navigate("/page/1");

      return;
    }

    searchMovies(1);
    navigate("/page/1");
  };

  const handleClearSearch = () => {
    getMovies(1);
    resetQuery();
    navigate("/page/1");
  };

  return (
    <div className="flex gap-2 w-full sm:w-2/3 md:w-1/2">
      <Input
        fullWidth
        aria-label="Buscar películas"
        disabled={loading}
        placeholder="Buscar películas"
        type="search"
        value={query}
        variant="secondary"
        onChange={(e) => updateQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <Button
        isIconOnly
        aria-label="Buscar"
        className="px-3 py-1"
        isDisabled={!query.trim()}
        variant="ghost"
        onPress={handleSearch}
      >
        <SearchIcon />
      </Button>
      <Button
        isIconOnly
        aria-label="Limpiar búsqueda"
        isDisabled={!query.trim()}
        variant="ghost"
        onPress={handleClearSearch}
      >
        <CrossIcon />
      </Button>
    </div>
  );
};

export default MovieSearch;
