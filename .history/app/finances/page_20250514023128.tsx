'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import { FaUniversity, FaBitcoin, FaExchangeAlt, FaPlusCircle, FaTable, FaChartPie, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Dummy data for placeholders
const dummyBankAccounts = [
  { id: 'hsbc', name: 'HSBC Current', balance: '£12,345.67', status: 'Connected' },
  { id: 'barclays', name: 'Barclays Business', balance: '£8,765.43', status: 'Connected' },
  { id: 'amex', name: 'Amex Gold', balance: '-£1,234.56', status: 'Needs Re-authentication' },
  { id: 'monzo', name: 'Monzo Personal', balance: '£543.21', status: 'Connected' },
];

const dummyCryptoWallets = [
  { id: 'btc1', name: 'BTC Wallet 1', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', balance: '0.5 BTC' },
  { id: 'eth1', name: 'ETH Main', address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe', balance: '12.3 ETH' },
];

const dummyTransactions = [
  { id: 't1', date: '2024-05-01', description: 'Client A - Project X Invoice', category: 'Client Income', source: 'HSBC Current', income: '£5,000.00', outgoing: '' },
  { id: 't2', date: '2024-05-02', description: 'AWS Monthly Bill', category: 'Cloud Services', source: 'Amex Gold', income: '', outgoing: '£250.00' },
  { id: 't3', date: '2024-05-03', description: 'Transfer to ETH Main', category: 'Crypto Transfer', source: 'Barclays Business', income: '', outgoing: '£1,000.00' },
  { id: 't4', date: '2024-05-04', description: 'Software Subscription - Figma', category: 'Software', source: 'Monzo Personal', income: '', outgoing: '£15.00' },
  { id: 't5', date: '2024-05-05', description: 'Received BTC from Mining Pool', category: 'Crypto Income', source: 'BTC Wallet 1', income: '£200.00 (0.005 BTC)', outgoing: '' },
];

const dummySpendingByCategory = [
  { category: 'Cloud Services', amount: '£250.00', percentage: '30%' },
  { category: 'Software Subscriptions', amount: '£150.00', percentage: '18%' },
  { category: 'Travel & Subsistence', amount: '£100.00', percentage: '12%' },
  { category: 'Office Supplies', amount: '£50.00', percentage: '6%' },
  { category: 'Crypto Gas Fees', amount: '£30.00', percentage: '4%' },
];

// Define interfaces for your financial data (replace with actual structure)
interface BankAccount {
  id: string;
  user_id: string;
  name: string;
  balance: number; // Or string, depending on how you store it
  status: string; // e.g., 'Connected', 'Needs Re-authentication'
  // Add other relevant fields: account_number_last4, bank_name, type, etc.
}

interface CryptoWallet {
  id: string;
  user_id: string;
  name: string;
  address: string;
  balance: string; // e.g., "0.5 BTC" - consider storing amount and currency separately
  // Add other relevant fields: currency_symbol, network, etc.
}

interface Transaction {
  id: string;
  user_id: string;
  date: string; // or Date object
  description: string;
  category: string;
  source_account_id?: string; // Link to bank_accounts or crypto_wallets
  source_account_name?: string; // For display
  income?: number; // Or string
  outgoing?: number; // Or string
  // Add other relevant fields
}

export default function FinancesPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // ADD: State for actual financial data - replace dummy data
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [cryptoWallets, setCryptoWallets] = useState<CryptoWallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // const [spendingByCategory, setSpendingByCategory] = useState<any[]>([]); // Define type later
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  // ADD: State for Boase Trust module visibility
  const [canUserAccessTrustModule, setCanUserAccessTrustModule] = useState(false);

  // State for Open Banking connection process
  const [isConnectingBank, setIsConnectingBank] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(''); // e.g., 'Initializing...', 'Provider Loaded', 'Error'

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      setLoadingUser(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      } else {
        // No user, redirect to login or show message
        // For now, let's assume middleware handles redirecting to /login if no session
        console.log('No user session found on finances page.');
        // Optionally, redirect if middleware isn't catching this:
        // router.push('/login?redirectedFrom=/finances');
      }
      setLoadingUser(false);
    };
    getUser();
  }, [supabase, router]);

  // TODO: useEffect to fetch financial data when user is available
  // This will replace the dummy data usage.
  // Example:
  // useEffect(() => {
  //   if (user) {
  //     fetchBankAccounts(user.id);
  //     fetchCryptoWallets(user.id);
  //     fetchTransactions(user.id);
  //     checkTrustAccess(user.id); // Placeholder for fetching trust access permission
  //   }
  // }, [user]);

  // const fetchBankAccounts = async (userId: string) => { /* ... */ };
  // const fetchCryptoWallets = async (userId: string) => { /* ... */ };
  // const fetchTransactions = async (userId: string) => { /* ... */ };

  // const checkTrustAccess = async (userId: string) => {
  //   // TODO: Implement logic to query a table (e.g., user_trust_access)
  //   // to see if this userId has been granted access to the trust module.
  //   // For now, it defaults to false as per the new requirement.
  //   // const { data, error } = await supabase.from('user_trust_access').select('has_access').eq('user_id', userId).single();
  //   // if (data && data.has_access) setCanUserAccessTrustModule(true);
  // };

  const handleConnectNewBankAccount = async () => {
    setIsConnectingBank(true);
    setConnectionStatus('Initializing connection with Open Banking provider...');
    try {
      const response = await fetch('/api/openbanking/initiate-link', { method: 'POST' });
      if (!response.ok) {
        throw new Error(`Failed to initiate link: ${response.statusText}`);
      }
      const data = await response.json();
      
      if (data.link_token) {
        setConnectionStatus(`Link token received. Provider SDK would open now with token: ${data.link_token}`);
        console.log('Mock: Plaid Link would open here with token:', data.link_token);
        setTimeout(() => {
            setConnectionStatus('Simulating successful bank connection! Public token would be sent to backend.');
            setIsConnectingBank(false);
        }, 5000);
      } else {
        throw new Error(data.error || 'Failed to get link_token from backend.');
      }
    } catch (err: any) {
      console.error('Open Banking connection error:', err);
      setConnectionStatus(`Error: ${err.message || 'Could not connect to Open Banking provider.'}`);
      setIsConnectingBank(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-sky-500" />
        <p className="ml-3 text-xl">Loading user data...</p>
      </div>
    );
  }
  
  if (!user && !loadingUser) { // If done loading and still no user
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center">
        <p className="text-xl mb-4">You need to be logged in to view your finances.</p>
        <Link href="/login?redirectedFrom=/finances" className="text-sky-400 hover:text-sky-300">
          Go to Login
        </Link>
      </div>
    );
  }

  // If authenticated, show finances content
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Financial Dashboard</h1>
          {/* Logout button is in UserSidebar, no need for one here anymore */}
        </div>
        
        {/* Account Connections Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-700 pb-3">Account Connections</h2>
          
          {dataError && <p className="text-red-400 bg-red-900/30 p-3 rounded-md mb-4">{dataError}</p>}

          {/* Bank Accounts & Cards */}
          <div className="mb-8 p-6 bg-gray-900 border border-gray-800 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-blue-400 flex items-center"><FaUniversity className="mr-3" /> Bank Accounts & Cards</h3>
              <button 
                onClick={handleConnectNewBankAccount}
                disabled={isConnectingBank}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-sm font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed rounded-md shadow-sm"
              >
                {isConnectingBank ? <FaSpinner className="animate-spin mr-2" /> : <FaPlusCircle className="mr-2" />} 
                {isConnectingBank ? 'Connecting...' : 'Connect New Account'}
              </button>
            </div>
            {connectionStatus && (
              <div className={`p-3 mb-4 text-sm rounded-md ${connectionStatus.startsWith('Error:') ? 'bg-red-900 border border-red-700 text-red-300' : 'bg-blue-900 border border-blue-700 text-blue-300'}`}>
                {connectionStatus}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Replace dummyBankAccounts with bankAccounts state once data fetching is implemented */}
              {dummyBankAccounts.map(acc => (
                <div key={acc.id} className="p-4 bg-gray-800 border border-gray-700">
                  <p className="font-semibold text-white">{acc.name}</p>
                  <p className="text-lg text-gray-300">{acc.balance}</p>
                  <p className={`text-xs ${acc.status === 'Connected' ? 'text-green-400' : 'text-yellow-400'}`}>{acc.status}</p>
                </div>
              ))}
              {bankAccounts.length === 0 && !isLoadingData && <p className="text-gray-500 md:col-span-2 lg:col-span-4">No bank accounts linked yet.</p>}
            </div>
          </div>

          {/* Cryptocurrency Wallets */}
          <div className="mb-8 p-6 bg-gray-900 border border-gray-800 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-yellow-400 flex items-center"><FaBitcoin className="mr-3" /> Cryptocurrency Wallets</h3>
              {/* Placeholder for adding wallet */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Replace dummyCryptoWallets with cryptoWallets state */}
              {dummyCryptoWallets.map(wallet => (
                <div key={wallet.id} className="p-4 bg-gray-800 border border-gray-700">
                  <p className="font-semibold text-white">{wallet.name}</p>
                  <p className="text-xs text-gray-500 truncate">{wallet.address}</p>
                  <p className="text-lg text-gray-300">{wallet.balance}</p>
                </div>
              ))}
              {cryptoWallets.length === 0 && !isLoadingData && <p className="text-gray-500 md:col-span-2">No crypto wallets added yet.</p>}
            </div>
            <div className="flex">
                <input type="text" placeholder="Enter Wallet Address (e.g., ETH, BTC)" className="flex-grow px-3 py-2 bg-gray-800 border border-gray-600 text-gray-200 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none mr-2" />
                <button className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 text-sm font-medium flex items-center"><FaPlusCircle className="mr-2" /> Add Wallet</button>
            </div>
          </div>

          {/* Other Financial Interests Section - Now conditional for Boase Trust */}
          {canUserAccessTrustModule && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-700 pb-3">Other Financial Interests</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/trust" className="block p-6 bg-gray-800 hover:bg-gray-700 border border-gray-700 shadow-lg rounded-md transition-colors">
                  <h3 className="text-xl font-medium text-green-400 mb-2">The Boase Trust</h3>
                  <p className="text-sm text-gray-400">
                    Access documents, asset ledger, and balance sheet for The Boase Trust.
                  </p>
                </Link>
                {/* Future links to other entities can be added here */}
              </div>
            </section>
          )}

          {/* Recent Transactions Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-700 pb-3 flex items-center"><FaTable className="mr-3" /> Recent Transactions</h2>
            <div className="bg-gray-900 p-6 border border-gray-800 shadow-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Source</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Income</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Outgoing</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800/50 divide-y divide-gray-700/50">
                    {/* Replace dummyTransactions with transactions state */}
                    {dummyTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-700/30 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{tx.date}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-200">{tx.description}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{tx.category}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-400">{tx.source}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-green-400 text-right">{tx.income}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-red-400 text-right">{tx.outgoing}</td>
                      </tr>
                    ))}
                    {transactions.length === 0 && !isLoadingData && (
                      <tr>
                        <td colSpan={6} className="px-4 py-10 text-center text-gray-500 italic">No transactions found for the selected period.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Spending by Category (Placeholder) */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-700 pb-3 flex items-center"><FaChartPie className="mr-3" /> Spending by Category</h2>
            <div className="bg-gray-900 p-6 border border-gray-800 shadow-lg">
              {/* Placeholder for chart or list */}
              <p className="text-gray-500">Spending breakdown chart coming soon...</p>
              <ul className="mt-4 space-y-2">
                {dummySpendingByCategory.map(item => (
                  <li key={item.category} className="flex justify-between text-sm">
                    <span className="text-gray-300">{item.category}</span>
                    <span className="text-gray-400">{item.amount} ({item.percentage})</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
} 