'use client';

interface CollapseButtonProps {
  isCollapsed: boolean;
  onClick: () => void;
  direction?: 'left' | 'right' | 'up' | 'down';
}

export function CollapseButton({ isCollapsed, onClick, direction = 'left' }: CollapseButtonProps) {
  const getRotation = () => {
    switch (direction) {
      case 'right': return 'rotate-180';
      case 'up': return '-rotate-90';
      case 'down': return 'rotate-90';
      default: return '';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`absolute p-1 rounded-full hover:bg-gray-800 transition-colors ${
        isCollapsed 
          ? direction === 'left' ? 'left-2' : 'right-2' 
          : direction === 'left' ? '-right-3' : '-left-3'
      }`}
      style={{
        top: '50%',
        transform: 'translateY(-50%)'
      }}
    >
      <svg
        className={`h-4 w-4 text-gray-400 transform ${getRotation()} ${isCollapsed ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
}