import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MenuIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import GradientText from "@/components/ui/GradientText";
import { useEffect, useState } from "react";

type NavItem = {
  name: string;
  href: string;
};

const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "Analyzer", href: "/analyzer" },
  { name: "Resume Builder", href: "/builder" },
  { name: "About", href: "/about" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed w-full z-40 transition-all duration-300 border-b border-gray-200 dark:border-gray-800",
        isMenuOpen
          ? "bg-transparent py-3"
          : isScrolled
            ? "py-2 bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm"
            : "py-3 backdrop-blur-md bg-white/30 dark:bg-black/20"
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-2xl font-bold text-resume-primary dark:text-white relative z-50">
            <GradientText
              colors={["#9BBD67", "#26C168", "#92C8C0", "#4079ff", "#E3F1E8", "#515039", "#88FDE9", "#0B532F"]}
              animationSpeed={10}
              showBorder={false}
              className="text-2xl"
            >
              ResumeAI
            </GradientText>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className="text-gray-600 hover:text-resume-primary transition-colors duration-200 dark:text-gray-300 dark:hover:text-white"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="default"
            className="bg-resume-primary hover:bg-resume-primary/90 dark:bg-resume-secondary dark:hover:bg-resume-secondary/90"
            asChild
          >
            <Link to="/analyzer" className="mr-10">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="p-2 text-gray-600 dark:text-gray-300 z-50"
            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "fixed inset-0 bg-white/95 dark:bg-black/95 backdrop-blur-md z-40 flex flex-col items-center justify-center",
            "transition-all duration-300 md:hidden",
            isMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
        >
          <div className="flex flex-col space-y-8 text-xl text-center">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-600 hover:text-resume-primary transition-colors duration-200 dark:text-gray-300 dark:hover:text-white"
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-8">
              <Button
                variant="default"
                className="bg-resume-primary hover:bg-resume-primary/90 dark:bg-resume-secondary dark:hover:bg-resume-secondary/90"
                asChild
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/analyzer">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;