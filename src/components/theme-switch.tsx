import { FC, useState, useEffect } from "react";

import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export interface ThemeSwitchProps {
  className?: string;
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({ className }) => {
  const [isMounted, setIsMounted] = useState(false);
  const html = document.documentElement
  const isDarkMode = html.classList.contains("dark");
  const defaultMode = isDarkMode ? 'dark' : 'light'
  const { item, setItem } = useLocalStorage('heroui-theme', defaultMode)
  useEffect(() => {
    setIsMounted(true);
    if (item === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }, []);

  const swapTheme = () => {
    const html = document.documentElement;
    if (item === "dark") {
      html.classList.remove("dark");
      setItem('light')
    } else {
      html.classList.add("dark");
      setItem('dark')
    }
  };

  // Prevent Hydration Mismatch
  if (!isMounted) return <div className="w-6 h-6" />;

  return (
    <button
      onClick={swapTheme}
      className={`inline-flex items-center justify-center rounded-lg p-2 hover:bg-default-100 transition-colors ${className || ""}`}
      aria-label={item === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
    >
      {item === 'dark' ? (
        <MoonFilledIcon size={20} className="text-default-500" />
      ) : (
        <SunFilledIcon size={20} className="text-default-500" />
      )}
    </button>
  );
};
