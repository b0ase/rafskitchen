import React from 'react';
import { ThemeProvider } from "../context/ThemeContext";
import '../globals.css';

// Stand-alone layout for previews - no shared layout with main site
export default function PreviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layouts should return the children, potentially wrapped
  // Do NOT include <html> or <body> here
  return (
    <ThemeProvider>
      {/* You might want a root div if styling is needed */} 
      <div className="bg-gray-900 min-h-screen">
        {children}
      </div>
    </ThemeProvider>
  );
} 