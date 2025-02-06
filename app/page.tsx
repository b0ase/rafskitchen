'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import OpenAI from 'openai';
import Header from './components/Header';
import { useMenu } from './context/MenuContext';
import { SYSTEM_PROMPT, Message } from './context/AIContext';

const SYSTEM_MESSAGE: Message = {
  role: 'system',
  content: SYSTEM_PROMPT
};

export default function Home() {
  const { isMenuOpen } = useMenu();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [client, setClient] = useState<OpenAI | null>(null);
  const [isEditingContext, setIsEditingContext] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    setIsInitialized(true);
    
    try {
      setClient(new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_AIML_API_KEY || 'dummy-key',
        baseURL: 'https://api.aimlapi.com/v1',
        dangerouslyAllowBrowser: true
      }));
    } catch (error) {
      console.error('OpenAI initialization error:', error);
    }
  }, []);

  useEffect(() => {
    // Only run on mobile
    if (window.innerWidth < 768) {
      const showKeyboard = () => {
        if (inputRef.current) {
          inputRef.current.focus();
          // Force keyboard to show
          inputRef.current.readOnly = false;
          inputRef.current.click();
        }
      };

      showKeyboard();

      // Show keyboard again after any visibility changes (e.g., app switching)
      document.addEventListener('visibilitychange', showKeyboard);
      return () => document.removeEventListener('visibilitychange', showKeyboard);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      // Check if we're on mobile
      if (window.innerWidth < 768) {
        // Adjust viewport height when keyboard opens
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once on mount
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !client || !isInitialized) return;
    
    const userInput = input;
    setIsLoading(true);

    // Handle context editing command
    if (userInput.toLowerCase() === 'edit context') {
      setMessages(prev => [...prev,
        { role: 'user', content: userInput },
        { role: 'assistant', content: 'Password?' }
      ]);
      setInput('');
      setIsLoading(false);
      return;
    }

    // Check if user wants to exit context mode
    if (isEditingContext && userInput.toLowerCase() === 'done') {
      setIsEditingContext(false);
      setMessages(prev => [...prev,
        { role: 'user', content: userInput },
        { role: 'assistant', content: 'Context editing mode ended.' }
      ]);
      setInput('');
      setIsLoading(false);
      return;
    }

    // Check if previous message was password prompt
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant' && lastMessage.content === 'Password?') {
      if (userInput === process.env.NEXT_PUBLIC_EDIT_CONTEXT_PASSWORD) {
        setIsEditingContext(true);
        setMessages(prev => [...prev,
          { role: 'user', content: '********' },
          { role: 'assistant', content: 'Password accepted. You can now teach me. Type "done" when finished.' }
        ]);
        setInput('');
        setIsLoading(false);
        return;
      } else {
        setMessages(prev => [...prev,
          { role: 'user', content: '********' },
          { role: 'assistant', content: 'Incorrect password. Access denied.' }
        ]);
        setInput('');
        setIsLoading(false);
        return;
      }
    }

    // Handle context update
    if (isEditingContext) {
      try {
        // Store the lecture
        const lecture = userInput.trim();
        let contextUpdate = {
          lecture: {
            content: lecture,
            timestamp: new Date().toISOString()
          }
        };
        
        setMessages(prev => [...prev,
          { role: 'user', content: userInput },
          { role: 'assistant', content: 'I understand. Please continue teaching me, or type "done" when finished.' }
        ]);
      } catch (error) {
        setMessages(prev => [...prev,
          { role: 'user', content: userInput },
          { role: 'assistant', content: 'I didn\'t quite understand that. Could you rephrase it?' }
        ]);
      }
      setInput('');
      setIsLoading(false);
      return;
    }

    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4',
        messages: [SYSTEM_MESSAGE, ...messages, { role: 'user', content: userInput }],
      });

      setMessages(prev => [...prev, 
        { role: 'user', content: userInput },
        { role: 'assistant', content: response.choices[0]?.message?.content || 'Error: No response received' }
      ]);
      
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
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-emerald-500 text-xl">Initializing...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[calc(var(--vh,1vh)*100)] bg-black flex flex-col">
      <Header />
      <main className="flex-1 overflow-y-auto relative px-4 max-w-[320px] mx-auto sm:max-w-none sm:w-[95%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] pt-16 sm:pt-24 md:pt-32">
        {/* Message history and current input */}
        <div className="space-y-8 pb-16 sm:pb-8">
          {messages.map((msg, i) => (
            <div key={i} className="font-arial">
              {msg.role === 'assistant' ? (
                <div className="text-emerald-500 text-lg sm:text-xl md:text-2xl tracking-wide pl-4 sm:pl-6 break-words">
                  {msg.content}
                </div>
              ) : (
                <div className="flex text-blue-500 text-lg sm:text-xl md:text-2xl tracking-wide">
                  <span>{'>'}</span>
                  <span className="pl-4 sm:pl-6">{msg.content}</span>
                </div>
              )}
            </div>
          ))}

          {/* Current input form */}
          {!isMenuOpen && (
            <div className="relative">
              <form onSubmit={handleSubmit} className="w-full">
                <div className="flex items-start text-blue-500 font-arial text-lg sm:text-2xl md:text-3xl tracking-wide">
                  <span className="pt-1">{'>'}</span>
                  {isMobile ? (
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-1 bg-transparent text-blue-500 font-arial focus:outline-none pl-2 py-1 resize-none"
                      disabled={isLoading}
                      autoFocus
                      rows={1}
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e as any);
                        }
                      }}
                    />
                  ) : (
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-1 bg-transparent text-blue-500 font-arial focus:outline-none pl-2 py-1"
                      disabled={isLoading}
                      autoFocus
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                    />
                  )}
                </div>
              </form>
              {isLoading && (
                <div className="font-arial mt-4">
                  <div className="text-emerald-500 text-lg sm:text-2xl md:text-3xl tracking-wide pl-4 sm:pl-6">thinking...</div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
