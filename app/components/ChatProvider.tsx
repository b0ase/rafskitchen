'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const newMessages = [
      ...messages,
      { role: 'user', content }
    ];
    
    setMessages(newMessages);
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
    <ChatContext.Provider value={{ messages, isLoading, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
} 