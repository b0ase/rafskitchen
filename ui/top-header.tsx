'use client';

import { useChat } from '#/app/components/ChatProvider';
import { useState } from 'react';

export function TopHeader() {
  const { sendMessage } = useChat();
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="fixed top-0 z-30 flex w-full flex-col border-b border-gray-800 bg-black">
      <div className="flex h-14 items-center px-4">
        <form onSubmit={handleSubmit} className="flex w-full items-center">
          <span className="text-green-500 font-mono">$B0ASE ~ $</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 ml-2 bg-transparent text-gray-400 focus:outline-none font-mono"
            placeholder="Type your message..."
          />
        </form>
      </div>
    </div>
  );
}
