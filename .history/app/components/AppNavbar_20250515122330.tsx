import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PageContextType } from './UserSidebar';
import { FaHome, FaCog } from 'react-icons/fa';

interface AppNavbarProps {
  pageContext: PageContextType | null;
}

const formatBreadcrumbSegment = (segment: string) => {
  if (!segment) return '';
  return segment.replace(/-/g, ' ').replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function AppNavbar({ pageContext }: AppNavbarProps) {
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
  } else if (pathname === '/') {
    breadcrumbSegments.push({ text: "Dashboard", href: "/" });
    IconToShow = FaHome;
  } else {
    const pathSegments = pathname.replace(/^\/+/, '').split('/');
    let currentBuiltPath = '';
    pathSegments.forEach((segment, index) => {
      if (segment) {
        currentBuiltPath += `/${segment}`;
        breadcrumbSegments.push({
          text: formatBreadcrumbSegment(segment),
          href: currentBuiltPath
        });
      }
    });
    if (breadcrumbSegments.length === 0) {
        breadcrumbSegments.push({text: "App", href: "/"});
    }
    IconToShow = FaHome;
  }

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md h-24 flex items-center">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-2xl font-semibold flex items-center">
          {IconToShow && <IconToShow className="mr-3 h-7 w-7 flex-shrink-0 text-sky-500" />}
          {breadcrumbSegments.map((segment, index) => (
            <React.Fragment key={segment.href + index}>
              {index > 0 && <span className="text-gray-500 font-normal text-xl mx-1.5">/</span>}
              {index === breadcrumbSegments.length - 1 ? (
                <span className="text-white">{segment.text}</span>
              ) : (
                <Link href={segment.href} legacyBehavior>
                  <a className="hover:text-sky-300 transition-colors">{segment.text}</a>
                </Link>
              )}
            </React.Fragment>
          ))}
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