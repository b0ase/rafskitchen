'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ClientSignupForm from "../components/ClientSignupForm";
import { FaGithub, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page with signup mode enabled
    router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Redirecting to sign up...</p>
      </div>
    </div>
  );
} 