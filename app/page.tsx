'use client';

import { useState, useEffect } from 'react';
import OpenAI from 'openai';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [client, setClient] = useState<OpenAI | null>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_AIML_API_KEY) {
      setClient(new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_AIML_API_KEY,
        baseURL: 'https://api.aimlapi.com/v1',
        dangerouslyAllowBrowser: true
      }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !client) return;
    
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    
    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are $B0ASE, a helpful AI assistant. Keep responses concise and clear.' },
          ...messages,
          { role: 'user', content: input }
        ],
      });

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.choices[0]?.message?.content || 'Error: No response' 
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Error: Unable to process request' 
      }]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-emerald-500 font-mono text-lg mb-4">
          $B0ASE
        </div>

        {/* Welcome - only shown when no messages */}
        {messages.length === 0 && (
          <div className="text-white font-mono mb-8">
            Welcome to $B0ASE
          </div>
        )}

        {/* Chat */}
        <div className="space-y-4 mb-8">
          {messages.map((msg, i) => (
            <div key={i} className="font-mono">
              <div className={msg.role === 'assistant' ? 'text-emerald-500' : 'text-blue-500'}>
                {msg.role === 'assistant' ? '$B0ASE' : '> _'}
              </div>
              <div className="text-white mt-1">{msg.content}</div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit}>
          <div className="text-blue-500 font-mono">
            > <span className="animate-blink">_</span>
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-transparent text-white font-mono mt-1 focus:outline-none"
            disabled={isLoading}
            autoFocus
          />
        </form>

        {/* Loading state */}
        {isLoading && (
          <div className="font-mono mt-4">
            <div className="text-emerald-500">$B0ASE</div>
            <div className="text-white">thinking...</div>
          </div>
        )}
      </div>
    </div>
  );
}
