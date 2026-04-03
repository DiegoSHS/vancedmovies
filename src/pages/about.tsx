import { title } from "@/components/primitives";
import { Button, Link } from "@heroui/react";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>About</h1>
      </div>
      <div className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-4">Acerca de BOLIPeliculas</h1>
        <p className="mb-4">
          <strong>BOLIPeliculas</strong> es una plataforma web para explorar, buscar
          y reproducir películas vía streaming torrent directamente desde tu
          navegador, sin necesidad de descargas previas ni software adicional.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          Características principales
        </h2>
        <ul className="list-disc pl-6 mb-4">
          <li>
            Reproductor de video integrado con soporte para torrents.
          </li>
          <li>Búsqueda avanzada de películas por nombre, año, género y más.</li>
          <li>
            Visualización de detalles, calificaciones, idiomas y descargas
            disponibles.
          </li>
          <li>Interfaz moderna, responsiva y modo oscuro.</li>
          <li>Sin anuncios, sin registros y totalmente gratuito.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Autor</h2>
        <p>
          Desarrollado por{" "}
          <Link
            href="https://github.com/VancedSHS"
            target="_blank"
            rel="noopener noreferrer"
          >
            VancedSHS
          </Link>
        </p>
        <Button
          onClick={() => navigate("/movies")}
          className={'my-2'}
        >
          Volver a las pelis
        </Button>
      </div>
    </section>
  );
}
