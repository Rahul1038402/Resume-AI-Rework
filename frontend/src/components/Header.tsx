import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MenuIcon, X, LogOut, NotepadText, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import GradientText from "@/components/ui/GradientText";
import { useEffect, useState } from "react";
import { supabase } from '../lib/supabaseClient';
import { useTheme } from "@/hooks/use-theme";
import { Logo } from "./Logo";

type NavItem = {
  name: string;
  href: string;
};

const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "Resume Builder", href: "/builder" },
  { name: "AI Resume Analyzer", href: "/analyzer" },
  { name: "Job Tracker", href: "/tracker" },
  { name: "About Us", href: "/about" },
  { name: "ATS Comparison", href: "/ats"},
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    checkUser();
    setupAuthListener();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };

  const setupAuthListener = () => {
    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setShowUserMenu(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showUserMenu && !target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  return (
    <header
      className={cn(
        "fixed w-full z-40 transition-all duration-300 border-b border-gray-200 dark:border-gray-800 bg-gray-200/90 dark:bg-black/90",
        isScrolled ? "py-2" : "py-3"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 relative z-50">
              <Logo className="w-8 h-8 sm:w-10 sm:h-10" />
              <GradientText
                colors={["#9BBD67", "#26C168", "#92C8C0", "#4079ff", "#E3F1E8"]}
                animationSpeed={10}
                showBorder={false}
                className="text-2xl font-bold"
              >
                ResumeAI
              </GradientText>
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems
              .filter((item) => {
                if (location.pathname === "/" && item.href === "/") return false;
                return true;
              })
              .map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className={cn(
                    "transition-colors duration-200",
                    location.pathname === item.href
                      ? "text-resume-primary dark:text-resume-secondary border-b border-resume-primary dark:border-resume-secondary"
                      : "text-gray-600 hover:text-resume-primary dark:text-gray-300 dark:hover:text-white"
                  )}
                >
                  {item.name}
                </Link>
              ))}
          </nav>

          {/* Right: Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="size-5 text-yellow-300" />
              ) : (
                <Moon className="size-5 text-blue-900" />
              )}
            </button>

            {user ? (
              // User Avatar and Menu
              <div className="relative user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <img
                    src={user.user_metadata?.avatar_url}
                    alt="Profile"
                    className="size-9 rounded-full border-2 border-gray-200 dark:border-gray-700"
                  />
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-black/90 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      to="/tracker"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <NotepadText className="w-4 h-4" />
                      Job Tracker Dashboard
                    </Link>
                    <button
                      onClick={signOut}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-200 dark:hover:bg-red-500/80 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Sign In Button
              <Button
                onClick={signInWithGoogle}
                variant="default"
                className="bg-resume-primary hover:bg-resume-primary/90 dark:bg-resume-secondary dark:hover:bg-resume-secondary/90"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Right: Mobile Toggle Button */}
          <div className="lg:hidden flex items-center gap-2">
            {/* Theme Toggle Mobile */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="size-5 text-yellow-300" />
              ) : (
                <Moon className="size-5 text-blue-900" />
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="p-2 text-gray-600 dark:text-gray-300 z-50"
              aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
            >
              {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 bg-white/95 dark:bg-black/95 backdrop-blur-md z-40 flex flex-col items-center justify-center",
          "transition-all duration-300 lg:hidden",
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

          {/* Mobile Auth Section */}
          <div className="mt-8 flex flex-col items-center gap-4">
            {user ? (
              <div className="flex flex-col items-center gap-4 p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={user.user_metadata?.avatar_url}
                    alt="Profile"
                    className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-700"
                  />
                  <div className="text-left">
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  variant="outline"
                  className="flex items-center gap-2 bg-red-200 dark:bg-red-600/80"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => {
                  signInWithGoogle();
                  setIsMenuOpen(false);
                }}
                variant="default"
                className="bg-resume-primary hover:bg-resume-primary/90 dark:bg-resume-secondary dark:hover:bg-resume-secondary/90"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
