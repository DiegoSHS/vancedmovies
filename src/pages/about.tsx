import { PlayIcon } from "@/components/icons";
import { Link } from "@heroui/react";

export default function About() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 rounded-xl">
      <div
        className="max-w-2xl mx-auto py-12 px-4"
      >
        <div className="text-3xl font-bold mb-4 flex">
          <h1>
            Acerca de BOLI
          </h1>
          <h1 className="font-bold text-red-600">
            Peliculas
          </h1>
        </div>
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
          <li>
            Búsqueda avanzada de películas por nombre, año, género y más.
          </li>
          <li>
            Visualización de detalles, calificaciones, idiomas y descargas
            disponibles.
          </li>
          <li>
            Puedes guardar cualquier pelicula en el apartado <Link href="/community">Comunidad</Link> con solo el magnet link.
          </li>
          <li>
            Puedes ver cualquier pelicula en <Link href="/torrent">Mi torrent</Link> con solo el magnet link
          </li>
          <li>Interfaz moderna, responsiva y modo oscuro.</li>
          <li>Sin anuncios, sin registros y totalmente gratuito.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Autor</h2>
        <p>
          Desarrollado por{" "}
          <Link
            href="https://github.com/DiegoSHS"
            target="_blank"
            rel="noopener noreferrer"
          >
            VancedSHS
          </Link>
        </p>
        <Link
          href="/page/1"
          className="no-underline my-2 button button--tertiary gap-1"
        >
          <PlayIcon />
          Volver a las pelis
        </Link>
      </div>
    </section>
  );
}
