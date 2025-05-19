import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePageHeader, PageContextType } from '@/app/components/MyCtx';
import { FaHome, FaCog, FaBars, FaTimes } from 'react-icons/fa';

interface AppNavbarProps {
  toggleFullScreenMenu: () => void;
  isFullScreenMenuOpen: boolean;
}

const formatBreadcrumbSegment = (segment: string) => {
  if (!segment) return '';
  return segment.replace(/-/g, ' ').replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function AppNavbar({ toggleFullScreenMenu, isFullScreenMenuOpen }: AppNavbarProps) {
  const pathname = usePathname();
  const { pageContext } = usePageHeader();
  const breadcrumbSegments: Array<{ text: string, href: string }> = [];
  let IconToShow: React.ElementType | null = null;

  if (pageContext) {
    // Logic for when pageContext IS available (e.g., clicked a sidebar link)
    breadcrumbSegments.push({ text: pageContext.title, href: pageContext.href });
    IconToShow = pageContext.icon || FaHome;

    // Check for sub-paths beyond the pageContext's href
    if (pageContext.href && pathname.startsWith(pageContext.href) && pathname !== pageContext.href) {
      const subPath = pathname.substring(pageContext.href.length).replace(/^\/+/, '');
      if (subPath) {
        const subPathSegments = subPath.split('/');
        let currentSubPath = pageContext.href;
        // Ensure base path doesn't have trailing slash if not root, for correct concatenation
        if (currentSubPath !== '/' && currentSubPath.endsWith('/')) {
          currentSubPath = currentSubPath.slice(0, -1);
        }

        subPathSegments.forEach(segment => {
          if (segment) { // Avoid creating segments for empty parts (e.g., trailing slashes)
            currentSubPath = currentSubPath === '/' ? `/${segment}` : `${currentSubPath}/${segment}`;
            breadcrumbSegments.push({
              text: formatBreadcrumbSegment(segment),
              href: currentSubPath
            });
          }
        });
      }
    }
  } else {
    // Fallback logic for when pageContext is NOT available (e.g., direct URL navigation)
    IconToShow = FaHome; // Default icon for this case
    if (pathname === '/') {
      breadcrumbSegments.push({ text: "Dashboard", href: "/" });
    } else {
      // Add "Home" as the root breadcrumb for non-root paths
      breadcrumbSegments.push({ text: "Home", href: "/" });
      const pathSegments = pathname.replace(/^\/+/, '').split('/');
      let currentBuiltPath = ''; // Path built from root for subsequent segments

      pathSegments.forEach((segment) => {
        if (segment) {
          currentBuiltPath += `/${segment}`;
          breadcrumbSegments.push({
            text: formatBreadcrumbSegment(segment),
            href: currentBuiltPath
          });
        }
      });
    }
  }
  
  // Ensure there's at least one breadcrumb, defaulting to Home/Dashboard if somehow empty
  if (breadcrumbSegments.length === 0) {
      breadcrumbSegments.push({ text: "Dashboard", href: "/" });
      if (!IconToShow) IconToShow = FaHome;
  }

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md h-24 flex items-center sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between">
        <button 
          onClick={toggleFullScreenMenu}
          className="text-gray-300 hover:text-white focus:outline-none md:hidden mr-3"
          aria-label={isFullScreenMenuOpen ? "Close menu" : "Open menu"}
        >
          {isFullScreenMenuOpen ? <FaTimes className="w-7 h-7" /> : <FaBars className="w-7 h-7" />}
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