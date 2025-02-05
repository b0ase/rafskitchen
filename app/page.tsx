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
    // Initialize OpenAI client after component mounts
    const apiKey = process.env.NEXT_PUBLIC_AIML_API_KEY;
    console.log('API Key available:', !!apiKey); // Debug log
    
    if (apiKey) {
      const openai = new OpenAI({
        apiKey: apiKey,
        baseURL: 'https://api.aimlapi.com/v1',
        dangerouslyAllowBrowser: true
      });
      setClient(openai);
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
          {
            role: 'system',
            content: 'You are $B0ASE, a helpful AI assistant. Keep responses concise and clear.'
          },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          { role: 'user', content: input }
        ],
      });

      const aiResponse = response.choices[0]?.message?.content || 'Sorry, I could not process that.';
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request.' 
      }]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-black border-b border-gray-800 z-10">
        <div className="container mx-auto max-w-2xl px-4 py-4">
          <div className="text-xl font-mono text-emerald-500 font-bold">$B0ASE</div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pt-16"> {/* Added padding-top to account for fixed header */}
        <div className="container mx-auto max-w-2xl px-4 py-8 pb-24">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className="rounded-lg p-4 bg-gray-900">
                <div className="text-sm text-gray-400 mb-2">
                  {message.role === 'assistant' ? '$B0ASE' : 'user'}
                </div>
                <div className="text-white">{message.content}</div>
              </div>
            ))}
            {isLoading && (
              <div className="rounded-lg p-4 bg-gray-900">
                <div className="text-sm text-gray-400 mb-2">$B0ASE</div>
                <div className="text-white">thinking...</div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Input form */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black border-t border-gray-800">
        <div className="container mx-auto max-w-2xl">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="user"
              disabled={isLoading}
              className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg p-4 focus:outline-none focus:border-gray-500"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
