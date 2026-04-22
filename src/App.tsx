import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import AboutPage from "@/pages/about";
import MovieDetailsPage from "@/pages/movie";
import MoviesPage from "./pages/movies";
import Torrent from "./pages/torrent";
import Community from "./pages/community";
import CommunityMovie from "./pages/communityMovie";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<MoviesPage />} path="/page/:id" />
      <Route element={<MovieDetailsPage />} path="/movie/:id" />
      <Route element={<AboutPage />} path="/about" />
      <Route element={<Torrent />} path="/torrent/:id" />
      <Route element={<Torrent />} path="/torrent" />
      <Route element={<Community />} path="/community" />
      <Route element={<CommunityMovie />} path="/community/movies" />
    </Routes>
  );
}

export default App;
