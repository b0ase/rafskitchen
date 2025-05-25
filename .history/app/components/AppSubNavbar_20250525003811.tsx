'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaPlusSquare, FaUsers, FaProjectDiagram, FaUserPlus, FaBriefcase, FaRocket, FaCubes, FaUserSecret, FaUserShield } from 'react-icons/fa';

const navLinks = [
  { href: '/projects/new', label: 'Start a Project', icon: FaPlusSquare },
  { href: '/teams/new', label: 'Create a Team', icon: FaUsers },
  { href: '/projects/join', label: 'Join a Project', icon: FaProjectDiagram },
  { href: '/teams/join', label: 'Join a Team', icon: FaUserPlus },
  { href: '/myagents', label: 'Create an Agent', icon: FaUserSecret },
  { href: '/mytoken', label: 'Launch a Token', icon: FaCubes },
];

const welcomeSubtitle = "Welcome! This is your innovation hub. Start a new project, collaborate with your team, and bring your ideas to life. Whether it's a new application, a platform, or a creative endeavor, we're here to help you succeed.";

interface AppSubNavbarProps {
  user: any;
}

export default function AppSubNavbar({ user }: AppSubNavbarProps) {
  const pathname = usePathname() ?? '';
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768); // md breakpoint
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const linkContainerClasses = 'flex flex-wrap items-center gap-2 p-2 justify-start';

  return (
    <div className={`bg-white text-gray-700 sticky top-[92px] z-30 transition-all duration-300 ease-in-out border-t border-gray-200 shadow-sm`}>
      <div className="container mx-auto px-2 sm:px-4">
        {isDesktop && (
          <div className={`flex items-center py-2.5 sm:py-3`}>
            <div className={`flex-grow ${linkContainerClasses}`}>
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/');
                const buttonBaseClasses = `px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out border min-w-fit`;
                const activeClasses = 'bg-blue-600 text-white border-blue-500 shadow-md hover:bg-blue-700';
                const inactiveClasses = 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 hover:border-gray-300 hover:text-black shadow-sm';
                
                const layoutClasses = 'flex-shrink-0 flex items-center justify-center mx-1';

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`${buttonBaseClasses} ${isActive ? activeClasses : inactiveClasses} ${layoutClasses}`}
                  >
                    <link.icon className={`h-4 w-4 mr-2 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    <span className="whitespace-nowrap">{link.label}</span>
                  </Link>
                );
              })}
              {user?.email === 'richardwboase@gmail.com' && pathname === '/team' && (
                  <Link href="/teammanagement" passHref legacyBehavior>
                    <a className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 hover:border-gray-300 font-semibold py-2.5 px-3 rounded-md transition-colors duration-150 ease-in-out whitespace-nowrap shadow-sm">
                      <FaUserShield className="mr-2 h-4 w-4 text-gray-600" />
                      Admin: Manage All Teams
                    </a>
                  </Link>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 