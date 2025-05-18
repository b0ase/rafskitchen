import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PageContextType } from './UserSidebar';
import { FaHome, FaCog } from 'react-icons/fa';

interface AppNavbarProps {
  pageContext: PageContextType | null;
  toggleSidebar: () => void;
}

const formatBreadcrumbSegment = (segment: string) => {
  if (!segment) return '';
  return segment.replace(/-/g, ' ').replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function AppNavbar({ pageContext, toggleSidebar }: AppNavbarProps) {
  const pathname = usePathname();

  let initialTitle = "App";
  let initialHref = "/";
  let IconToShow: React.ElementType | null = FaHome;
  const breadcrumbSegments: Array<{ text: string, href: string }> = [];

  if (pageContext) {
    initialTitle = pageContext.title;
    initialHref = pageContext.href;
    IconToShow = pageContext.icon || FaHome;
    
    breadcrumbSegments.push({ text: initialTitle, href: initialHref });

    if (pageContext.href && pathname.startsWith(pageContext.href) && pathname !== pageContext.href) {
      const subPath = pathname.substring(pageContext.href.length).replace(/^\/+/, '');
      if (subPath) {
        const subPathSegments = subPath.split('/');
        let currentPath = pageContext.href;
        if (currentPath !== '/' && currentPath.endsWith('/')) {
          currentPath = currentPath.slice(0, -1);
        }

        subPathSegments.forEach(segment => {
          currentPath = currentPath === '/' ? `/${segment}` : `${currentPath}/${segment}`;
          
          breadcrumbSegments.push({
            text: formatBreadcrumbSegment(segment),
            href: currentPath
          });
        });
      }
    }
    breadcrumbSegments.push({ text: "Dashboard", href: "/" });
    IconToShow = FaHome;
  } else {
    // Fallback for when pageContext is not available (e.g., direct navigation)
    breadcrumbSegments.push({ text: "Home", href: "/" }); // Always add a Home/Root breadcrumb
    IconToShow = FaHome; // Default icon for this case

    const pathSegments = pathname.replace(/^\/+/, '').split('/');
    let currentBuiltPath = ''; // Start from root for subsequent segments

    pathSegments.forEach((segment) => {
      if (segment) {
        currentBuiltPath += `/${segment}`;
        // Avoid duplicating Home if the first segment is for the root path (which shouldn't happen with replace(/^\/+/, ''))
        if (currentBuiltPath !== "/") { // Ensure we don't add another Home or empty segment
          breadcrumbSegments.push({
            text: formatBreadcrumbSegment(segment),
            href: currentBuiltPath
          });
        }
      }
    });

    // If after all this, breadcrumbSegments only contains "Home" and the path was not just "/", 
    // it means pathSegments was empty or only contained empty strings.
    // This case should ideally not happen if pathname is valid and not just "/".
    // If pathname is truly just "/", the "Dashboard" segment from the (pathname === '/') condition handles it.
    // If breadcrumbSegments is *still* just [{text: "Home", href: "/"}] and pathname is not "/", 
    // it implies the path was something like "///" which results in no useful segments.
    // In such an unusual case, just "Home" is fine. If the path was e.g. "/foo", it would be [Home, Foo].
  }

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md h-24 flex items-center">
      <div className="container mx-auto flex items-center justify-between">
        <button 
          onClick={toggleSidebar} 
          className="text-gray-300 hover:text-white focus:outline-none md:hidden mr-3"
          aria-label="Open sidebar"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>

        <div className="text-xl sm:text-2xl font-semibold flex items-center flex-grow min-w-0">
          {IconToShow && <IconToShow className="mr-2 sm:mr-3 h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0 text-sky-500" />}
          <div className="flex items-center overflow-hidden whitespace-nowrap">
            {breadcrumbSegments.map((segment, index) => (
              <React.Fragment key={segment.href + index}>
                {index > 0 && <span className="text-gray-500 font-normal text-base sm:text-xl mx-1 sm:mx-1.5">/</span>}
                {index === breadcrumbSegments.length - 1 ? (
                  <span className="text-white truncate">{segment.text}</span>
                ) : (
                  <Link href={segment.href} legacyBehavior>
                    <a className="hover:text-sky-300 transition-colors truncate">{segment.text}</a>
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        <div>
          <Link href="/settings" legacyBehavior>
            <a className="text-gray-300 hover:text-sky-400 transition-colors" title="Settings">
              <FaCog className="h-7 w-7" />
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
} 