import { FC, useState, useEffect } from "react";

import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

export interface ThemeSwitchProps {
  className?: string;
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({ className }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check if dark mode is enabled
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const handleThemeChange = (isSelected: boolean) => {
    const html = document.documentElement;
    if (isSelected) {
      html.classList.add("dark");
      setIsDark(true);
    } else {
      html.classList.remove("dark");
      setIsDark(false);
    }
  };

  // Prevent Hydration Mismatch
  if (!isMounted) return <div className="w-6 h-6" />;

  return (
    <button
      onClick={() => handleThemeChange(!isDark)}
      className={`inline-flex items-center justify-center rounded-lg p-2 hover:bg-default-100 transition-colors ${className || ""}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <MoonFilledIcon size={20} className="text-default-500" />
      ) : (
        <SunFilledIcon size={20} className="text-default-500" />
      )}
    </button>
  );
};
