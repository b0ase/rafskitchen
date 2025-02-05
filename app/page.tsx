'use client';

import { useState, useEffect, useMemo } from 'react';
import OpenAI from 'openai';
import Navigation from './components/Navigation';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const SYSTEM_MESSAGE: Message = {
  role: 'system',
  content: 'You are $B0ASE, a helpful AI assistant. Keep responses concise and clear.'
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [client, setClient] = useState<OpenAI | null>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_AIML_API_KEY) {
      setClient(new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_AIML_API_KEY,
        baseURL: 'https://api.aimlapi.com/v1',
        dangerouslyAllowBrowser: true
      }));
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    // Auto-focus the input when component mounts or after loading state changes
    const input = document.querySelector('input');
    if (input && !isLoading) {
      input.focus();
    }
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !client || !isInitialized) return;
    
    const userInput = input;
    setIsLoading(true);
    
    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4',
        messages: [SYSTEM_MESSAGE, ...messages, { role: 'user', content: userInput }],
      });

      // Add both messages after response
      setMessages(prev => [...prev, 
        { role: 'user', content: userInput },
        { role: 'assistant', content: response.choices[0]?.message?.content || 'Error: No response received' }
      ]);
      
      // Only clear input AFTER we've added the messages
      setInput('');
    } catch (error) {
      console.error('API Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const messageElements = useMemo(() => (
    <div className="space-y-4 mb-8">
      {messages.map((msg, i) => (
        <div key={i} className="font-mono">
          {msg.role === 'assistant' ? (
            <>
              <div className="text-emerald-500">$B0ASE</div>
              <div className="text-emerald-500 mt-1 text-sm sm:text-base break-words">
                {msg.content}
              </div>
            </>
          ) : (
            <div className="flex text-blue-500 text-sm sm:text-base">
              <span>{'>'}</span>
              <span className="ml-2">{msg.content}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  ), [messages]);

  if (!isInitialized) {
    return <div className="text-white">Initializing...</div>;
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="fixed top-0 left-0 right-0 bg-black border-b border-gray-800 py-4">
        <div className="w-full px-4 max-w-[320px] mx-auto sm:max-w-none sm:w-[95%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%]">
          <div className="flex justify-between items-center">
            <div className="text-white font-mono">b0ase.com</div>
            <Navigation />
          </div>
        </div>
      </header>

      <div className="w-full px-4 max-w-[320px] mx-auto sm:max-w-none sm:w-[95%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] pt-16">
        <div className="text-emerald-500 font-mono text-lg sm:text-xl pt-4 sm:pt-8 pb-4">
          $B0ASE
        </div>

        {messages.length === 0 && (
          <div className="text-white font-mono mb-8 text-sm sm:text-base">
            Welcome to $B0ASE
          </div>
        )}

        {messageElements}

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-center text-blue-500 font-mono text-sm sm:text-base">
            {'>'} 
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent text-blue-500 font-mono focus:outline-none text-sm sm:text-base ml-1"
              disabled={isLoading}
              autoFocus
              aria-label="Chat input"
              role="textbox"
              onBlur={(e) => e.target.focus()}
            />
          </div>
        </form>

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
