'use client';

import '#/styles/globals.css';
import { ChatProvider, useChat } from './components/ChatProvider';
import { useState } from 'react';

function Terminal() {
  const { messages, isLoading, sendMessage } = useChat();
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };
  
  return (
    <div className="font-mono">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div key={index}>
            <span className="text-gray-400">{message.content}</span>
          </div>
        ))}
        {isLoading && (
          <div>
            <span className="text-gray-400 animate-pulse">_</span>
          </div>
        )}
        <div className="flex">
          <form onSubmit={handleSubmit} className="flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-transparent text-gray-400 font-mono appearance-none"
              style={{
                outline: 'none',
                border: 'none',
                boxShadow: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none'
              }}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark [color-scheme:dark]">
      <body className="relative min-h-screen bg-black text-gray-400">
        <ChatProvider>
          <div className="p-4">
            <Terminal />
            <div className="mt-4">{children}</div>
          </div>
        </ChatProvider>
      </body>
    </html>
  );
}
