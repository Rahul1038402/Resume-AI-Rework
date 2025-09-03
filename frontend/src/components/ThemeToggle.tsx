import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "fixed top-5 right-20 xl:right-[154px] lg:right-[100px] z-50 p-2 rounded-full transition-all duration-300 focus:outline-hidden", isScrolled ? "py-0" : "pt-1",)}
    >
      {theme === "dark" ? (
        <Sun className="size-7 text-yellow-300" />
      ) : (
        <Moon className="size-7 text-blue-900" />
      )}
    </button>
  );
};

export default ThemeToggle;
