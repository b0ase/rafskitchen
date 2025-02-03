'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { useState } from 'react';

// Empty user navigation structure - we can populate this later
const userNavigation = [
  {
    name: 'USER',
    items: [
      // We'll add items here later
    ],
  },
];

export function GlobalNav() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <div className="fixed left-0 top-0 z-10 flex h-full w-72 flex-col border-r border-gray-800 bg-black">
      <div className="flex h-14 items-center px-4 py-4 lg:h-auto">
        <div className="font-semibold tracking-wide text-gray-400/80">User</div>
      </div>

      <div className="overflow-y-auto lg:static lg:block">
        <nav className="space-y-6 px-2 pb-24 pt-5">
          {userNavigation.map((section) => {
            return (
              <div key={section.name}>
                <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400/80">
                  <div>{section.name}</div>
                </div>

                <div className="space-y-1">
                  {section.items.map((item) => (
                    <GlobalNavItem key={item.slug} item={item} close={close} />
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function GlobalNavItem({
  item,
  close,
}: {
  item: { name: string; slug: string };
  close: () => void;
}) {
  return (
    <Link
      onClick={close}
      href={`/${item.slug}`}
      className="block rounded-md px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-gray-300"
    >
      {item.name}
    </Link>
  );
}
