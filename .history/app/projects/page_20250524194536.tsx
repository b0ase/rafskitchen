'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to myprojects page
    router.replace('/myprojects');
  }, [router]);

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p className="text-gray-600">Taking you to your projects dashboard...</p>
      </div>
    </div>
  );
} 