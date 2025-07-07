# Streaming y Reproductores

## WebTorrentPlayer
- Reproduce videos directamente desde magnet links usando WebTorrent en el navegador.
- Carga el SDK dinámicamente para máxima compatibilidad.
- Soporta archivos `.mp4`, `.webm`, `.mkv` y otros formatos populares.

## Webtor.io
- Fallback universal: si el torrent no puede reproducirse localmente, se usa Webtor.io vía embed.
- Permite streaming desde cualquier dispositivo sin instalar nada.

## Consideraciones
- El rendimiento depende de la cantidad de seeds y peers del torrent.
- Si un magnet no funciona, prueba con otro o usa la opción Webtor.
