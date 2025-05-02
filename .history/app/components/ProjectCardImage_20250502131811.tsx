'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface ProjectCardImageProps {
  imageUrls: string[];
  alt: string;
  intervalMs?: number; // Optional interval duration
}

const ProjectCardImage: React.FC<ProjectCardImageProps> = ({ 
  imageUrls,
  alt,
  intervalMs = 3000 // Default to 3 seconds
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle image cycling only if there's more than one image
  useEffect(() => {
    if (imageUrls.length <= 1) {
      return; // No need to cycle for 0 or 1 image
    }

    const intervalId = setInterval(() => {
      setIsTransitioning(true); // Start fade-out
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
        setIsTransitioning(false); // Start fade-in with new image
      }, 300); // Wait for fade-out transition (should match CSS duration)
    }, intervalMs);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [imageUrls, intervalMs]);

  // Handle cases with no images
  if (!imageUrls || imageUrls.length === 0) {
    // Optionally render a placeholder or nothing
    return <div className="w-full h-full bg-gray-200 dark:bg-gray-700"></div>; 
  }

  const currentImageUrl = imageUrls[currentIndex];

  return (
    <Image
      key={currentIndex} // Force re-render on index change for transition
      src={currentImageUrl}
      alt={alt}
      layout="fill"
      objectFit="cover"
      className={`transition-opacity duration-300 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100 dark:opacity-80'}`}
      priority={currentIndex === 0} // Prioritize loading the first image
      // Consider adding placeholder="blur" and blurDataURL if needed
    />
  );
};

export default ProjectCardImage; 