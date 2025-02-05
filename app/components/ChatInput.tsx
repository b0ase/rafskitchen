'use client';

import { useChat } from './ChatProvider';
import { useState } from 'react';

export function ChatInput() {
  const { sendMessage } = useChat();
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 bg-transparent text-gray-400 font-mono appearance-none"
        placeholder="Type your message..."
        style={{
          outline: 'none',
          border: 'none',
          boxShadow: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none'
        }}
      />
    </form>
  );
} 