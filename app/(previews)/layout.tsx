import React from 'react';

// This layout applies only to routes within the (previews) group
// It does NOT include the main site navigation or structure.
export default function PreviewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>; // Render only the children (the preview page)
} 