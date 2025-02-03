'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function TopHeader() {
  const pathname = usePathname();
  const pageName =
    pathname === '/' ? 'index' : pathname?.split('/').pop() || 'index';
  const formattedPageName =
    pageName.charAt(0).toUpperCase() + pageName.slice(1);

  return (
    <div className="fixed left-0 right-0 top-0 z-20 h-14 border-b border-gray-800 bg-black">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xl font-bold text-gray-200">b0ase.com</span>
          </Link>
          <div className="text-sm font-medium text-gray-400">/</div>
          <div className="text-sm font-medium text-gray-100">
            {formattedPageName}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Add any right-side header items here if needed */}
        </div>
      </div>
    </div>
  );
}
