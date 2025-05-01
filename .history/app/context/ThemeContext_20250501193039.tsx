'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark'); // Default to dark

  useEffect(() => {
    // Check localStorage for saved theme preference on initial load
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme based on storage or system preference (defaulting to dark)
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'dark'); // Still default dark
    setTheme(initialTheme);

    // Apply the theme class to the root element
    const root = window.document.documentElement;
    root.classList.remove(initialTheme === 'dark' ? 'light' : 'dark');
    root.classList.add(initialTheme);

  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    // Update the theme class on the root element
    const root = window.document.documentElement;
    root.classList.remove(theme); 
    root.classList.add(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 