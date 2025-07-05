import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import AboutPage from "@/pages/about";
import MovieDetailPage from "@/pages/movie";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<MovieDetailPage />} path="/movie/:id" />
      <Route element={<AboutPage />} path="/about" />
    </Routes>
  );
}

export default App;
