"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function CalendarPage() {
  // Get current date information
  const currentDate = new Date();
  const [viewDate, setViewDate] = useState({
    month: currentDate.getMonth(),
    year: currentDate.getFullYear()
  });

  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Event categories with colors
  const categories = [
    { id: 'all', name: 'All Events', color: 'bg-gray-500' },
    { id: 'client', name: 'Client Work', color: 'bg-blue-500' },
    { id: 'learning', name: 'Learning Path', color: 'bg-green-500' },
    { id: 'financial', name: 'Financial Tasks', color: 'bg-yellow-500' },
    { id: 'admin', name: 'Admin Tasks', color: 'bg-purple-500' },
    { id: 'milestone', name: 'Milestones', color: 'bg-red-500' }
  ];
  
  // Example calendar events
  const events = [
    { 
      id: 1, 
      title: 'Client Project Deadline', 
      date: new Date(viewDate.year, viewDate.month, 15), 
      category: 'client',
      description: 'Complete Shopify store setup for EcoProducts'
    },
    { 
      id: 2, 
      title: 'Figma Learning Session', 
      date: new Date(viewDate.year, viewDate.month, 5), 
      category: 'learning',
      description: 'Complete UI Design Fundamentals tutorial' 
    },
    { 
      id: 3, 
      title: 'Monthly Financial Review', 
      date: new Date(viewDate.year, viewDate.month, 28), 
      category: 'financial',
      description: 'Review income, expenses, and update budget' 
    },
    { 
      id: 4, 
      title: 'Portfolio Update', 
      date: new Date(viewDate.year, viewDate.month, 10), 
      category: 'admin',
      description: 'Add completed client projects to portfolio' 
    },
    { 
      id: 5, 
      title: 'First Gig Published', 
      date: new Date(viewDate.year, viewDate.month, 20), 
      category: 'milestone',
      description: 'Launch first Shopify Development gig on Fiverr' 
    },
    { 
      id: 6, 
      title: 'React Learning Path Stage', 
      date: new Date(viewDate.year, viewDate.month, 22), 
      category: 'learning',
      description: 'Begin React.js fundamentals week from Learning Path' 
    },
    { 
      id: 7, 
      title: 'Client Consultation Call', 
      date: new Date(viewDate.year, viewDate.month, 8), 
      category: 'client',
      description: 'Initial requirements discussion with new WordPress client' 
    }
  ];
  
  // Calendar helper functions
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  const daysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const firstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Navigation functions
  const previousMonth = () => {
    setViewDate(prev => {
      const newMonth = prev.month - 1;
      if (newMonth < 0) {
        return { month: 11, year: prev.year - 1 };
      }
      return { ...prev, month: newMonth };
    });
  };
  
  const nextMonth = () => {
    setViewDate(prev => {
      const newMonth = prev.month + 1;
      if (newMonth > 11) {
        return { month: 0, year: prev.year + 1 };
      }
      return { ...prev, month: newMonth };
    });
  };
  
  const goToToday = () => {
    setViewDate({
      month: currentDate.getMonth(),
      year: currentDate.getFullYear()
    });
  };
  
  // Filter events based on selected category and month
  const filteredEvents = events.filter(event => {
    // Match month and year
    const eventMonth = event.date.getMonth();
    const eventYear = event.date.getFullYear();
    const monthYearMatch = eventMonth === viewDate.month && eventYear === viewDate.year;
    
    // Match category (if "all" is selected, show everything)
    const categoryMatch = selectedCategory === 'all' || event.category === selectedCategory;
    
    return monthYearMatch && categoryMatch;
  });
  
  // Get events for a specific day
  const getEventsForDay = (day: number) => {
    return filteredEvents.filter(event => event.date.getDate() === day);
  };
  
  // Generate calendar grid
  const generateCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(viewDate.month, viewDate.year);
    const firstDay = firstDayOfMonth(viewDate.month, viewDate.year);
    
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-700 p-1 bg-gray-850/50"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= totalDays; day++) {
      const dayEvents = getEventsForDay(day);
      const isToday = 
        day === currentDate.getDate() && 
        viewDate.month === currentDate.getMonth() && 
        viewDate.year === currentDate.getFullYear();
      
      days.push(
        <div 
          key={`day-${day}`} 
          className={`h-24 border border-gray-700 p-1 ${isToday ? 'bg-gray-800/70 border-gray-500' : 'bg-gray-850/50'} hover:bg-gray-800 transition-colors overflow-hidden`}
        >
          <div className="flex justify-between items-start">
            <span className={`text-xs font-medium ${isToday ? 'text-blue-400' : 'text-gray-400'}`}>{day}</span>
            {dayEvents.length > 0 && (
              <span className="text-xs text-gray-500">{dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}</span>
            )}
          </div>
          <div className="space-y-1 mt-1">
            {dayEvents.slice(0, 2).map(event => {
              const category = categories.find(cat => cat.id === event.category);
              return (
                <div 
                  key={event.id} 
                  className={`text-xs p-1 rounded truncate text-white ${category?.color || 'bg-gray-500'}`}
                  title={`${event.title}: ${event.description}`}
                >
                  {event.title}
                </div>
              );
            })}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };
  
  // Event detail modal
  const [selectedEvent, setSelectedEvent] = useState<null | {
    id: number,
    title: string,
    date: Date,
    category: string,
    description: string
  }>(null);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/gigs" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
          <span>←</span> Back to Gigs Hub
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Gigs - Calendar</h1>
      
      <div className="mb-8">
        <p className="text-gray-400 mb-6">
          Visualize your client work, learning schedule, and important deadlines. Use this calendar to balance
          your daily activities based on the Work Path and Learning Path schedules.
        </p>
        
        {/* Calendar Header & Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={previousMonth}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md text-gray-300"
              aria-label="Previous Month"
            >
              ←
            </button>
            <h2 className="text-xl font-semibold text-white mx-2 w-48 text-center">
              {monthNames[viewDate.month]} {viewDate.year}
            </h2>
            <button 
              onClick={nextMonth}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md text-gray-300"
              aria-label="Next Month"
            >
              →
            </button>
            <button 
              onClick={goToToday}
              className="ml-2 px-3 py-1 bg-blue-800 hover:bg-blue-700 rounded-md text-sm text-white"
            >
              Today
            </button>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-sm text-gray-400">Filter:</span>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-2 py-1 rounded-md text-xs ${
                  selectedCategory === category.id ? 
                  `${category.color} text-white` : 
                  'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Calendar Grid */}
        <div className="border-t border-l border-gray-700 rounded-md overflow-hidden">
          {/* Day labels */}
          <div className="grid grid-cols-7 bg-gray-800 text-gray-400 text-sm border-b border-gray-700">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center font-medium">{day}</div>
            ))}
          </div>
          
          {/* Calendar cells */}
          <div className="grid grid-cols-7">
            {generateCalendarDays()}
          </div>
        </div>
        
        {/* Event List for the Month */}
        <div className="mt-8 bg-gray-850 border border-gray-700 rounded-md p-4">
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center justify-between">
            <span>Events This Month</span>
            <span className="text-sm text-gray-400 font-normal">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
            </span>
          </h3>
          
          {filteredEvents.length === 0 ? (
            <p className="text-gray-500 text-sm">No events to display with the current filter.</p>
          ) : (
            <div className="space-y-3">
              {filteredEvents
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map(event => {
                  const category = categories.find(cat => cat.id === event.category);
                  return (
                    <div key={event.id} className="flex gap-3 p-3 bg-gray-800 rounded-md hover:bg-gray-750">
                      <div className={`w-2 self-stretch rounded-full ${category?.color || 'bg-gray-500'}`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium text-white">{event.title}</span>
                          <span className="text-xs text-gray-400">
                            {event.date.toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              weekday: 'short'
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{event.description}</p>
                      </div>
                    </div>
                  );
              })}
            </div>
          )}
        </div>
        
        {/* Guide Section */}
        <div className="mt-8 border border-gray-700 rounded-lg bg-gray-850 p-4">
          <h3 className="text-xl font-semibold mb-3 text-purple-400">Calendar Integration Tips</h3>
          <div className="text-sm text-gray-400 space-y-3">
            <p>
              For best results, integrate this calendar with your Learning Path and Work Path schedules:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-gray-300">Block Learning Time:</strong> Schedule dedicated blocks for each week of your Learning Path to ensure steady progress.</li>
              <li><strong className="text-gray-300">Client Deadlines:</strong> Add both final deadlines and intermediate milestones for client projects.</li>
              <li><strong className="text-gray-300">Financial Check-ins:</strong> Schedule your daily 15-minute financial reviews and weekly planning sessions.</li>
              <li><strong className="text-gray-300">Portfolio Development:</strong> Set specific times to document your work and update your portfolio.</li>
              <li><strong className="text-gray-300">Review Days:</strong> Schedule regular reviews of your work/learning balance at the end of each week.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 