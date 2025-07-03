# Generador de Enlaces Magnet

Esta funcionalidad permite generar enlaces magnet para descargar torrents de las películas directamente desde la interfaz de la aplicación.

## Características

- **Generación automática de enlaces magnet** para cada torrent disponible
- **Copia al portapapeles** con un solo clic
- **Trackers predefinidos** optimizados para YTS
- **Interfaz intuitiva** con estados visuales (copiado, error)
- **Información detallada** de cada torrent (calidad, tamaño, seeds, peers)

## Cómo funciona

### 1. Generación de Enlaces Magnet

Los enlaces magnet se generan usando el siguiente formato:

```
magnet:?xt=urn:btih:HASH&dn=NOMBRE_CODIFICADO&tr=TRACKER1&tr=TRACKER2...
```

### 2. Trackers Incluidos

La aplicación utiliza los siguientes trackers optimizados:

- `udp://open.demonii.com:1337/announce`
- `udp://tracker.openbittorrent.com:80`
- `udp://tracker.coppersurfer.tk:6969`
- `udp://glotorrents.pw:6969/announce`
- `udp://tracker.opentrackr.org:1337/announce`
- `udp://torrent.gresille.org:80/announce`
- `udp://p4p.arenabg.com:1337`
- `udp://tracker.leechers-paradise.org:6969`

### 3. Uso en la Interfaz

1. Haz clic en el botón **"📥 Descargar"** en cualquier tarjeta de película
2. Se mostrará una lista de torrents disponibles con diferentes calidades
3. Haz clic en **"📋 Copiar"** junto al torrent deseado
4. El enlace magnet se copiará al portapapeles
5. Pega el enlace en tu cliente de torrents favorito

### 4. Estados Visuales

- **📋 Copiar**: Estado inicial
- **✓ Copiado!**: Enlace copiado exitosamente (verde)
- **❌ Error**: Error al copiar (rojo)

## Ejemplo de Enlace Magnet

Para la película "The Dark Knight" con calidad 1080p:

```
magnet:?xt=urn:btih:B4A1B5B6C4D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5&dn=The%20Dark%20Knight%20(1080p)%20[YTS.MX]&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Ftorrent.gresille.org%3A80%2Fannounce&tr=udp%3A%2F%2Fp4p.arenabg.com%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969
```

## Archivos Involucrados

- `src/utils/magnetGenerator.ts` - Lógica principal del generador
- `src/features/movie/application/components/MovieCard.tsx` - Componente con la interfaz
- `src/utils/magnetExample.ts` - Ejemplo de uso

## Consideraciones de Seguridad

- Los enlaces magnet se generan del lado del cliente
- No se almacenan datos sensibles
- Compatible con cualquier cliente de torrents
- Funciona sin requerir plugins adicionales

## Compatibilidad

- ✅ Navegadores modernos con soporte para Clipboard API
- ✅ Fallback para navegadores antiguos usando `document.execCommand`
- ✅ Funciona en HTTP y HTTPS
- ✅ Compatible con todos los clientes de torrents populares
