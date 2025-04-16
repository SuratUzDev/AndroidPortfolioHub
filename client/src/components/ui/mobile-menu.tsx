import { useEffect } from 'react';
import { Link } from 'wouter';
import { FaGithub } from "react-icons/fa";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('#mobile-menu') && !target.closest('#mobile-menu-button')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle navigation click
  const handleNavClick = () => {
    onClose();
  };

  return (
    <div
      id="mobile-menu"
      className={`md:hidden fixed inset-0 z-50 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="absolute right-0 top-0 h-full w-72 bg-white dark:bg-dark-elevated border-l border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="font-semibold text-lg">Menu</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        
        <div className="p-4">
          <ul className="space-y-4 font-medium">
            <li>
              <a
                href="#about"
                className="block py-2 hover:text-android-green dark:hover:text-android-green transition-colors"
                onClick={handleNavClick}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#portfolio"
                className="block py-2 hover:text-android-green dark:hover:text-android-green transition-colors"
                onClick={handleNavClick}
              >
                Portfolio
              </a>
            </li>
            <li>
              <a
                href="#blog"
                className="block py-2 hover:text-android-green dark:hover:text-android-green transition-colors"
                onClick={handleNavClick}
              >
                Blog
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="block py-2 hover:text-android-green dark:hover:text-android-green transition-colors"
                onClick={handleNavClick}
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="https://github.com/johndoe"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 py-2 hover:text-android-green dark:hover:text-android-green transition-colors"
                onClick={handleNavClick}
              >
                <FaGithub />
                <span>GitHub</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
