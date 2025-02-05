'use client';

import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessages = [
      ...messages,
      { role: 'user', content: input }
    ];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      
      if (data.choices?.[0]?.message) {
        setMessages([...newMessages, data.choices[0].message]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-mono">
      <div className="space-y-4 mb-4">
        {messages.map((message, index) => (
          <div key={index} className="flex">
            <span className={message.role === 'user' ? 'text-green-500' : 'text-blue-500'}>
              {message.role === 'user' ? '$B0ASE ~ $' : 'AI >'}
            </span>
            <span className="text-gray-400 ml-2">{message.content}</span>
          </div>
        ))}
        {isLoading && (
          <div className="flex">
            <span className="text-blue-500">AI ></span>
            <span className="text-gray-400 ml-2">_</span>
          </div>
        )}
      </div>
      
      <form onSubmit={sendMessage} className="flex items-center">
        <span className="text-green-500">$B0ASE ~ $</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 ml-2 bg-transparent text-gray-400 focus:outline-none"
          placeholder="Type your message..."
        />
      </form>
    </div>
  );
} 