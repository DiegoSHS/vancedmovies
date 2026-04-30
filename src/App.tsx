import { Route, Routes } from "react-router-dom";
import { lazy } from "react";

const Index = lazy(() => import("@/pages/index"))
const Movies = lazy(() => import("@/pages/movies"))
const Details = lazy(() => import("@/pages/movie"))
const About = lazy(() => import("@/pages/about"))
const Torrent = lazy(() => import("@/pages/torrent"))
const Community = lazy(() => import("@/pages/community"))

function App() {
  return (
    <Routes>
      <Route element={<Index />} path="/" />
      <Route element={<Movies />} path="/page/:id" />
      <Route element={<Details />} path="/movie/:id" />
      <Route element={<About />} path="/about" />
      <Route element={<Torrent />} path="/torrent/:id" />
      <Route element={<Torrent />} path="/torrent" />
      <Route element={<Community />} path="/community" />
    </Routes>
  );
}

export default App;
