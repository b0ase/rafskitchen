'use client';

import { useState } from 'react';
import { CollapseButton } from './collapse-button';

export function GlobalNav() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`fixed left-0 top-0 z-10 flex h-full flex-col border-r border-gray-800 bg-black transition-all ${isCollapsed ? 'w-0' : 'w-72'}`}>
      <div className="flex h-14 items-center px-4 py-4 lg:h-auto">
        <div className="font-semibold tracking-wide text-gray-400/80">Global</div>
      </div>
      <CollapseButton isCollapsed={isCollapsed} onClick={() => setIsCollapsed(!isCollapsed)} direction="right" />
    </div>
  );
}
