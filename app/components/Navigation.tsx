'use client';

import { useEffect } from 'react';
import { useMenu } from '../context/MenuContext';

export default function Navigation() {
  const { isMenuOpen, setIsMenuOpen } = useMenu();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Ignore clicks on the logo/toggle button
      if ((event.target as HTMLElement).closest('button')) return;
      
      // Ignore clicks on menu items
      if ((event.target as HTMLElement).closest('.menu-items a')) return;
      
      // Close menu for clicks anywhere else
      setIsMenuOpen(false);
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };

    if (isMenuOpen) {
      // Add listener when menu opens
      document.addEventListener('mousedown', handleClickOutside);
      // Also handle escape key
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      // Clean up listeners when menu closes
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMenuOpen, setIsMenuOpen]);

  return (
    <div className="relative z-50">
      {/* Clickable logo */}
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="text-white font-arial text-base md:text-2xl tracking-wider hover:text-emerald-500 transition-colors duration-200 relative z-50"
      >
        Connect
      </button>

      {/* Animated dropdown menu */}
      <div className={`fixed top-0 left-0 right-0 bg-black transition-all duration-300 ease-in-out z-40 ${
        isMenuOpen 
          ? 'opacity-95 h-screen'
          : 'opacity-0 h-0'
      }`}>
        <div className={`menu-items flex flex-col items-start pt-32 md:pt-48 space-y-8 transition-all duration-500 transform ${
          isMenuOpen
            ? 'translate-y-0 opacity-100'
            : '-translate-y-8 opacity-0'
        }`}>
          {/* Domain Section */}
          <div className="w-full px-8 md:container md:mx-auto flex flex-col items-start space-y-8 md:pl-[calc(20%+1rem)]">
            <button className="text-white hover:text-emerald-500 text-xl md:text-3xl font-arial transition-colors duration-200">
              $B0ASE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 