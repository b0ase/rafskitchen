'use client';

import { useState, useEffect, useMemo } from 'react';
import OpenAI from 'openai';
import Header from './components/Header';
import { useMenu } from './context/MenuContext';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const SYSTEM_MESSAGE: Message = {
  role: 'system',
  content: 'You are $B0ASE, a helpful AI assistant. Keep responses concise and clear.'
};

export default function Home() {
  const { isMenuOpen, setIsMenuOpen } = useMenu();
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
      <Header />
      <main className="relative w-full px-4 max-w-[320px] mx-auto sm:max-w-none sm:w-[95%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] pt-24 md:pt-32">
        {/* Initial messages */}
        <div className="space-y-6 mb-8 mt-4 md:mt-12">
          <div className="font-arial">
            <div className="text-emerald-500 text-base md:text-2xl lg:text-3xl tracking-wide pl-6">
              <button 
                onClick={() => setIsMenuOpen(true)} 
                className="hover:text-white transition-colors duration-200"
              >
                Connect wallet to start.
              </button>
            </div>
          </div>
        </div>

        {/* Message history */}
        <div className="space-y-8 mb-8">
          {messages.map((msg, i) => (
            <div key={i} className="font-arial">
              {msg.role === 'assistant' ? (
                <div className="text-emerald-500 text-base md:text-2xl lg:text-3xl tracking-wide pl-6 break-words">
                  {msg.content}
                </div>
              ) : (
                <div className="flex text-blue-500 text-base md:text-2xl lg:text-3xl tracking-wide">
                  <span>{'>'}</span>
                  <span className="pl-6">{msg.content}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input form - hidden when menu is open */}
        {!isMenuOpen && (
          <form onSubmit={handleSubmit} className="w-full mb-8">
            <div className="flex items-start text-blue-500 font-arial text-base md:text-2xl lg:text-3xl tracking-wide">
              <span>{'>'}</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent text-blue-500 font-arial focus:outline-none pl-2"
                disabled={isLoading}
                autoFocus
                aria-label="Chat input"
                role="textbox"
                onBlur={(e) => e.target.focus()}
              />
            </div>
          </form>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="font-arial mt-4">
            <div className="text-emerald-500 text-base md:text-2xl lg:text-3xl tracking-wide pl-6">thinking...</div>
          </div>
        )}
      </main>
    </div>
  );
}
