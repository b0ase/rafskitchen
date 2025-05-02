'use client';

import React, { useState, useEffect, useRef } from 'react';

interface CharacterCycleProps {
  text: string;
  className?: string;
  cycleDuration?: number; // How long to cycle chars per letter (ms)
  totalDuration?: number; // Optional total max duration (ms)
}

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789*&#%$';

const CharacterCycle: React.FC<CharacterCycleProps> = ({ 
  text, 
  className = '', 
  cycleDuration = 50, 
  totalDuration 
}) => {
  // Initialize state with the final text to prevent blank initial render
  const [displayText, setDisplayText] = useState(text);
  const elementRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let index = 0;
    let cycleInterval = cycleDuration;
    let isMounted = true; // Flag to prevent state updates after unmount

    // Function to update text
    const updateText = () => {
        if (!isMounted) return; // Don't update if unmounted

        if (index < text.length) {
            let tempText = text.substring(0, index);
            // Add random characters for the remaining length
            for(let i = index; i < text.length; i++) {
                // Keep spaces as spaces
                if(text[i] === ' ') {
                    tempText += ' ';
                } else {
                    tempText += characters[Math.floor(Math.random() * characters.length)];
                }
            }
            setDisplayText(tempText);
            index++;
        } else {
            setDisplayText(text); // Set final text
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
    };

    // Start cycling effect immediately
    // Set initial scrambling text slightly different from final text to ensure animation is visible
    setDisplayText(text.split('').map(char => char === ' ' ? ' ' : characters[Math.floor(Math.random() * characters.length)]).join(''));
    intervalRef.current = setInterval(updateText, cycleInterval);

    // Optional: Set a total duration timeout
    if (totalDuration) {
        timeoutRef.current = setTimeout(() => {
            if (!isMounted) return;
            setDisplayText(text); // Force final text
             if (intervalRef.current) clearInterval(intervalRef.current);
        }, totalDuration);
    }

    // Cleanup on unmount
    return () => {
      isMounted = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

  }, [text, cycleDuration, totalDuration]); // Rerun effect if text or durations change

  return (
    <span ref={elementRef} className={className}>
      {displayText}
    </span>
  );
};

export default CharacterCycle; 