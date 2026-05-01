import { Button } from "@heroui/react/button";

import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export const ThemeSwitch = ({ isIconOnly = true }: { isIconOnly?: boolean }) => {
  const html = document.documentElement;
  const isDarkMode = html.classList.contains("dark");
  const defaultMode = isDarkMode ? "dark" : "light";
  const { item, setItem } = useLocalStorage("heroui-theme", defaultMode);

  if (item === "dark") {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }
  const swapTheme = () => {
    const html = document.documentElement;

    if (item === "dark") {
      html.classList.remove("dark");
      setItem("light");
    } else {
      html.classList.add("dark");
      setItem("dark");
    }
  };

  return (
    <Button
      isIconOnly={isIconOnly}
      aria-label="Cambiar tema"
      variant="ghost"
      onPress={swapTheme}
    >
      {item !== "dark" ? (
        <MoonFilledIcon className="text-default-500" size={20} />
      ) : (
        <SunFilledIcon className="text-default-500" size={20} />
      )}
      {isIconOnly || ("Tema")}
    </Button>
  );
};

export default ThemeSwitch;
