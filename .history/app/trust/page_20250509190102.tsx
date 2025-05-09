'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Ensure this path is correct
import type { Session, User } from '@supabase/supabase-js';

export default function BoaseTrustPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const handleSignInWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/trust' // Or your desired redirect path after login
      }
    });
    if (error) {
      console.error('Error signing in with Google:', error.message);
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    }
    // Session will be set to null by onAuthStateChange
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Boase Trust Management</h1>
      
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : session && user ? (
        // Authenticated View
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Welcome, Trustee!</h2>
              <p className="text-sm text-gray-600">Signed in as: {user.email}</p>
            </div>
            <button 
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline text-sm"
            >
              Sign Out
            </button>
          </div>

          {/* Trustee Dashboard Content */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Your Dashboard</h3>
            <p className="text-gray-700 mb-4">
              Here you can manage trust assets, documents, and view transaction history.
            </p>
            {/* Placeholder for Asset List, Document List, etc. */}
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">Managed Assets</h4>
                <p className="text-sm text-gray-600">View and manage crypto and RWA holdings. (Coming Soon)</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">Trust Documents</h4>
                <p className="text-sm text-gray-600">Access and upload important trust documents. (Coming Soon)</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Unauthenticated View
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
          <p className="text-center text-gray-600 mb-6">
            Welcome to the Boase Trust portal. Please sign in with Google to manage assets and documents.
          </p>
          <div className="text-center">
            <button 
              onClick={handleSignInWithGoogle}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline flex items-center justify-center w-full"
              disabled={loading}
            >
              {/* Basic Google Icon (SVG or from a library) - Placeholder */}
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign In with Google
            </button>
          </div>
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">About Boase Trust</h2>
        <p className="text-gray-700 leading-relaxed">
          The Boase Trust is a forward-thinking platform for managing a diverse range of assets, 
          including time-locked cryptocurrencies, multi-signature wallet holdings, and tokenized 
          real-world assets (RWAs) such as real estate and collectibles. 
        </p>
        <p className="mt-2 text-gray-700 leading-relaxed">
          Trustees can securely log in to oversee asset portfolios, manage relevant documentation, 
          and participate in governance and transaction approvals. Our goal is to provide a transparent, 
          secure, and efficient interface for modern trust management in the digital age.
        </p>
      </div>
    </div>
  );
} 