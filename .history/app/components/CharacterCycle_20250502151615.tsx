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
  const [displayText, setDisplayText] = useState('');
  const elementRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let index = 0;
    let lastUpdate = performance.now();

    const updateText = (now: number) => {
      if (index < text.length) {
        if (now - lastUpdate >= cycleDuration) {
          let tempText = text.substring(0, index);
          for (let i = index; i < text.length; i++) {
            tempText += text[i] === ' ' ? ' ' : characters[Math.floor(Math.random() * characters.length)];
          }
          setDisplayText(tempText);
          index++;
          lastUpdate = now;
        }
        frameRef.current = requestAnimationFrame(updateText);
      } else {
        setDisplayText(text);
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
      }
    };

    frameRef.current = requestAnimationFrame(updateText);

    if (totalDuration) {
      timeoutRef.current = setTimeout(() => {
        setDisplayText(text);
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
      }, totalDuration);
    }

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, cycleDuration, totalDuration]);

  return (
    <span ref={elementRef} className={className}>
      {displayText}
    </span>
  );
};

export default CharacterCycle; 