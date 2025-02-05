'use client';

import { useState, useEffect } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Ignore clicks on the logo/toggle button
      if ((event.target as HTMLElement).closest('button')) return;
      
      // Ignore clicks on menu items
      if ((event.target as HTMLElement).closest('.menu-items a')) return;
      
      // Close menu for clicks anywhere else
      setIsOpen(false);
    };

    if (isOpen) {
      // Add listener when menu opens
      document.addEventListener('mousedown', handleClickOutside);
      // Also handle escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setIsOpen(false);
      });
    }

    return () => {
      // Clean up listeners when menu closes
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative z-50">
      {/* Clickable logo */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-white font-arial text-base md:text-2xl tracking-wider hover:text-emerald-500 transition-colors duration-200 relative z-50"
      >
        b0ase.com
      </button>

      {/* Animated dropdown menu */}
      <div className={`fixed top-0 left-0 right-0 bg-black transition-all duration-300 ease-in-out z-40 ${
        isOpen 
          ? 'opacity-95 h-screen'
          : 'opacity-0 h-0'
      }`}>
        <div className={`menu-items flex flex-col items-center pt-16 md:pt-32 space-y-8 transition-all duration-500 transform ${
          isOpen
            ? 'translate-y-0 opacity-100'
            : '-translate-y-8 opacity-0'
        }`}>
          <a href="#" className="text-white hover:text-emerald-500 text-xl md:text-3xl font-arial transition-colors duration-200">About</a>
          <a href="#" className="text-white hover:text-emerald-500 text-xl md:text-3xl font-arial transition-colors duration-200">Docs</a>
          <a href="#" className="text-white hover:text-emerald-500 text-xl md:text-3xl font-arial transition-colors duration-200">GitHub</a>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            className="text-white hover:text-emerald-500 mt-8 text-xl md:text-3xl font-arial transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 