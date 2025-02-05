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
    <div className="min-h-screen bg-black px-2 sm:px-6 md:px-8 lg:px-12">
      <div className="mx-auto w-[98%] sm:w-[95%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%]">
        {/* Header */}
        <div className="text-emerald-500 font-mono text-lg sm:text-xl pt-4 sm:pt-8 pb-4">
          $B0ASE
        </div>

        {/* Welcome - only shown when no messages */}
        {messages.length === 0 && (
          <div className="text-white font-mono mb-8 text-sm sm:text-base">
            Welcome to $B0ASE
          </div>
        )}

        {/* Chat */}
        <div className="space-y-4 mb-8">
          {messages.map((msg, i) => (
            <div key={i} className="font-mono">
              <div className={msg.role === 'assistant' ? 'text-emerald-500' : 'text-blue-500'}>
                {msg.role === 'assistant' ? '$B0ASE' : '>'}
              </div>
              <div className="text-white mt-1 text-sm sm:text-base break-words">
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="text-blue-500 font-mono text-sm sm:text-base">
            {'>'} <span className="animate-blink">_</span>
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-transparent text-white font-mono mt-1 focus:outline-none text-sm sm:text-base"
            disabled={isLoading}
            autoFocus
          />
        </form>

        {/* Loading state */}
        {isLoading && (
          <div className="font-mono mt-4 text-sm sm:text-base">
            <div className="text-emerald-500">$B0ASE</div>
            <div className="text-white">thinking...</div>
          </div>
        )}
      </div>
    </div>
  );
}
