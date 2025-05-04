import React from 'react';
import { ThemeProvider } from "../context/ThemeContext";

// This layout applies only to routes within the (previews) group
// It does NOT include the main site navigation or structure.
export default function PreviewsLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        {children}
      </div>
    </ThemeProvider>
  );
} 