import React from 'react';
import { ThemeProvider } from "../context/ThemeContext";
import '../globals.css';

// Stand-alone layout for previews - no shared layout with main site
export default function PreviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-900">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
} 