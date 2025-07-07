# Estructura del Proyecto

```
├── src/                # Código fuente principal
│   ├── components/     # Componentes reutilizables (Navbar, Player, etc)
│   ├── features/       # Lógica de dominio y pantallas
│   ├── pages/          # Rutas principales (index, movies, about...)
│   ├── layouts/        # Layouts globales
│   └── config/         # Configuración global (site, theme...)
├── public/             # Archivos estáticos
├── docs/               # Documentación técnica y de usuario
├── package.json        # Dependencias y scripts
├── tailwind.config.js  # Configuración Tailwind
├── vite.config.ts      # Configuración Vite
└── ...
```

- El entrypoint principal es `src/App.tsx`.
- La navegación se gestiona con React Router.
- El reproductor de video principal es `WebTorrentPlayer`.
