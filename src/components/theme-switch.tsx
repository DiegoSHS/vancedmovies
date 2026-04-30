import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Button } from "@heroui/react/button";

export const ThemeSwitch = () => {
  const html = document.documentElement
  const isDarkMode = html.classList.contains("dark");
  const defaultMode = isDarkMode ? 'dark' : 'light'
  const { item, setItem } = useLocalStorage('heroui-theme', defaultMode)
  if (item === 'dark') {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
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

  return (
    <Button
      variant="ghost"
      isIconOnly
      onPress={swapTheme}
      aria-label="Cambiar tema"
    >
      {item !== 'dark' ? (
        <MoonFilledIcon size={20} className="text-default-500" />
      ) : (
        <SunFilledIcon size={20} className="text-default-500" />
      )}
    </Button>
  );
};

export default ThemeSwitch