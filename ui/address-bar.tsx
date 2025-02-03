'use client';

import { usePathname } from 'next/navigation';

export function AddressBar() {
  const pathname = usePathname();
  const pageName = pathname?.split('/').pop() || 'home';
  const formattedPageName =
    pageName.charAt(0).toUpperCase() + pageName.slice(1);

  return (
    <div className="flex items-center gap-x-2 p-3.5 lg:px-5 lg:py-3">
      <div className="flex gap-x-1 text-sm font-medium">
        <div className="text-gray-100">{formattedPageName}</div>
      </div>
    </div>
  );
}
