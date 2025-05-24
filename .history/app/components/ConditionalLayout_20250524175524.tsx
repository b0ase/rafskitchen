'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import SubNavigation from './SubNavigation';
import Footer from './Footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

// Define paths that should use a completely minimal layout (no header/footer)
const minimalLayoutPathPrefixes = [
  '/skills'
];

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname() ?? '';

  // Check for minimal layout paths first
  const isMinimalPage = minimalLayoutPathPrefixes.some(prefix => pathname.startsWith(prefix));
  if (isMinimalPage) {
    return <>{children}</>;
  }

  // For all other pages, just use the simple public layout
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <SubNavigation />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}