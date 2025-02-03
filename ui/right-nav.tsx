'use client';

import { useSelectedLayoutSegment } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';
import { useState } from 'react';

const navigation = [
  {
    name: 'CONTENT',
    items: [
      { name: 'Photography', slug: 'photography' },
      { name: 'Art', slug: 'art' },
      { name: 'Writing', slug: 'writing' },
      { name: 'Music', slug: 'music' },
    ],
  },
  {
    name: 'CODE',
    items: [
      { name: 'Projects', slug: 'projects' },
      { name: 'Repositories', slug: 'repos' },
      { name: 'Experiments', slug: 'experiments' },
      { name: 'AI Systems', slug: 'ai' },
    ],
  },
  {
    name: 'BUSINESS',
    items: [
      { name: 'Ventures', slug: 'ventures' },
      { name: 'Consulting', slug: 'consulting' },
      { name: 'Services', slug: 'services' },
      { name: 'Portfolio', slug: 'portfolio' },
    ],
  },
];

export function RightNav() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <div className="fixed right-0 top-0 z-10 flex h-full w-72 flex-col border-l border-gray-800 bg-black">
      <div className="flex h-14 items-center px-4 py-4 lg:h-auto">
        <div className="font-semibold tracking-wide text-gray-400/80">
          CONTENT
        </div>
      </div>

      <div className="overflow-y-auto lg:static lg:block">
        <nav className="space-y-6 px-2 pb-24 pt-5">
          {navigation.map((section) => {
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
  const segment = useSelectedLayoutSegment();
  const isActive = item.slug === segment;

  return (
    <Link
      onClick={close}
      href={`/${item.slug}`}
      className={clsx(
        'block rounded-md px-3 py-2 text-sm font-medium hover:text-gray-300',
        {
          'text-gray-400 hover:bg-gray-800': !isActive,
          'text-white': isActive,
        },
      )}
    >
      {item.name}
    </Link>
  );
}
