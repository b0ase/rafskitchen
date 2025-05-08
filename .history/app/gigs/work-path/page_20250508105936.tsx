"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function WorkPathPage() {
  const [activeTab, setActiveTab] = useState('daily');
  
  // Daily schedule options
  const scheduleOptions = [
    {
      id: 'client-focused',
      title: 'Client-Focused Day',
      description: 'When you have active client work that demands most of your attention.',
      schedule: [
        { time: '8:00-9:00', activity: 'Admin & Planning (Check messages, schedule, plan day)', priority: 'high' },
        { time: '9:00-12:00', activity: 'Client Work Block (High focus, primary tasks)', priority: 'high' },
        { time: '12:00-13:00', activity: 'Break', priority: 'medium' },
        { time: '13:00-15:30', activity: 'Client Work Block (Continue primary tasks)', priority: 'high' },
        { time: '15:30-16:30', activity: 'Skill Development (1 hour focused on Learning Path)', priority: 'medium' },
        { time: '16:30-17:00', activity: 'Fiverr Admin (Update gigs, respond to inquiries)', priority: 'medium' },
        { time: '17:00-17:30', activity: 'Day Wrap-up (Document progress, plan tomorrow)', priority: 'medium' }
      ]
    },
    {
      id: 'balanced',
      title: 'Balanced Day',
      description: 'When you have some client work but also time for significant learning.',
      schedule: [
        { time: '8:00-9:00', activity: 'Admin & Planning (Check messages, schedule, plan day)', priority: 'high' },
        { time: '9:00-11:00', activity: 'Client Work Block (High priority tasks)', priority: 'high' },
        { time: '11:00-12:30', activity: 'Skill Development (Learning Path focus)', priority: 'high' },
        { time: '12:30-13:30', activity: 'Break', priority: 'medium' },
        { time: '13:30-15:00', activity: 'Client Work Block (Secondary tasks)', priority: 'high' },
        { time: '15:00-16:30', activity: 'Skill Development (Project-based learning)', priority: 'high' },
        { time: '16:30-17:00', activity: 'Fiverr Admin (Update gigs, respond to inquiries)', priority: 'medium' },
        { time: '17:00-17:30', activity: 'Day Wrap-up (Document progress, plan tomorrow)', priority: 'medium' }
      ]
    },
    {
      id: 'learning-focused',
      title: 'Learning-Focused Day',
      description: 'When you have minimal client work and can prioritize skill development.',
      schedule: [
        { time: '8:00-8:30', activity: 'Admin & Planning (Check messages, schedule, plan day)', priority: 'medium' },
        { time: '8:30-10:00', activity: 'Client Work Block (Any urgent tasks only)', priority: 'medium' },
        { time: '10:00-12:00', activity: 'Skill Development (Core Learning Path focus)', priority: 'high' },
        { time: '12:00-13:00', activity: 'Break', priority: 'medium' },
        { time: '13:00-15:00', activity: 'Skill Development (Practical project work)', priority: 'high' },
        { time: '15:00-16:00', activity: 'Portfolio Development (Document learning as portfolio pieces)', priority: 'high' },
        { time: '16:00-17:00', activity: 'Fiverr Development (Create/improve gigs based on new skills)', priority: 'high' },
        { time: '17:00-17:30', activity: 'Day Wrap-up (Document progress, plan tomorrow)', priority: 'medium' }
      ]
    }
  ];
  
  // Decision framework
  const decisionFramework = [
    {
      question: 'Should I take on this new client work?',
      factors: [
        'Does it align with your priority skill development areas?',
        'Will it create a useful portfolio piece?',
        'Does the timeline allow you to balance with learning goals?',
        'Is the pay rate appropriate for your current skill level?',
        'Will it lead to potential repeat business or referrals?'
      ],
      recommendation: 'Accept work that scores highly on at least 3 of these factors. For work that scores on 2 or fewer, consider negotiating better terms or declining.'
    },
    {
      question: 'What should I prioritize learning today?',
      factors: [
        'Which upcoming client work requires specific skills?',
        'What skills have the highest demand in your active gigs?',
        'Which skill would unlock new gig opportunities?',
        'What aligns with your current position in the Learning Path?',
        'What can you realistically make progress on in the available time?'
      ],
      recommendation: 'Prioritize skills that support imminent client work, then those with high market demand, then those that build on your current progress.'
    },
    {
      question: 'How should I balance client revisions with new work?',
      factors: [
        'Are the revisions urgent (blocking client progress)?',
        'Will the revisions improve your portfolio quality?',
        'Is the revision scope reasonable vs. the original agreement?',
        'Could the revisions be batched with other work for efficiency?',
        'Will addressing revisions now lead to better client satisfaction?'
      ],
      recommendation: 'Handle urgent revisions immediately. Batch non-urgent revisions into specific time blocks. Renegotiate scope if revisions exceed original agreement.'
    }
  ];
  
  // Weekly rhythm
  const weeklyRhythm = [
    {
      day: 'Monday',
      focus: 'Planning & Admin',
      activities: [
        'Review week\'s client commitments',
        'Update Learning Path progress',
        'Schedule blocks for client work and learning',
        'Identify top 3 priorities for the week',
        'Update gigs based on previous week\'s learnings'
      ]
    },
    {
      day: 'Tuesday-Thursday',
      focus: 'Execution & Learning',
      activities: [
        'Focused client work blocks',
        'Dedicated learning time as per schedule',
        'Admin tasks during energy lulls',
        'Client communication in designated windows',
        'Document work/learning for portfolio'
      ]
    },
    {
      day: 'Friday',
      focus: 'Wrap-up & Reflection',
      activities: [
        'Complete outstanding client deliverables',
        'Assess Learning Path progress',
        'Document new skills/projects for portfolio',
        'Update gig offerings if needed',
        'Plan initial priorities for next week'
      ]
    },
    {
      day: 'Weekend',
      focus: 'Recovery & Selective Work',
      activities: [
        'Rest and recover (primary focus)',
        'Optional: Passion projects that build skills',
        'Optional: Catch up on learning if behind',
        'Client work only if urgent/deadline-driven',
        'Light planning for the week ahead'
      ]
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/gigs" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
          <span>←</span> Back to Gigs Hub
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Gigs - Work Path</h1>
      
      <div className="mb-8">
        <p className="text-gray-400 mb-6">
          The Work Path is your practical guide to balancing immediate client work with ongoing skill development. 
          Unlike the Learning Path (which is sequential), the Work Path is situational and helps you make daily decisions 
          about where to focus your time and energy.
        </p>
        
        {/* Tab navigation */}
        <div className="flex border-b border-gray-700 mb-6">
          <button 
            onClick={() => setActiveTab('daily')}
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'daily' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
          >
            Daily Schedules
          </button>
          <button 
            onClick={() => setActiveTab('decisions')}
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'decisions' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
          >
            Decision Framework
          </button>
          <button 
            onClick={() => setActiveTab('weekly')}
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'weekly' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
          >
            Weekly Rhythm
          </button>
          <button 
            onClick={() => setActiveTab('principles')}
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'principles' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
          >
            Guiding Principles
          </button>
        </div>
        
        {/* Daily Schedules Tab */}
        {activeTab === 'daily' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Daily Schedule Templates</h3>
            <p className="text-gray-400 mb-4">
              Choose the appropriate daily schedule based on your current client workload and learning priorities. 
              These are templates - adjust time blocks as needed for your specific situation.
            </p>
            
            <div className="space-y-6">
              {scheduleOptions.map(option => (
                <div key={option.id} className="p-4 border border-gray-700 rounded-lg bg-gray-850">
                  <h4 className="text-lg font-medium mb-2 text-blue-400">{option.title}</h4>
                  <p className="text-gray-400 text-sm mb-4">{option.description}</p>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Time</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Activity</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Priority</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {option.schedule.map((slot, index) => (
                          <tr key={index} className="hover:bg-gray-800">
                            <td className="px-4 py-2 text-xs text-gray-300">{slot.time}</td>
                            <td className="px-4 py-2 text-xs text-gray-300">{slot.activity}</td>
                            <td className="px-4 py-2 text-xs">
                              <span className={`inline-block rounded-full px-2 text-xs ${
                                slot.priority === 'high' ? 'bg-red-900/30 text-red-400' :
                                slot.priority === 'medium' ? 'bg-yellow-900/30 text-yellow-400' :
                                'bg-green-900/30 text-green-400'
                              }`}>
                                {slot.priority}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Decision Framework Tab */}
        {activeTab === 'decisions' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Decision Framework</h3>
            <p className="text-gray-400 mb-4">
              Use these frameworks to make informed decisions about client work, learning priorities, and time allocation.
            </p>
            
            <div className="space-y-6">
              {decisionFramework.map((framework, index) => (
                <div key={index} className="p-4 border border-gray-700 rounded-lg bg-gray-850">
                  <h4 className="text-lg font-medium mb-3 text-cyan-400">{framework.question}</h4>
                  
                  <h5 className="text-sm font-medium mb-2 text-gray-300">Consider these factors:</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-400 mb-4">
                    {framework.factors.map((factor, idx) => (
                      <li key={idx}>{factor}</li>
                    ))}
                  </ul>
                  
                  <div className="bg-gray-800/50 p-3 rounded border-l-2 border-cyan-500 mt-3">
                    <h5 className="text-sm font-medium mb-1 text-gray-300">Recommendation:</h5>
                    <p className="text-sm text-gray-400">{framework.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Weekly Rhythm Tab */}
        {activeTab === 'weekly' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Weekly Rhythm</h3>
            <p className="text-gray-400 mb-4">
              Establish a consistent weekly pattern to balance productivity, learning, and client management.
            </p>
            
            <div className="space-y-4">
              {weeklyRhythm.map((day, index) => (
                <div key={index} className="p-4 border border-gray-700 rounded-lg bg-gray-850">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                    <h4 className="text-lg font-medium text-green-400">{day.day}</h4>
                    <span className="text-sm text-gray-400 font-medium">Focus: {day.focus}</span>
                  </div>
                  
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
                    {day.activities.map((activity, idx) => (
                      <li key={idx}>{activity}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Guiding Principles Tab */}
        {activeTab === 'principles' && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Guiding Principles</h3>
            <p className="text-gray-400 mb-4">
              These principles will help you navigate the balance between earning and learning effectively.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-700 rounded-lg bg-gray-850">
                <h4 className="text-lg font-medium mb-2 text-purple-400">1. Portfolio-Driven Selection</h4>
                <p className="text-sm text-gray-400">
                  Prioritize client work that builds your portfolio in alignment with your target gig offerings. 
                  Each client project should ideally serve double-duty as a learning opportunity and a portfolio piece.
                </p>
              </div>
              
              <div className="p-4 border border-gray-700 rounded-lg bg-gray-850">
                <h4 className="text-lg font-medium mb-2 text-purple-400">2. Time Blocking Architecture</h4>
                <p className="text-sm text-gray-400">
                  Structure your day with clear time blocks for client work, learning, and admin. 
                  Protect your learning blocks as vigilantly as you protect client deadlines.
                </p>
              </div>
              
              <div className="p-4 border border-gray-700 rounded-lg bg-gray-850">
                <h4 className="text-lg font-medium mb-2 text-purple-400">3. Aligned Learning</h4>
                <p className="text-sm text-gray-400">
                  When possible, align your Learning Path focus with current client needs. 
                  If you're working on a Shopify project, prioritize Shopify learning during that period.
                </p>
              </div>
              
              <div className="p-4 border border-gray-700 rounded-lg bg-gray-850">
                <h4 className="text-lg font-medium mb-2 text-purple-400">4. Scope Management</h4>
                <p className="text-sm text-gray-400">
                  Be disciplined about scope on client projects. Set clear boundaries on revisions 
                  and extras to protect your learning time from being consumed by scope creep.
                </p>
              </div>
              
              <div className="p-4 border border-gray-700 rounded-lg bg-gray-850">
                <h4 className="text-lg font-medium mb-2 text-purple-400">5. Default to Learning</h4>
                <p className="text-sm text-gray-400">
                  When in doubt, prioritize learning. Client work will come and go, but your skill 
                  development compounds over time and increases your earning potential.
                </p>
              </div>
              
              <div className="p-4 border border-gray-700 rounded-lg bg-gray-850">
                <h4 className="text-lg font-medium mb-2 text-purple-400">6. Documentation Habit</h4>
                <p className="text-sm text-gray-400">
                  Document everything you learn and create, even small achievements. 
                  This builds your portfolio incrementally and provides material for gig examples.
                </p>
              </div>
              
              <div className="p-4 border border-gray-700 rounded-lg bg-gray-850 md:col-span-2">
                <h4 className="text-lg font-medium mb-2 text-purple-400">7. Weekly Recalibration</h4>
                <p className="text-sm text-gray-400">
                  Every weekend, assess your balance between client work and learning. Be honest about where you're spending time 
                  and adjust the coming week accordingly. If you've been heavy on client work, protect more learning time. 
                  If you've been focused on learning but income is lacking, prioritize gig improvement and client acquisition.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border border-gray-700 rounded-lg bg-gray-850 mt-8">
        <h3 className="text-xl font-semibold mb-3 text-orange-400">Getting Started Now</h3>
        <div className="text-sm text-gray-400 space-y-4">
          <p>
            <strong className="text-gray-300">Today:</strong> Select the most appropriate daily schedule based on your current workload. 
            Block out tomorrow following this template. Identify one pressing client need and one key learning focus.
          </p>
          <p>
            <strong className="text-gray-300">This week:</strong> Spend 2 hours improving or creating your first gig based on your 
            strongest current skill. Set aside 3 hours for focused learning on your highest priority platform.
          </p>
          <p>
            <strong className="text-gray-300">This month:</strong> Balance accepting initial client work with steady progress through 
            the Learning Path. Aim for 15-20 hours per week on client work and 10-15 hours on learning, adjusting as needed based on workload.
          </p>
          <p className="italic mt-4 text-gray-500">
            Remember: The perfect balance between earning and learning will evolve over time. Start with a bias toward learning, 
            then gradually shift more time to client work as your skills and portfolio develop.
          </p>
        </div>
      </div>
    </div>
  );
} 