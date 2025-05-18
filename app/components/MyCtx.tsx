'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define PageContextType directly here
export interface PageContextType {
  title: string;
  href: string;
  icon?: React.ElementType; // Make icon optional to match UserSidebar.tsx usage
}

interface MyCtxProps {
  pageContext: PageContextType | null;
  setPageContext: (context: PageContextType | null) => void;
}

const MyCtxContext = createContext<MyCtxProps | undefined>(undefined);

export const MyCtxProvider = ({ children }: { children: ReactNode }) => {
  const [pageContext, setPageContextState] = useState<PageContextType | null>(null);

  const setPageContext = (context: PageContextType | null) => {
    setPageContextState(context);
  };

  return (
    <MyCtxContext.Provider value={{ pageContext, setPageContext }}>
      {children}
    </MyCtxContext.Provider>
  );
};

export const usePageHeader = () => {
  const context = useContext(MyCtxContext);
  if (context === undefined) {
    throw new Error('usePageHeader must be used within a MyCtxProvider');
  }
  return context;
}; 