'use client';

import React, { useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import Header from './Header';
import SubNavigation from './SubNavigation';
import Footer from './Footer';
import UserSidebar, { PageContextType } from './UserSidebar';
import AppNavbar from './AppNavbar';

interface ConditionalLayoutProps {
  session: Session | null;
  children: React.ReactNode;
}

export default function ConditionalLayout({ session, children }: ConditionalLayoutProps) {
  console.log('[ConditionalLayout] Received session prop:', session);
  const isAuthenticated = !!session;
  const [pageContext, setPageContext] = React.useState<PageContextType | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const handleSetPageContext = useCallback((context: PageContextType | null) => {
    setPageContext(context);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  if (isAuthenticated) {
    return (
      <div className="flex h-screen bg-black">
        <UserSidebar 
          onSetPageContext={handleSetPageContext} 
          isSidebarOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
        />
        <div 
          className={`flex-1 flex flex-col overflow-hidden md:ml-64`}>
          <AppNavbar pageContext={pageContext} toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
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