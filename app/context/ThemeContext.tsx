'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
  isMounted: boolean; // Add flag to indicate when client-side logic has run
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark'); // Default theme
  const [isMounted, setIsMounted] = useState(false); // Track mount status

  // Function to apply theme to the document root
  const applyTheme = useCallback((selectedTheme: Theme) => {
    const root = document.documentElement; 
    root.classList.remove('light', 'dark');
    root.classList.add(selectedTheme);
  }, []);

  useEffect(() => {
    setIsMounted(true); // Indicate component has mounted
    let initialTheme: Theme = 'dark'; // Default to dark

    try {
      const storedTheme = localStorage.getItem('theme') as Theme | null;
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      initialTheme = storedTheme || (prefersDark ? 'dark' : 'dark'); // Prefer stored, then system, then default dark
    } catch (e) {
      console.error("Could not access localStorage or window.matchMedia", e);
      // Keep default theme if localStorage/window access fails
    }
    
    setTheme(initialTheme);
    applyTheme(initialTheme);

  }, [applyTheme]); // Include applyTheme dependency

  const toggleTheme = () => {
    if (!isMounted) return; // Prevent toggle before mount

    setTheme(prevTheme => {
        const newTheme = prevTheme === 'light' ? 'dark' : 'light';
        try {
            localStorage.setItem('theme', newTheme);
        } catch (e) {
            console.error("Could not save theme to localStorage", e);
        }
        applyTheme(newTheme);
        return newTheme;
    });
  };

  // Return provider, pass isMounted state
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isMounted }}>
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