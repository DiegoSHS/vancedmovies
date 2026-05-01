import { useState } from "react";
import { Link } from "@heroui/react/link";
import { Button } from "@heroui/react/button";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  CrossIcon,
  FilmIcon,
  EllipsisIcon,
} from "@/components/icons";
import MovieSearch from "@/features/movie/application/components/MovieSearch";
import { Dropdown } from "@heroui/react/dropdown";
import { AboutTooltip } from "./AboutTooltip";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-separator bg-surface">
      <header className="flex justify-between h-16 px-6 max-w-7xl mx-auto gap-2">
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

          <Link className="hidden md:flex items-center gap-1 no-underline" href="/">
            <FilmIcon />
            <p className="font-bold">BOLI</p>
          </Link>
          <MovieSearch />
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-4">
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
        <div className="hidden md:flex items-center gap-4">
          <AboutTooltip isIconOnly />
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
        <div className="flex md:hidden items-center gap-2">
          <Dropdown>
            <Button isIconOnly aria-label="Menu" variant="tertiary">
              <EllipsisIcon />
            </Button>
            <Dropdown.Popover>
              <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
                <Dropdown.Item className="p-0 m-0">
                  <AboutTooltip />
                </Dropdown.Item>
                <Dropdown.Item className="p-0 m-0">
                  <Link
                    aria-label="Perfil de twitter (X)"
                    href={siteConfig.links.twitter}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="button button--ghost gap-2"
                  >
                    <TwitterIcon className="w-5 h-5" />
                    Twitter
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item className="p-0 m-0">
                  <Link
                    aria-label="Perfil de Github"
                    href={siteConfig.links.github}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="button button--ghost gap-2"
                  >
                    <GithubIcon className="w-5 h-5" />
                    Github
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item className="p-0 m-0">
                  <ThemeSwitch isIconOnly={false} />
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
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
