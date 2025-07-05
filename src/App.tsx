import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import AboutPage from "@/pages/about";
import MovieDetailPage from "@/pages/movie";
import MoviesPage from "./pages/movies";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<MoviesPage />} path="/movies" />
      <Route element={<MoviesPage />} path="/page/:id" />
      <Route element={<MovieDetailPage />} path="/movie/:id" />
      <Route element={<AboutPage />} path="/about" />
    </Routes>
  );
}

export default App;
