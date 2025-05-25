import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePageHeader, PageContextType } from '@/app/components/MyCtx';
import { FaHome, FaCog, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { navLinksPrimaryConst } from '@/app/components/UserSidebar'; // Import links
import getSupabaseBrowserClient from '@/lib/supabase/client'; // For logout

interface AppNavbarProps {
  toggleFullScreenMenu: () => void;
  isFullScreenMenuActuallyOpen: boolean;
}

const formatBreadcrumbSegment = (segment: string) => {
  if (!segment) return '';
  return segment.replace(/-/g, ' ').replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function AppNavbar({ 
  toggleFullScreenMenu,
  isFullScreenMenuActuallyOpen
}: AppNavbarProps) {
  const pathname = usePathname();
  const { pageContext } = usePageHeader();
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = React.useState(false);
  const supabase = getSupabaseBrowserClient(); // For logout

  const toggleMobileDropdown = () => {
    setIsMobileDropdownOpen(!isMobileDropdownOpen);
  };

  const closeMobileDropdown = () => { // Function to ensure dropdown closes
    setIsMobileDropdownOpen(false);
  };
  
  const handleLogout = async () => {
    closeMobileDropdown(); // Close dropdown first
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      try {
        const urlParts = supabaseUrl.split('//');
        if (urlParts.length > 1) {
          const domainParts = urlParts[1].split('.');
          if (domainParts.length > 0) {
            const projectRef = domainParts[0];
            const supabaseAuthTokenKey = `sb-${projectRef}-auth-token`;
            localStorage.removeItem(supabaseAuthTokenKey);
          }
        }
      } catch (e) { /* Silently fail on local storage error */ }
    }
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
          localStorage.removeItem(key);
      }
    });
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('isLoggingOut', 'true');
    }
    await supabase.auth.signOut();
    window.location.assign('/'); 
  };

  const breadcrumbSegments: Array<{ text: string, href: string }> = [];
  let IconToShow: React.ElementType | null = null;

  if (pageContext) {
    breadcrumbSegments.push({ text: pageContext.title, href: pageContext.href });
    IconToShow = pageContext.icon || FaHome;
    if (pageContext.href && (pathname ?? '').startsWith(pageContext.href) && pathname !== pageContext.href) {
      const subPath = (pathname ?? '').substring(pageContext.href.length).replace(/^\/+/, '');
      if (subPath) {
        const subPathSegments = subPath.split('/');
        let currentSubPath = pageContext.href;
        if (currentSubPath !== '/' && currentSubPath.endsWith('/')) {
          currentSubPath = currentSubPath.slice(0, -1);
        }
        subPathSegments.forEach(segment => {
          if (segment) {
            currentSubPath = currentSubPath === '/' ? `/${segment}` : `${currentSubPath}/${segment}`;
            breadcrumbSegments.push({ text: formatBreadcrumbSegment(segment), href: currentSubPath });
          }
        });
      }
    }
  } else {
    IconToShow = FaHome;
    if (pathname === '/') {
      breadcrumbSegments.push({ text: "Profile", href: "/profile" });
    } else {
      breadcrumbSegments.push({ text: "Home", href: "/profile" });
      const pathSegments = (pathname ?? '').replace(/^\/+/, '').split('/');
      let currentBuiltPath = '';
      pathSegments.forEach((segment) => {
        if (segment) {
          currentBuiltPath += `/${segment}`;
          breadcrumbSegments.push({ text: formatBreadcrumbSegment(segment), href: currentBuiltPath });
        }
      });
    }
  }
  if (breadcrumbSegments.length === 0) {
      breadcrumbSegments.push({ text: "Profile", href: "/profile" });
      if (!IconToShow) IconToShow = FaHome;
  }

  return (
    <nav className="bg-white text-gray-800 sticky top-0 z-40 border-b border-gray-200 shadow-sm">
      {/* Main Navbar Content Bar */}
      <div className="container mx-auto flex items-center justify-between p-4 h-[92px]">
        <button 
          onClick={toggleFullScreenMenu}
          className="text-gray-500 hover:text-blue-600 focus:outline-none md:hidden mr-3"
          aria-label={isFullScreenMenuActuallyOpen ? "Close menu" : "Open menu"}
        >
          {isFullScreenMenuActuallyOpen ? <FaTimes className="w-7 h-7" /> : <FaBars className="w-7 h-7" />}
        </button>

        <div className="flex items-center flex-grow min-w-0">
          {IconToShow && <IconToShow className="mr-2 sm:mr-3 h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0 text-gray-500" />}
          <div className="flex items-center overflow-hidden whitespace-nowrap">
            {breadcrumbSegments.map((segment, index) => (
              <React.Fragment key={segment.href + index}>
                {index > 0 && <span className="text-gray-400 font-normal text-base sm:text-xl mx-1 sm:mx-1.5">/</span>}
                {index === breadcrumbSegments.length - 1 ? (
                  <span className="text-gray-800 truncate font-semibold">{segment.text}</span>
                ) : (
                  <Link href={segment.href} legacyBehavior>
                    <a className="text-gray-500 hover:text-blue-600 transition-colors truncate">{segment.text}</a>
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        <div>
          {/* Placeholder for potential right-side elements like user menu, notifications */}
        </div>
      </div>
      {/* Mobile Dropdown Menu */}
      {isMobileDropdownOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-200">
          <div className="container mx-auto p-4">
            <ul className="space-y-2">
              {navLinksPrimaryConst.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} legacyBehavior>
                    <a 
                      onClick={closeMobileDropdown}
                      className="flex items-center p-3 text-base rounded-md transition-all duration-150 ease-in-out group hover:bg-gray-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-700"
                    >
                      {link.icon && <link.icon className="w-5 h-5 mr-3 text-gray-500 group-hover:text-blue-600 transition-colors duration-150" />}
                      {link.title}
                    </a>
                  </Link>
                </li>
              ))}
              {/* Logout Button in Dropdown */}
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center p-3 text-base rounded-md font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 group"
                >
                  <FaSignOutAlt className="w-5 h-5 mr-3 text-red-500 group-hover:text-red-600 transition-colors duration-150" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
} 