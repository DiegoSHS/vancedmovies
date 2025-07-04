# Guía de Uso - Nueva Implementación WebRTC para Streaming

## Cómo Usar los Nuevos Reproductores

### 1. Reproductor Híbrido Básico

El punto de entrada principal sigue siendo `HybridVideoPlayer`, ahora con una interfaz mejorada:

```tsx
import { HybridVideoPlayer } from "./features/movie/application/components/HybridVideoPlayer";

function MoviePlayer() {
    const torrent = {
        hash: "abc123...",
        name: "movie.mp4",
        // ... otros campos del torrent
    };

    return (
        <HybridVideoPlayer
            torrent={torrent}
            movieTitle="Mi Película Favorita"
            onClose={() => console.log("Reproductor cerrado")}
        />
    );
}
```

### 2. Reproductor Avanzado con Múltiples Opciones

Para acceso directo a todas las opciones de streaming:

```tsx
import { AdvancedHybridVideoPlayer } from "./features/movie/application/components/AdvancedHybridVideoPlayer";

function AdvancedPlayer() {
    return (
        <AdvancedHybridVideoPlayer
            torrent={torrent}
            movieTitle="Mi Película"
            onClose={handleClose}
        />
    );
}
```

### 3. Reproductor HLS Directo

Para streaming desde URLs HLS/M3U8:

```tsx
import { HlsVideoPlayer } from "./features/movie/application/components/HlsVideoPlayer";

function HLSPlayer() {
    return (
        <HlsVideoPlayer
            torrent={torrent}
            movieTitle="Mi Película"
            hlsUrl="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
            onClose={handleClose}
        />
    );
}
```

### 4. Reproductor MSE P2P

Para streaming con MediaSource Extensions:

```tsx
import { MseVideoPlayer } from "./features/movie/application/components/MseVideoPlayer";

function MSEPlayer() {
    return (
        <MseVideoPlayer
            torrent={torrent}
            movieTitle="Mi Película"
            onClose={handleClose}
        />
    );
}
```

## Opciones de Streaming Disponibles

### 🌊 WebTorrent
- **Mejor para**: Torrents con muchos seeders
- **Pros**: Fácil de usar, amplia compatibilidad
- **Contras**: Dependiente de seeders, velocidad variable

### 🔗 WebRTC P2P
- **Mejor para**: Conexiones directas de baja latencia
- **Pros**: Conexión directa, baja latencia
- **Contras**: Requiere configuración de servidor

### 📺 HLS Stream
- **Mejor para**: Streaming profesional de alta calidad
- **Pros**: Calidad adaptativa, streaming profesional
- **Contras**: Requiere servidor HLS

### ⚡ MSE P2P
- **Mejor para**: Pruebas y desarrollo avanzado
- **Pros**: Control granular, buffering inteligente
- **Contras**: Experimental, compatibilidad limitada

## URLs de Prueba para HLS

### Streams de Prueba Públicos:

1. **Mux Test Stream** (Recomendado para pruebas):
   ```
   https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
   ```

2. **Unified Streaming** (Tears of Steel):
   ```
   https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8
   ```

3. **Bitmovin** (Sintel):
   ```
   https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8
   ```

## Integración en MovieDetailScreen

Para integrar en la pantalla de detalles de película:

```tsx
// En MovieDetailScreen.tsx
import { HybridVideoPlayer } from "../components/HybridVideoPlayer";

function MovieDetailScreen({ movie }) {
    const [showPlayer, setShowPlayer] = useState(false);
    const [selectedTorrent, setSelectedTorrent] = useState(null);

    const handlePlayMovie = (torrent) => {
        setSelectedTorrent(torrent);
        setShowPlayer(true);
    };

    return (
        <div>
            {/* ... resto del componente ... */}
            
            {showPlayer && selectedTorrent && (
                <HybridVideoPlayer
                    torrent={selectedTorrent}
                    movieTitle={movie.title}
                    onClose={() => setShowPlayer(false)}
                />
            )}
            
            {/* Botones de reproducción */}
            {movie.torrents?.map((torrent) => (
                <Button
                    key={torrent.hash}
                    onPress={() => handlePlayMovie(torrent)}
                >
                    ▶️ Reproducir {torrent.quality}
                </Button>
            ))}
        </div>
    );
}
```

## Personalización y Configuración

### Configurar HLS.js

```tsx
// En HlsVideoPlayer.tsx, puedes modificar la configuración:
const hls = new Hls({
    debug: false,
    enableWorker: true,
    lowLatencyMode: true,
    backBufferLength: 90,    // Segundos de buffer trasero
    maxBufferLength: 30,     // Segundos de buffer adelantado
    startLevel: -1,          // -1 = auto, 0+ = nivel específico
    capLevelOnFPSDrop: true, // Reducir calidad si se pierden frames
});
```

### Configurar MSE

```tsx
// En MseVideoPlayer.tsx:
const MSE_CONFIG = {
    mimeType: 'video/mp4; codecs="avc1.42E01E,mp4a.40.2"',
    segmentDuration: 10,     // Duración de segmento en segundos
    bufferAhead: 3,          // Segmentos a mantener en buffer
    maxBufferSize: 50 * 1024 * 1024, // 50MB máximo
};
```

## Eventos y Callbacks

### Eventos del Reproductor

```tsx
function PlayerWithEvents() {
    const handlePlayerEvent = (event, data) => {
        console.log('Evento del reproductor:', event, data);
    };

    return (
        <HybridVideoPlayer
            torrent={torrent}
            movieTitle="Mi Película"
            onClose={() => console.log('Cerrado')}
            // Se pueden agregar más eventos personalizados
        />
    );
}
```

### Monitoreo de Estadísticas

Los reproductores HLS y MSE proporcionan estadísticas en tiempo real:

- **Velocidad de descarga**
- **Número de peers conectados** (MSE)
- **Salud del buffer**
- **Frames perdidos**
- **Bitrate actual**
- **Calidad de video**

## Consideraciones de Performance

### Optimización de Memoria
- Los buffers se limpian automáticamente
- Gestión inteligente de segmentos en MSE
- Liberación de recursos al cerrar

### Optimización de Red
- HLS utiliza streaming adaptativo
- MSE simula descarga P2P eficiente
- WebRTC optimiza conexiones directas

### Compatibilidad del Navegador
- HLS: Excelente (Chrome, Firefox, Safari, Edge)
- MSE: Buena (Chrome, Firefox, Edge; limitado en Safari)
- WebRTC: Buena (Chrome, Firefox, Edge; limitado en Safari)

## Troubleshooting

### Problemas Comunes

1. **HLS no carga**:
   - Verificar CORS del servidor
   - Comprobar formato de URL M3U8
   - Revisar console para errores de red

2. **MSE no funciona**:
   - Verificar soporte de MediaSource API
   - Comprobar codec compatibility
   - Revisar tamaño de segmentos

3. **WebRTC no conecta**:
   - Verificar configuración STUN/TURN
   - Comprobar servidor de señalización
   - Revisar permisos del navegador

### Debug

```tsx
// Habilitar debug en HLS
const hls = new Hls({ debug: true });

// Ver logs de MSE
console.log('MediaSource support:', MediaSource.isTypeSupported(mimeType));

// Debug de WebRTC
console.log('WebRTC support:', window.RTCPeerConnection);
```

Esta implementación proporciona una base sólida y extensible para streaming de video con múltiples tecnologías modernas.
