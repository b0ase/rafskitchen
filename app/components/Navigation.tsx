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

    if (isMenuOpen) {
      // Add listener when menu opens
      document.addEventListener('mousedown', handleClickOutside);
      // Also handle escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setIsMenuOpen(false);
      });
    }

    return () => {
      // Clean up listeners when menu closes
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleClickOutside);
    };
  }, [isMenuOpen, setIsMenuOpen]);

  return (
    <div className="relative z-50">
      {/* Clickable logo */}
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="text-white font-arial text-base md:text-2xl tracking-wider hover:text-emerald-500 transition-colors duration-200 relative z-50"
      >
        Connect Wallet
      </button>

      {/* Animated dropdown menu */}
      <div className={`fixed top-0 left-0 right-0 bg-black transition-all duration-300 ease-in-out z-40 ${
        isMenuOpen 
          ? 'opacity-95 h-screen'
          : 'opacity-0 h-0'
      }`}>
        <div className={`menu-items flex flex-col items-center px-8 md:px-32 pt-16 md:pt-32 space-y-8 transition-all duration-500 transform ${
          isMenuOpen
            ? 'translate-y-0 opacity-100'
            : '-translate-y-8 opacity-0'
        }`}>
          {/* Wallet Options */}
          <button className="text-white hover:text-emerald-500 text-xl md:text-3xl font-arial transition-colors duration-200">
            MetaMask
          </button>
          <button className="text-white hover:text-emerald-500 text-xl md:text-3xl font-arial transition-colors duration-200">
            HandCash
          </button>
          <button className="text-white hover:text-emerald-500 text-xl md:text-3xl font-arial transition-colors duration-200">
            Phantom
          </button>
          <button className="text-white hover:text-emerald-500 text-xl md:text-3xl font-arial transition-colors duration-200">
            XVerse
          </button>
        </div>
      </div>
    </div>
  );
} 