export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "BOLIPeliculas",
  description: "Tu plataforma de streaming favorita.",
  navItems: [
    {
      label: "Inicio",
      href: "/",
    },
    {
      label: "Películas",
      href: "/page/1",
    },
    {
      label: "Mi torrent",
      href: "/torrent",
    },
    {
      label: "Peliculas de la comunidad",
      href: "/community"
    }
  ],
  navMenuItems: [
    {
      label: "Inicio",
      href: "/",
    },
    {
      label: "Películas",
      href: "/page/1",
    },
    {
      label: "Mi torrent",
      href: "/torrent",
    },
    {
      label: "Peliculas de la comunidad",
      href: "/community"
    }
  ],
  links: {
    github: "https://github.com/DiegoSHS",
    twitter: "https://x.com/SuperHackSystem",
    docs: "https://heroui.com",
  },
};
