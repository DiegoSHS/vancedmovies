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
            variant="ghost"
            className="inline-flex md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <CrossIcon />
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </Button>

          <Link
            className="flex items-center gap-1 no-underline"
            href="/"
          >
            <FilmIcon />
            <p className="font-bold">BOLI</p>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-6">
          {siteConfig.navItems.map((item) => (
            <li key={item.href}>
              <Link
                className="no-underline"
                href={item.href}
                aria-label={item.label}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Right Content */}
        <div className="hidden sm:flex items-center gap-4">
          <Tooltip delay={300}>
            <Link
              href="/about"
              aria-label="Acerca de"
            >
              <InfoIcon />
            </Link>
            <Tooltip.Content showArrow>
              Acerca de BOLIPeliculas
            </Tooltip.Content>
          </Tooltip>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={siteConfig.links.twitter}
            aria-label="Perfil de twitter (X)"
          >
            <TwitterIcon className="w-5 h-5" />
          </Link>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={siteConfig.links.github}
            aria-label="Perfil de Github"
          >
            <GithubIcon className="w-5 h-5" />
          </Link>
          <ThemeSwitch />
        </div>

        {/* Mobile Right Content */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            href="/about"
            aria-label="Acerca de"
          >
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
