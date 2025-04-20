import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { MoonIcon, SunIcon } from "lucide-react";
import { FaAndroid, FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import MobileMenu from "@/components/ui/mobile-menu";
import { useTheme } from "@/hooks/use-theme";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const headerClass = `sticky top-0 z-50 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 transition-all ${
    isScrolled ? "shadow-sm" : ""
  }`;

  return (
    <header className={headerClass}>
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-10 h-10 bg-android-green rounded-full grid place-items-center text-white">
              <FaAndroid className="text-xl" />
            </div>
            <span className="font-inter font-bold text-xl">Sulton UzDev</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-8 font-medium">
          <li>
            <a 
              href="#about" 
              className={`hover:text-android-green dark:hover:text-android-green transition-colors ${
                location === "/#about" ? "text-android-green" : ""
              }`}
            >
              About
            </a>
          </li>
          <li>
            <a 
              href="#portfolio" 
              className={`hover:text-android-green dark:hover:text-android-green transition-colors ${
                location === "/#portfolio" ? "text-android-green" : ""
              }`}
            >
              Portfolio
            </a>
          </li>
          <li>
            <a 
              href="#blog" 
              className={`hover:text-android-green dark:hover:text-android-green transition-colors ${
                location === "/#blog" ? "text-android-green" : ""
              }`}
            >
              Blog
            </a>
          </li>
          <li>
            <a 
              href="#contact" 
              className={`hover:text-android-green dark:hover:text-android-green transition-colors ${
                location === "/#contact" ? "text-android-green" : ""
              }`}
            >
              Contact
            </a>
          </li>
        </ul>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5 text-yellow-400" />
            ) : (
              <MoonIcon className="h-5 w-5 text-slate-700" />
            )}
          </Button>

          {/* GitHub Link */}
          <a
            href="https://github.com/sultonuzdev"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2 rounded-full transition-colors"
          >
            <FaGithub />
            <span className="font-medium">GitHub</span>
          </a>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="md:hidden w-10 h-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={toggleMobileMenu} />
    </header>
  );
}
