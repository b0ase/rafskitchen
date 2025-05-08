"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CalendarPage() {
  const router = useRouter();
  // Get current date information
  const currentDate = new Date();
  const [viewDate, setViewDate] = useState({
    month: 4, // May (0-indexed)
    year: 2025
  });

  const [selectedCategory, setSelectedCategory] = useState('all');
  // Add state for selected day and modal visibility
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showDayModal, setShowDayModal] = useState(false);
  
  // Add state for Google Calendar integration
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  
  // Check if user is authenticated with Google
  useEffect(() => {
    // In a real implementation, this would check the auth session
    const hasGoogleAuth = localStorage.getItem('googleAuthSession');
    if (hasGoogleAuth) {
      setIsGoogleCalendarConnected(true);
      // You might also load last sync time from localStorage or server
      const savedSyncTime = localStorage.getItem('lastCalendarSync');
      if (savedSyncTime) {
        setLastSyncTime(savedSyncTime);
      }
    }
  }, []);
  
  // Event categories with colors
  const categories = [
    { id: 'all', name: 'All Events', color: 'bg-gray-500' },
    { id: 'client', name: 'Client Work', color: 'bg-blue-500' },
    { id: 'learning', name: 'Learning Path', color: 'bg-green-500' },
    { id: 'financial', name: 'Financial Tasks', color: 'bg-yellow-500' },
    { id: 'admin', name: 'Admin Tasks', color: 'bg-purple-500' },
    { id: 'milestone', name: 'Milestones', color: 'bg-red-500' },
    { id: 'habit', name: 'Habit Management', color: 'bg-orange-500' }
  ];
  
  // Actual planned calendar events - May 2025 (aligned with learning and work paths)
  const events = [
    // Week 1: May 8-14 - Figma Fundamentals Week
    { 
      id: 1, 
      title: 'Learning Path Start', 
      date: new Date(2025, 4, 8), 
      category: 'milestone',
      description: 'Begin 3-month Learning Path program, starting with Figma UI/UX Design Fundamentals'
    },
    { 
      id: 2, 
      title: 'Set Up Financial Tracking', 
      date: new Date(2025, 4, 8), 
      category: 'financial',
      description: 'Create spreadsheet for income/expense tracking and setup daily check-in routine' 
    },
    { 
      id: 3, 
      title: 'Figma Fundamentals Course', 
      date: new Date(2025, 4, 9), 
      category: 'learning',
      description: 'Complete intro modules of Figma UI Design Fundamentals course (2-3 hours)' 
    },
    { 
      id: 4, 
      title: 'Financial Check-in', 
      date: new Date(2025, 4, 9), 
      category: 'financial',
      description: 'First 15-minute daily financial review during dinner (recurring daily)' 
    },
    { 
      id: 5, 
      title: 'First Mockup Design', 
      date: new Date(2025, 4, 10), 
      category: 'learning',
      description: 'Design first website mockup in Figma following course principles' 
    },
    { 
      id: 6, 
      title: 'Small Client Work: Logo', 
      date: new Date(2025, 4, 11), 
      category: 'client',
      description: 'Simple logo revision for existing client (2 hours max)' 
    },
    { 
      id: 7, 
      title: 'Figma Component Work', 
      date: new Date(2025, 4, 12), 
      category: 'learning',
      description: 'Learn component creation and reuse in Figma' 
    },
    { 
      id: 8, 
      title: 'Weekly Financial Review', 
      date: new Date(2025, 4, 12), 
      category: 'financial',
      description: 'First weekly financial planning session - set budget for coming week' 
    },
    { 
      id: 9, 
      title: 'Week 1 Review', 
      date: new Date(2025, 4, 14), 
      category: 'admin',
      description: 'Review week 1 progress, adjust schedule if needed, plan detailed tasks for week 2' 
    },
    { 
      id: 10, 
      title: 'First Fiverr Profile Setup', 
      date: new Date(2025, 4, 14), 
      category: 'admin',
      description: 'Create basic Fiverr seller profile with existing skills' 
    },

    // Week 2: May 15-21 - Figma Advanced & Portfolio Building
    { 
      id: 11, 
      title: 'Client Project Start', 
      date: new Date(2025, 4, 15), 
      category: 'client',
      description: 'Begin small landing page design project for client referral ($200)' 
    },
    { 
      id: 12, 
      title: 'Figma Advanced: Design System', 
      date: new Date(2025, 4, 15), 
      category: 'learning',
      description: 'Create a small design system in Figma (colors, typography, components)' 
    },
    { 
      id: 13, 
      title: 'Web App Interface Design', 
      date: new Date(2025, 4, 17), 
      category: 'learning',
      description: 'Design complex web application interface as practice project' 
    },
    { 
      id: 14, 
      title: 'Financial Goal Setting', 
      date: new Date(2025, 4, 17), 
      category: 'financial',
      description: 'Establish minimum viable income targets for next 3 months' 
    },
    { 
      id: 15, 
      title: 'Client Project Milestone', 
      date: new Date(2025, 4, 18), 
      category: 'client',
      description: 'Deliver first draft of landing page design to client' 
    },
    { 
      id: 16, 
      title: 'Mobile App Design', 
      date: new Date(2025, 4, 19), 
      category: 'learning',
      description: 'Create mobile app interface design in Figma (practice project)' 
    },
    { 
      id: 17, 
      title: 'Weekly Financial Review', 
      date: new Date(2025, 4, 19), 
      category: 'financial',
      description: 'Weekly financial planning session - track spending from week 1' 
    },
    { 
      id: 18, 
      title: 'Prepare Figma Portfolio', 
      date: new Date(2025, 4, 21), 
      category: 'admin',
      description: 'Organize and document Figma designs for portfolio and future Fiverr gigs' 
    },
    { 
      id: 19, 
      title: 'Week 2 Learning Review', 
      date: new Date(2025, 4, 21), 
      category: 'admin',
      description: 'Assess Figma skill development, identify gaps, plan remedial learning if needed' 
    },

    // Week 3: May 22-28 - HTML/CSS Frontend Fundamentals
    { 
      id: 20, 
      title: 'HTML/CSS Week Start', 
      date: new Date(2025, 4, 22), 
      category: 'learning',
      description: 'Begin HTML/CSS Frontend Fundamentals from Learning Path (Week 3)' 
    },
    { 
      id: 21, 
      title: 'Client Project Revisions', 
      date: new Date(2025, 4, 22), 
      category: 'client',
      description: 'Make client-requested revisions to landing page design' 
    },
    { 
      id: 22, 
      title: 'HTML5 Semantics Review', 
      date: new Date(2025, 4, 23), 
      category: 'learning',
      description: 'Refresh HTML5 semantic elements and best practices' 
    },
    { 
      id: 23, 
      title: 'First Fiverr Gig Published', 
      date: new Date(2025, 4, 24), 
      category: 'milestone',
      description: 'Publish first Fiverr gig: "Professional Figma UI Design Mockup"' 
    },
    { 
      id: 24, 
      title: 'CSS Flexbox & Grid', 
      date: new Date(2025, 4, 25), 
      category: 'learning',
      description: 'Focus on advanced CSS layout techniques' 
    },
    { 
      id: 25, 
      title: 'Client Project Delivery', 
      date: new Date(2025, 4, 25), 
      category: 'client',
      description: 'Final delivery of landing page design to client' 
    },
    { 
      id: 26, 
      title: 'Weekly Financial Review', 
      date: new Date(2025, 4, 26), 
      category: 'financial',
      description: 'Weekly financial review - process first client payment' 
    },
    { 
      id: 27, 
      title: 'Responsive Design Practice', 
      date: new Date(2025, 4, 27), 
      category: 'learning',
      description: 'Build responsive landing page with media queries' 
    },
    { 
      id: 28, 
      title: 'Habit Check-in: 9PM Decision Point', 
      date: new Date(2025, 4, 27), 
      category: 'habit',
      description: 'Evaluate first 20 days of 9PM decision point routine, make adjustments' 
    },
    { 
      id: 29, 
      title: 'Figma-to-HTML Practice', 
      date: new Date(2025, 4, 28), 
      category: 'learning',
      description: 'Convert one of your Figma designs to HTML/CSS' 
    },

    // Week 4: May 29-31 - Shopify Beginning
    { 
      id: 30, 
      title: 'Month 1 Progress Review', 
      date: new Date(2025, 4, 29), 
      category: 'milestone',
      description: 'Comprehensive review of Learning Path month 1 progress, financial situation, and gig performance' 
    },
    { 
      id: 31, 
      title: 'Shopify Learning Prep', 
      date: new Date(2025, 4, 30), 
      category: 'learning',
      description: 'Prepare for Shopify learning module beginning next week - read intro materials' 
    },
    { 
      id: 32, 
      title: 'Portfolio Website Structure', 
      date: new Date(2025, 4, 30), 
      category: 'admin',
      description: 'Begin building simple portfolio website using new HTML/CSS skills' 
    },
    { 
      id: 33, 
      title: 'Monthly Financial Summary', 
      date: new Date(2025, 4, 31), 
      category: 'financial',
      description: 'Create monthly financial report - income, expenses, savings, goals for June' 
    },
    { 
      id: 34, 
      title: 'June Planning Session', 
      date: new Date(2025, 4, 31), 
      category: 'admin',
      description: 'Detailed planning for Learning Path month 2 (Shopify and WordPress)' 
    },

    // Daily recurring habits - just showing a few key ones
    { 
      id: 90, 
      title: '9PM Decision Point', 
      date: new Date(2025, 4, 15), 
      category: 'habit',
      description: 'Make intentional decision: productive work session OR planned leisure activity' 
    },
    { 
      id: 91, 
      title: '9PM Decision Point', 
      date: new Date(2025, 4, 20), 
      category: 'habit',
      description: 'Make intentional decision: productive work session OR planned leisure activity' 
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
      month: 4, // May 2025
      year: 2025
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

  // Handle day click
  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setShowDayModal(true);
  };

  // Close day modal
  const closeDayModal = () => {
    setShowDayModal(false);
    setSelectedDay(null);
  };
  
  // Generate calendar grid
  const generateCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(viewDate.month, viewDate.year);
    const firstDay = firstDayOfMonth(viewDate.month, viewDate.year);
    
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-28 border border-gray-700 p-1 bg-gray-850/50"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= totalDays; day++) {
      const dayEvents = getEventsForDay(day);
      const isLearningDay = dayEvents.some(event => event.category === 'learning');
      const isClientDay = dayEvents.some(event => event.category === 'client');
      const isMilestone = dayEvents.some(event => event.category === 'milestone');
      
      // Highlight May 8th, 2025 specially as learning path start date
      const isStartDate = viewDate.month === 4 && viewDate.year === 2025 && day === 8;
      
      let bgColor = 'bg-gray-850/50';
      let borderColor = 'border-gray-700';
      
      if (isStartDate) {
        bgColor = 'bg-red-900/10';
        borderColor = 'border-red-500';
      } else if (isMilestone) {
        bgColor = 'bg-red-900/5';
        borderColor = 'border-red-500/30';
      } else if (isLearningDay && isClientDay) {
        bgColor = 'bg-purple-900/5';
      } else if (isLearningDay) {
        bgColor = 'bg-green-900/5';
      } else if (isClientDay) {
        bgColor = 'bg-blue-900/5';
      }
      
      days.push(
        <div 
          key={`day-${day}`} 
          className={`h-28 border ${borderColor} p-1 ${bgColor} hover:bg-gray-800 transition-colors overflow-hidden cursor-pointer`}
          onClick={() => handleDayClick(day)}
        >
          <div className="flex justify-between items-start">
            <span className={`text-xs font-medium ${isStartDate ? 'text-red-400' : 'text-gray-400'}`}>{day}</span>
            {dayEvents.length > 0 && (
              <span className="text-xs text-gray-500">{dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}</span>
            )}
          </div>
          <div className="space-y-1 mt-1">
            {dayEvents.slice(0, 3).map(event => {
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
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-500">
                +{dayEvents.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };
  
  // Day Modal Component
  const DayModal = () => {
    if (!selectedDay) return null;
    
    const selectedDate = new Date(viewDate.year, viewDate.month, selectedDay);
    const dayEvents = getEventsForDay(selectedDay);
    const formattedDate = selectedDate.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
    
    // Add calendar integration for a specific event
    const addEventToCalendar = (event: any, calendarType: 'google' | 'ical') => {
      if (calendarType === 'google') {
        // In a real implementation, this would add the event to Google Calendar
        // For now, we'll just simulate it
        alert(`Event "${event.title}" would be added to Google Calendar (simulated)`);
      } else {
        // Generate and download an .ics file for this specific event
        alert(`Event "${event.title}" would be exported as .ics file (simulated)`);
      }
    };
    
    // Function to create a new event
    const createNewEvent = () => {
      // This would open a form to create a new event
      // In a real implementation, this would integrate with your state management
      alert('Creating a new event (simulated)');
    };
    
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-lg max-w-xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-850">
            <h3 className="text-xl font-semibold text-white">{formattedDate}</h3>
            <button 
              onClick={closeDayModal}
              className="text-gray-400 hover:text-white"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {dayEvents.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-400 mb-4">No events scheduled for this day.</p>
                <button 
                  onClick={createNewEvent}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                >
                  Create New Event
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-gray-300 font-medium">{dayEvents.length} Events</h4>
                  <button 
                    onClick={createNewEvent}
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs"
                  >
                    + Add Event
                  </button>
                </div>
                <div className="space-y-4">
                  {dayEvents.map(event => {
                    const category = categories.find(cat => cat.id === event.category);
                    return (
                      <div key={event.id} className="border border-gray-700 rounded-lg overflow-hidden">
                        <div className={`${category?.color || 'bg-gray-600'} py-1 px-3`}>
                          <h4 className="font-medium text-white">{event.title}</h4>
                        </div>
                        <div className="p-3 bg-gray-800">
                          <p className="text-gray-300 text-sm mb-2">{event.description}</p>
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-400">
                              Category: {category?.name || 'Uncategorized'}
                            </p>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => addEventToCalendar(event, 'google')}
                                title="Add to Google Calendar"
                                className="p-1 text-xs bg-blue-900/30 text-blue-400 rounded hover:bg-blue-900/50"
                              >
                                Google
                              </button>
                              <button 
                                onClick={() => addEventToCalendar(event, 'ical')}
                                title="Export as iCal"
                                className="p-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
                              >
                                iCal
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-700 bg-gray-850 flex justify-between">
            <button
              onClick={() => {
                // In a real implementation, this would export all events for this day
                alert(`All events for ${formattedDate} would be exported (simulated)`);
              }}
              className="py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium transition-colors text-sm"
            >
              Export Day
            </button>
            <button
              onClick={closeDayModal}
              className="py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Google Calendar integration functions
  const connectGoogleCalendar = () => {
    // Redirect to the auth page
    router.push('/gigs/calendar/auth');
  };
  
  const syncWithGoogleCalendar = () => {
    // In a real implementation, this would sync events with Google Calendar
    setIsSyncing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      const syncTimeString = now.toLocaleTimeString();
      setLastSyncTime(syncTimeString);
      // Store the sync time
      localStorage.setItem('lastCalendarSync', syncTimeString);
    }, 1500);
  };
  
  const exportToIcal = () => {
    // In a real implementation, this would generate and download an .ics file
    alert('Calendar exported to .ics file (simulated)');
  };
  
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
          Visualize your client work, learning schedule, and important deadlines. This calendar shows your actual May 2025 plan 
          aligned with the Learning Path start date and Work Path routines. Click on any day to see detailed events.
        </p>
        
        {/* Calendar Integration Options */}
        <div className="mb-6 p-4 border border-gray-700 rounded-lg bg-gray-850">
          <h3 className="text-lg font-semibold mb-3 text-white">Calendar Integration</h3>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col text-sm text-gray-400">
              <p>Connect with external calendars to easily manage your events</p>
              {lastSyncTime && (
                <p className="text-xs text-gray-500 mt-1">Last synced: {lastSyncTime}</p>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {!isGoogleCalendarConnected ? (
                <button 
                  onClick={connectGoogleCalendar}
                  className="px-3 py-2 bg-white hover:bg-gray-100 text-gray-800 rounded-md text-sm font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </button>
              ) : (
                <button 
                  onClick={syncWithGoogleCalendar}
                  disabled={isSyncing}
                  className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSyncing ? (
                    <>
                      <span className="animate-spin">⟳</span> Syncing...
                    </>
                  ) : (
                    <>Sync with Google Calendar</>
                  )}
                </button>
              )}
              
              <button 
                onClick={exportToIcal}
                className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium"
              >
                Export as iCal
              </button>
            </div>
          </div>
        </div>
        
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
        
        {/* Plan Summary Section */}
        <div className="mt-8 border border-gray-700 rounded-lg bg-gray-850 p-4">
          <h3 className="text-xl font-semibold mb-3 text-purple-400">May 2025 Plan Summary</h3>
          <div className="text-sm text-gray-400 space-y-3">
            <p>
              This plan implements the first 3.5 weeks of your Learning Path alongside client work and financial discipline practices.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="border border-gray-700 rounded p-3 bg-gray-800/50">
                <h4 className="font-medium text-green-400 mb-2">Learning Focus</h4>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Weeks 1-2: Figma UI/UX Design (May 8-21)</li>
                  <li>Week 3: HTML/CSS Frontend Fundamentals (May 22-28)</li>
                  <li>Week 4 Start: Shopify Preparation (May 29-31)</li>
                  <li><span className="text-green-400">~33 hours</span> dedicated to learning</li>
                </ul>
              </div>
              
              <div className="border border-gray-700 rounded p-3 bg-gray-800/50">
                <h4 className="font-medium text-blue-400 mb-2">Client Work</h4>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>1 small logo project (May 11)</li>
                  <li>1 landing page design project (May 15-25)</li>
                  <li>First Fiverr gig published (May 24)</li>
                  <li><span className="text-blue-400">~15 hours</span> of client work</li>
                </ul>
              </div>
              
              <div className="border border-gray-700 rounded p-3 bg-gray-800/50">
                <h4 className="font-medium text-yellow-400 mb-2">Financial Discipline</h4>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Financial tracking system setup (May 8)</li>
                  <li>Daily 15-minute financial reviews</li>
                  <li>Weekly financial planning sessions (each weekend)</li>
                  <li>Monthly summary and June budget (May 31)</li>
                </ul>
              </div>
              
              <div className="border border-gray-700 rounded p-3 bg-gray-800/50">
                <h4 className="font-medium text-orange-400 mb-2">Habit Management</h4>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>9PM decision points implemented daily</li>
                  <li>Mid-month habit check-in (May 27)</li>
                  <li>Morning routine established (7:00-8:30 AM)</li>
                  <li>Structured evening work sessions with clear endpoints</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Day Detail Modal */}
      {showDayModal && <DayModal />}
    </div>
  );
} 