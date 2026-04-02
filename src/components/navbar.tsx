import { useState } from "react";
import { Link } from "@heroui/react";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
} from "@/components/icons";
import { Logo } from "@/components/icons";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-separator bg-background/70 backdrop-blur-lg">
      <header className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <button
            className="inline-flex md:hidden items-center justify-center rounded-md p-2 text-default-500 hover:bg-default-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          <Link
            className="flex items-center gap-1 hover:opacity-80"
            href="/"
          >
            <Logo />
            <p className="font-bold">BOLI</p>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-6">
          {siteConfig.navItems.map((item) => (
            <li key={item.href}>
              <Link
                className="text-default-700 hover:text-primary transition-colors"
                href={item.href}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Right Content */}
        <div className="hidden sm:flex items-center gap-4">
          <Link isExternal href={siteConfig.links.twitter} title="Twitter" className="text-default-500 hover:text-primary">
            <TwitterIcon className="w-5 h-5" />
          </Link>
          <Link isExternal href={siteConfig.links.github} title="GitHub" className="text-default-500 hover:text-primary">
            <GithubIcon className="w-5 h-5" />
          </Link>
          <ThemeSwitch />
        </div>

        {/* Mobile Right Content */}
        <div className="flex md:hidden items-center gap-2">
          <Link isExternal href={siteConfig.links.github} className="text-default-500 hover:text-primary">
            <GithubIcon className="w-5 h-5" />
          </Link>
          <ThemeSwitch />
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-separator md:hidden">
          <ul className="flex flex-col gap-2 p-4">
            {siteConfig.navMenuItems.map((item, index) => (
              <li key={`${item}-${index}`}>
                <Link
                  className="block py-2 text-default-700 hover:text-primary transition-colors"
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
