'use client';

import React from 'react';
import { Session } from '@supabase/supabase-js';
import Navbar from './Navbar'; // Assuming Navbar.tsx is in the same directory (app/components)
import SecondaryNavbar from './SecondaryNavbar'; // Assuming SecondaryNavbar.tsx is in the same directory
import Footer from './Footer'; // Assuming Footer.tsx is in the same directory
import UserSidebar from './UserSidebar'; // Assuming UserSidebar.tsx is in the same directory

interface ConditionalLayoutProps {
  session: Session | null;
  children: React.ReactNode;
}

export default function ConditionalLayout({ session, children }: ConditionalLayoutProps) {
  const isAuthenticated = !!session;

  if (isAuthenticated) {
    return (
      <div className="flex h-screen bg-black">
        <UserSidebar />
        <main className="flex-1 ml-64 overflow-y-auto">
          {children}
        </main>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <SecondaryNavbar /> {/* If you don't have a SecondaryNavbar, remove this line */}
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    );
  }
} 