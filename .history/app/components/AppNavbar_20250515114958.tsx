import React from 'react';
import { usePathname } from 'next/navigation';
import { PageContextType } from './UserSidebar';
import { FaHome } from 'react-icons/fa';

interface AppNavbarProps {
  pageContext: PageContextType | null;
}

const formatSubPath = (subPath: string) => {
  if (!subPath) return '';
  return subPath
    .split('/')
    .map(segment => segment.replace(/-/g, ' ').replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '))
    .join(' / ');
};

export default function AppNavbar({ pageContext }: AppNavbarProps) {
  const pathname = usePathname();

  let titleToShow = "App";
  let IconToShow: React.ElementType | null = FaHome;
  let subPathString = '';

  if (pageContext) {
    titleToShow = pageContext.title;
    IconToShow = pageContext.icon || FaHome;
    
    if (pageContext.href && pathname.startsWith(pageContext.href) && pathname !== pageContext.href) {
      const extractedSubPath = pathname.substring(pageContext.href.length).replace(/^\/+/, '');
      if (extractedSubPath) {
        subPathString = formatSubPath(extractedSubPath);
      }
    }
  } else if (pathname === '/') {
    titleToShow = "Dashboard";
  }

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md h-16 flex items-center">
      <div className="container mx-auto flex items-center">
        <div className="text-xl font-semibold flex items-center">
          {IconToShow && <IconToShow className="mr-3 h-5 w-5 flex-shrink-0" />}
          <span>{titleToShow}</span>
          {subPathString && <span className="text-gray-400 font-normal text-lg ml-2"> / {subPathString}</span>}
        </div>
      </div>
    </nav>
  );
} 