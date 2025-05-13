'use client';

import React from 'react';
import { Session } from '@supabase/supabase-js';
import Header from './Header';
import SubNavigation from './SubNavigation';
import Footer from './Footer';
import UserSidebar from './UserSidebar';

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
        <main className="flex-1 ml-64 overflow-y-auto">
          {children}
        </main>
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