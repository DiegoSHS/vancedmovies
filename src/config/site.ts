export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "BOLIPeliculas",
  description: "Tu plataforma de streaming favorita.",
  navItems: [
    {
      label: "Películas",
      href: "/page/1",
    },
    {
      label: "Mi torrent",
      href: "/torrent",
    },
    {
      label: "Comunidad",
      href: "/community"
    }
  ],
  navMenuItems: [
    {
      label: "Películas",
      href: "/page/1",
    },
    {
      label: "Mi torrent",
      href: "/torrent",
    },
    {
      label: "Comunidad",
      href: "/community"
    }
  ],
  links: {
    github: "https://github.com/DiegoSHS",
    twitter: "https://x.com/SuperHackSystem",
    docs: "https://heroui.com",
  },
};
