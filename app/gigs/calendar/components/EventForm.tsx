"use client";
import React, { useState, useEffect } from 'react';

type EventFormProps = {
  date: Date;
  event?: any; // Optional event for editing
  onSave: (eventData: any) => void;
  onCancel: () => void;
  categories: { id: string; name: string; color: string }[];
};

export default function EventForm({ date, event, onSave, onCancel, categories }: EventFormProps) {
  // Form state
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [category, setCategory] = useState(event?.category || categories[0]?.id || '');
  const [isGoogleSyncEnabled, setIsGoogleSyncEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if authenticated with Google
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated with Google
    const hasGoogleAuth = localStorage.getItem('googleAuthSession');
    setIsGoogleConnected(!!hasGoogleAuth);
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Create the event object
    const eventData = {
      id: event?.id || Date.now(), // Use existing ID or create new one
      title,
      description,
      category,
      date: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ),
      syncWithGoogle: isGoogleSyncEnabled && isGoogleConnected
    };
    
    // Simulate saving delay
    setTimeout(() => {
      onSave(eventData);
      setIsLoading(false);
    }, 800);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="event-title" className="block text-sm font-medium text-gray-300 mb-1">
          Event Title
        </label>
        <input
          id="event-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter event title"
          required
        />
      </div>
      
      <div>
        <label htmlFor="event-description" className="block text-sm font-medium text-gray-300 mb-1">
          Description
        </label>
        <textarea
          id="event-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
          placeholder="Enter event description"
        />
      </div>
      
      <div>
        <label htmlFor="event-category" className="block text-sm font-medium text-gray-300 mb-1">
          Category
        </label>
        <select
          id="event-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categories.filter(cat => cat.id !== 'all').map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      
      {isGoogleConnected && (
        <div className="flex items-center">
          <input
            id="google-sync"
            type="checkbox"
            checked={isGoogleSyncEnabled}
            onChange={(e) => setIsGoogleSyncEnabled(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
          />
          <label htmlFor="google-sync" className="ml-2 block text-sm text-gray-300">
            Sync with Google Calendar
          </label>
        </div>
      )}
      
      <div className="flex justify-end space-x-3 pt-3 border-t border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || !title}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isLoading ? (
            <>
              <span className="animate-spin mr-2 text-xs">⟳</span>
              Saving...
            </>
          ) : (
            <>Save Event</>
          )}
        </button>
      </div>
    </form>
  );
} 