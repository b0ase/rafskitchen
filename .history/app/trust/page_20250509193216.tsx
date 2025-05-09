'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient'; // Changed to relative path
import type { Session, User } from '@supabase/supabase-js';

// Define a type for our asset data
interface Asset {
  id: string;
  name: string;
  description: string | null;
  type: string;
  identifier: string | null;
  current_value: number | null;
  value_currency: string | null;
  custodian_details: string | null;
  notes: string | null;
  date_added: string;
}

export default function BoaseTrustPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetsLoading, setAssetsLoading] = useState(false);
  const [assetsError, setAssetsError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'assets' | 'balanceSheet' | 'trustees'>('assets');

  useEffect(() => {
    const getSessionAndAssets = async () => {
      setLoading(true);
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession) {
        await fetchAssets();
      }
      setLoading(false);
    };

    getSessionAndAssets();

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setLoading(true);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (newSession) {
          await fetchAssets();
        } else {
          setAssets([]); // Clear assets if user logs out
          setAssetsError(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authSubscription?.unsubscribe();
    };
  }, []);

  const fetchAssets = async () => {
    setAssetsLoading(true);
    setAssetsError(null);
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('date_added', { ascending: false });

      if (error) {
        throw error;
      }
      setAssets(data || []);
    } catch (error: any) {
      console.error('Error fetching assets:', error.message);
      setAssetsError('Failed to load assets. Please try again.');
      setAssets([]);
    }
    setAssetsLoading(false);
  };

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
        // Authenticated View - Darkened Presentation
        <div className="max-w-4xl mx-auto bg-gray-900 shadow-2xl rounded-lg p-6 text-gray-100">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
            <div>
              <h2 className="text-2xl font-semibold">Welcome, Trustee!</h2>
              <p className="text-sm text-gray-400">Signed in as: {user.email}</p>
            </div>
            <button 
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm transition-colors duration-150"
            >
              Sign Out
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <nav className="flex space-x-1 rounded-md bg-gray-800 p-1" aria-label="Tabs">
              {[
                { name: 'Assets', tabKey: 'assets' },
                { name: 'Balance Sheet', tabKey: 'balanceSheet' },
                { name: 'Trustees', tabKey: 'trustees' },
              ].map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.tabKey as any)}
                  className={`
                    ${activeTab === tab.tabKey ? 'bg-slate-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                    'px-3 py-2 font-medium text-sm rounded-md flex-1 text-center transition-colors duration-150'
                  `}
                  aria-current={activeTab === tab.tabKey ? 'page' : undefined}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="bg-gray-850 p-1 rounded-lg border border-gray-700" style={{backgroundColor: '#1F2937' /* gray-850ish */}}>
            {activeTab === 'assets' && (
              <div className="p-4 border border-white rounded-md bg-black">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-xl text-gray-100">Managed Assets</h4>
                  <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors duration-150">
                    + Add Asset (Soon)
                  </button>
                </div>
                {assetsLoading ? (
                  <p className="text-gray-300">Loading assets...</p>
                ) : assetsError ? (
                  <p className="text-red-400">{assetsError}</p>
                ) : assets.length > 0 ? (
                  <ul className="space-y-3">
                    {assets.map((asset) => (
                      <li key={asset.id} className="p-3 bg-gray-900 rounded-md shadow-md border border-gray-700 hover:border-gray-500 transition-colors duration-150">
                        <h5 className="font-semibold text-md text-sky-400">{asset.name}</h5>
                        <p className="text-sm text-gray-300">Type: <span className='text-gray-400'>{asset.type}</span></p>
                        {asset.description && <p className="text-sm text-gray-300">Description: <span className='text-gray-400'>{asset.description}</span></p>}
                        {asset.current_value && (
                          <p className="text-sm text-gray-300">
                            Value: <span className='text-gray-400'>{asset.current_value} {asset.value_currency}</span>
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">Added: {new Date(asset.date_added).toLocaleDateString()}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No assets found. Click "+ Add Asset" to get started.</p>
                )}
                
                {/* Trust Documents Section (Placeholder within Assets Tab) */}
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <h4 className="font-semibold text-lg text-gray-100 mb-2">Associated Documents</h4>
                  <p className="text-sm text-gray-400">Access and upload important trust documents related to assets. (Coming Soon)</p>
                  {/* Placeholder for document list/upload */}
                  <div className="mt-2 p-3 bg-gray-900 rounded-md border border-gray-700 text-center text-gray-500">
                    Document management coming soon.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'balanceSheet' && (
              <div className="p-4 border border-white rounded-md bg-black">
                <h4 className="font-semibold text-xl text-gray-100">Balance Sheet</h4>
                <p className="text-gray-400 mt-2">Financial overview of the trust. (Coming Soon)</p>
                {/* Placeholder for balance sheet data */}
              </div>
            )}

            {activeTab === 'trustees' && (
              <div className="p-4 border border-white rounded-md bg-black">
                <h4 className="font-semibold text-xl text-gray-100">Trustee Management</h4>
                <p className="text-gray-400 mt-2">View and manage trustee profiles and permissions. (Coming Soon)</p>
                {/* Placeholder for trustee list and management tools */}
              </div>
            )}
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