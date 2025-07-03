# VancedMovies - Arquitectura Hexagonal con YTS API

Este proyecto implementa una aplicación de películas utilizando arquitectura hexagonal (Ports and Adapters) con React, TypeScript y Vite, conectado a la API de YTS.

## Estructura del Proyecto

La aplicación está organizada por features, donde cada feature sigue la estructura de arquitectura hexagonal:

```
src/
├── features/
│   └── movie/
│       ├── domain/                 # Lógica de negocio pura
│       │   ├── entities/           # Entidades del dominio
│       │   │   ├── Movie.ts        # Entidad genérica Movie<T>
│       │   │   ├── Torrent.ts      # Entidad Torrent
│       │   │   └── MovieListResponse.ts # Respuesta de lista de películas
│       │   ├── repository/         # Interfaces (puertos)
│       │   │   └── MovieRepository.ts
│       │   └── datasources/        # Interfaces de fuentes de datos
│       │       └── MovieDatasource.ts
│       ├── infrastructure/         # Adaptadores externos
│       │   ├── repository/         # Implementaciones de repositorios
│       │   │   └── MovieRepository.ts
│       │   └── datasources/        # Implementaciones de fuentes de datos
│       │       └── MovieDatasource.ts (YTS API)
│       └── application/           # Capa de aplicación (UI)
│           ├── components/        # Componentes React
│           │   ├── MovieCard.tsx
│           │   └── MovieList.tsx
│           ├── providers/         # Context providers
│           │   └── MovieProvider.tsx
│           ├── screens/           # Pantallas principales
│           │   └── MoviesScreen.tsx
│           └── hooks/             # Custom hooks
│               └── useMovies.ts
├── utils/                         # Utilidades compartidas
│   ├── ApiClient.ts              # Cliente HTTP (Axios) configurado para YTS
│   └── ApiResult.ts              # Interfaz para respuestas de API YTS
└── types/                        # Tipos compartidos
    └── index.ts                  # Re-exportaciones
```

## Nuevas Entidades Implementadas

### Movie<T> (Genérica)

Basada en la respuesta de la API de YTS:

```typescript
export interface Movie<T = Torrent[]> {
  id: number;
  url: string;
  imdb_code: string;
  title: string;
  title_english: string;
  title_long: string;
  slug: string;
  year: number;
  rating: number;
  runtime: number;
  genres: string[];
  summary: string;
  description_full: string;
  synopsis: string;
  yt_trailer_code: string;
  language: string;
  mpa_rating: string;
  background_image: string;
  background_image_original: string;
  small_cover_image: string;
  medium_cover_image: string;
  large_cover_image: string;
  state: string;
  torrents: T;
  date_uploaded: string;
  date_uploaded_unix: number;
}
```

### Torrent

```typescript
export interface Torrent {
  url: string;
  hash: string;
  quality: string;
  type: string;
  is_repack: string;
  video_codec: string;
  bit_depth: string;
  audio_channels: string;
  seeds: number;
  peers: number;
  size: string;
  size_bytes: number;
  date_uploaded: string;
  date_uploaded_unix: number;
}
```

### ApiResult<T> (Actualizada)

Ahora ubicada en `utils/` y basada en la estructura de respuesta de YTS:

```typescript
export interface ApiResult<T> {
  status: string;
  status_message: string;
  data?: T;
  "@meta"?: {
    server_time: number;
    server_timezone: string;
    api_version: number;
    execution_time: string;
  };
}
```

## Funcionalidades Implementadas

### Métodos CRUD actualizados:

- `getMovies(page?, limit?)` - Lista de películas con paginación
- `getMovieById(id)` - Detalles de película específica
- `searchMovies(query, page?, limit?)` - Búsqueda por término
- `getMoviesByGenre(genre, page?, limit?)` - Filtro por género
- `getMoviesByYear(year, page?, limit?)` - Filtro por año
- `getMoviesByRating(minimum_rating, page?, limit?)` - Filtro por rating mínimo

### UI Mejorada:

- **Filtros avanzados**: Por género, año, rating
- **Paginación**: Navegación entre páginas de resultados
- **Búsqueda**: Búsqueda por título
- **Información detallada**: Rating, año, duración, géneros, idioma
- **Imágenes**: Soporte para múltiples tamaños de poster

## Configuración de la API

1. Copia el archivo `.env.example` a `.env`
2. La configuración por defecto apunta a YTS:

```
VITE_API_BASE_URL=https://yts.mx/api/v2
```

**Nota**: YTS API es pública y no requiere token de autenticación.

## Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Construcción
npm run build

# Linting
npm run lint

# Vista previa
npm run preview
```

## Arquitectura Hexagonal - Beneficios

1. **Separación de responsabilidades**: Cada capa tiene una responsabilidad específica
2. **Testabilidad**: Fácil de testear al tener dependencias inyectadas
3. **Mantenibilidad**: Código organizado y fácil de mantener
4. **Escalabilidad**: Fácil agregar nuevas features siguiendo el mismo patrón
5. **Flexibilidad**: Fácil cambiar de API (YTS → TMDB) sin afectar la lógica

## Patrones Implementados

### Dependency Injection

```typescript
const movieDatasource = new MovieDatasourceImp();
const movieRepository = new MovieRepositoryImp(movieDatasource);
```

### Generic Types

```typescript
// Movie es genérica para permitir diferentes tipos de torrents
export interface Movie<T = Torrent[]> {
  torrents: T;
  // ... otros campos
}
```

### Repository Pattern con métodos específicos de YTS

```typescript
abstract class MovieRepository {
  abstract getMoviesByGenre(
    genre: string,
  ): Promise<ApiResult<MovieListResponse>>;
  abstract getMoviesByYear(year: number): Promise<ApiResult<MovieListResponse>>;
  abstract getMoviesByRating(
    rating: number,
  ): Promise<ApiResult<MovieListResponse>>;
}
```

## Próximas Features

Para agregar nuevas features (ej: `user`, `favorites`, `downloads`), sigue el mismo patrón:

1. Crear la estructura de carpetas para la nueva feature
2. Definir las entidades en `domain/entities/`
3. Crear las clases abstractas en `domain/repository/` y `domain/datasources/`
4. Implementar las clases en `infrastructure/`
5. Crear los componentes, providers y screens en `application/`

## YTS API Endpoints Utilizados

- `/list_movies.json` - Lista principal con filtros
- `/movie_details.json` - Detalles específicos de película
- Parámetros soportados: `page`, `limit`, `query_term`, `genre`, `year`, `minimum_rating`
