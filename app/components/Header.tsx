'use client';

import Navigation from './Navigation';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-black border-b border-gray-800 py-4 md:py-8 z-50">
      <div className="w-full px-4 max-w-[320px] mx-auto sm:max-w-none sm:w-[95%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%]">
        <div className="flex justify-between items-center">
          <Navigation />
          <a 
            href="http://www.x.com/b0ase" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white hover:text-emerald-500 transition-colors duration-200"
            aria-label="Follow us on X"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
} 