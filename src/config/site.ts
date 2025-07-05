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
      href: "/movies",
    },
    {
      label: "Acerca de",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Inicio",
      href: "/",
    },
    {
      label: "Películas",
      href: "/movies",
    },
    {
      label: "Acerca de",
      href: "/about",
    },
  ],
  links: {
    github: "https://github.com/DiegoSHS",
    twitter: "https://x.com/SuperHackSystem",
    docs: "https://heroui.com",
  },
};
