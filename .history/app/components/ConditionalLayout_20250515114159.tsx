'use client';

import React from 'react';
import { Session } from '@supabase/supabase-js';
import Header from './Header';
import SubNavigation from './SubNavigation';
import Footer from './Footer';
import UserSidebar from './UserSidebar';
import AppNavbar from './AppNavbar';

interface ConditionalLayoutProps {
  session: Session | null;
  children: React.ReactNode;
}

export default function ConditionalLayout({ session, children }: ConditionalLayoutProps) {
  console.log('[ConditionalLayout] Received session prop:', session);
  const isAuthenticated = !!session;

  if (isAuthenticated) {
    return (
      <div className="flex h-screen bg-black">
        <UserSidebar />
        <div className="flex-1 flex flex-col ml-64 overflow-hidden">
          <AppNavbar />
          <main className="flex-1 overflow-y-auto p-4">
            {children}
          </main>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <SubNavigation />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    );
  }
} 