# Componentes Reutilizables de Película

Esta documentación describe los componentes reutilizables creados para mostrar información de películas de manera consistente en toda la aplicación.

## Componentes Creados

### 1. MovieLanguage

Un componente para mostrar el idioma de una película con un icono y formato consistente.

**Props:**
- `language?: string` - El idioma de la película
- `size?: 'sm' | 'md' | 'lg'` - El tamaño del chip (por defecto: 'md')
- `showLabel?: boolean` - Si mostrar el título "Idioma" (por defecto: false)

**Ejemplo de uso:**
```tsx
// En card
<MovieLanguage language={movie.language} size="sm" />

// En detail screen
<MovieLanguage language={movie.language} size="lg" showLabel={true} />
```

### 2. MovieRuntime

Un componente para mostrar la duración de una película con formato legible y icono.

**Props:**
- `runtime?: number` - La duración en minutos
- `size?: 'sm' | 'md' | 'lg'` - El tamaño del chip (por defecto: 'md')
- `showLabel?: boolean` - Si mostrar el título "Duración" (por defecto: false)

**Ejemplo de uso:**
```tsx
// En card
<MovieRuntime runtime={movie.runtime} size="sm" />

// En detail screen
<MovieRuntime runtime={movie.runtime} size="lg" showLabel={true} />
```

### 3. MovieDescription

Un componente para mostrar la descripción de una película con truncamiento inteligente.

**Props:**
- `description?: string` - La descripción de la película
- `maxWords?: number` - Número máximo de palabras a mostrar (por defecto: 20)
- `size?: 'sm' | 'md' | 'lg'` - El tamaño del chip (por defecto: 'md')

**Ejemplo de uso:**
```tsx
// En card con descripción corta
<MovieDescription description={movie.description_full} maxWords={10} size="sm" />

// En detail screen con descripción más larga
<MovieDescription description={movie.description_full} maxWords={50} size="lg" />
```

### 4. MovieInfo

Un componente genérico para mostrar diferentes tipos de información de película.

**Props:**
- `type: 'year' | 'rating' | 'language' | 'runtime' | 'quality' | 'size' | 'custom'` - El tipo de información
- `value?: string | number` - El valor a mostrar
- `color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default'` - Color del chip
- `size?: 'sm' | 'md' | 'lg'` - El tamaño del chip (por defecto: 'md')
- `customIcon?: React.ReactNode` - Icono personalizado para tipo 'custom'
- `customLabel?: string` - Etiqueta personalizada para tipo 'custom'

**Ejemplo de uso:**
```tsx
// Diferentes tipos de información
<MovieInfo type="year" value={movie.year} />
<MovieInfo type="rating" value={movie.rating} size="sm" />
<MovieInfo type="runtime" value={movie.runtime} size="sm" />
<MovieInfo type="language" value={movie.language} size="sm" />
<MovieInfo type="quality" value="1080p" />
<MovieInfo type="size" value="2.5GB" />
<MovieInfo type="custom" value="Custom Value" customIcon={<CustomIcon />} customLabel="Custom Label" />
```

## Iconos Agregados

Se agregaron los siguientes iconos al archivo `src/components/icons.tsx`:

### LanguageIcon
Icono para representar idiomas.

### TimeIcon
Icono para representar duración/tiempo.

## Validación y Robustez

Todos los componentes incluyen:

- **Validación de entrada**: Verifican si los valores existen y son válidos
- **Valores por defecto**: Muestran mensajes apropiados cuando no hay datos
- **Tipos de TypeScript**: Completamente tipados para prevenir errores
- **Accesibilidad**: Incluyen tooltips y títulos descriptivos
- **Consistencia visual**: Siguen los mismos patrones de diseño

## Uso Recomendado

### En Cards de Película
```tsx
<div className="flex flex-wrap gap-2">
    <MovieInfo type="year" value={movie.year} />
    <MovieInfo type="rating" value={movie.rating} size="sm" />
    <MovieInfo type="runtime" value={movie.runtime} size="sm" />
    <MovieInfo type="language" value={movie.language} size="sm" />
    <MovieGenres genres={movie.genres} show={2} />
</div>
```

### En Pantallas de Detalle
```tsx
<div className="space-y-4">
    <MovieRating rating={movie.rating} size="lg" />
    <MovieRuntime runtime={movie.runtime} size="lg" showLabel={true} />
    <MovieLanguage language={movie.language} size="lg" showLabel={true} />
    <MovieGenres genres={movie.genres} />
    {movie.description_full && (
        <div>
            <h3 className="text-lg font-semibold mb-2">Descripción</h3>
            <MovieDescription description={movie.description_full} maxWords={50} size="lg" />
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                {movie.description_full}
            </p>
        </div>
    )}
</div>
```

## Beneficios

1. **Reutilización**: Los componentes pueden usarse en cualquier parte de la aplicación
2. **Consistencia**: Mismo diseño y comportamiento en toda la aplicación
3. **Mantenibilidad**: Un solo lugar para cambiar el estilo y comportamiento
4. **Robustez**: Manejo de errores y validación incorporados
5. **Accesibilidad**: Mejor experiencia para usuarios con discapacidades
6. **Tipado**: Prevención de errores en tiempo de compilación

## Patrón de Diseño

Todos los componentes siguen el patrón establecido por `MovieRating`:
- Usan `Chip` de HeroUI como base
- Incluyen iconos relevantes
- Tienen props para tamaño y personalización
- Validan los datos de entrada
- Proporcionan fallbacks apropiados
