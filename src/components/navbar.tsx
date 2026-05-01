import { useState } from "react";
import { Tooltip } from "@heroui/react/tooltip";
import { Link } from "@heroui/react/link";
import { Button } from "@heroui/react/button";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  CrossIcon,
  FilmIcon,
  InfoIcon,
} from "@/components/icons";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-separator bg-background/70 backdrop-blur-lg">
      <header className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <Button
            isIconOnly
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
            className="inline-flex md:hidden"
            variant="ghost"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <CrossIcon />
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            )}
          </Button>

          <Link className="flex items-center gap-1 no-underline" href="/">
            <FilmIcon />
            <p className="font-bold">BOLI</p>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-6">
          {siteConfig.navItems.map((item) => (
            <li key={item.href}>
              <Link
                aria-label={item.label}
                className="no-underline"
                href={item.href}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Right Content */}
        <div className="hidden sm:flex items-center gap-4">
          <Tooltip delay={300}>
            <Link aria-label="Acerca de" href="/about">
              <InfoIcon />
            </Link>
            <Tooltip.Content showArrow>Acerca de BOLIPeliculas</Tooltip.Content>
          </Tooltip>
          <Link
            aria-label="Perfil de twitter (X)"
            href={siteConfig.links.twitter}
            rel="noopener noreferrer"
            target="_blank"
          >
            <TwitterIcon className="w-5 h-5" />
          </Link>
          <Link
            aria-label="Perfil de Github"
            href={siteConfig.links.github}
            rel="noopener noreferrer"
            target="_blank"
          >
            <GithubIcon className="w-5 h-5" />
          </Link>
          <ThemeSwitch />
        </div>

        {/* Mobile Right Content */}
        <div className="flex sm:hidden items-center gap-2">
          <Link aria-label="Acerca de" href="/about">
            <InfoIcon />
          </Link>
          <ThemeSwitch />
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-separator md:hidden">
          <ul className="flex flex-col gap-2 p-4">
            {siteConfig.navMenuItems.map((item, index) => (
              <li key={`${item.label}-${index}`}>
                <Link
                  aria-label={item.label}
                  className="block py-2 no-underline"
                  href={item.href || "#"}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};
