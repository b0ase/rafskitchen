'use client';

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

export default function ThemeToggle() {
  const { theme, toggleTheme, isMounted } = useTheme();

  // Avoid rendering toggle based on initial state before mount
  if (!isMounted) {
    // Render a placeholder or null during server render/hydration
    // to avoid mismatch between server and client initial theme
    return <div className="w-6 h-6"></div>; // Placeholder with same size as button
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white"
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? <FaMoon size={18} /> : <FaSun size={18} />}
    </button>
  );
} 