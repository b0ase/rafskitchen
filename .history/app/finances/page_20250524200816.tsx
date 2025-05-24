'use client';

import React, { useState, useEffect, useCallback } from 'react';
import getSupabaseBrowserClient from '@/lib/supabase/client'; // Adjust path if needed
import { User } from '@supabase/supabase-js';
import { FaUniversity, FaBitcoin, FaExchangeAlt, FaPlusCircle, FaTable, FaChartPie, FaSpinner, FaGoogle, FaDollarSign, FaChartLine, FaCreditCard, FaWallet, FaFileInvoiceDollar, FaPiggyBank } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Define interfaces for your financial data (replace with actual structure)
interface FinancialAccount {
  id: string; // UUID
  user_id: string; // UUID
  account_type: 'bank' | 'crypto_wallet' | 'credit_card' | 'investment' | 'loan' | 'cash' | 'other';
  name: string;
  provider_name?: string | null;
  account_details?: any | null; // JSONB - specific structure depends on account_type
  current_balance?: number | null;
  currency_code?: string | null;
  status?: 'active' | 'inactive' | 'needs_reauth' | 'closed' | 'pending_connection' | null;
  open_banking_item_id?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface TransactionCategory {
  id: string; // UUID
  user_id?: string | null; // UUID
  name: string;
  parent_category_id?: string | null; // UUID
  transaction_type: 'income' | 'expense' | 'transfer';
  icon_name?: string | null;
  color_hex?: string | null;
  is_system_default?: boolean;
}

interface Transaction {
  id: string; // UUID
  user_id: string; // UUID
  financial_account_id: string; // UUID
  transaction_category_id?: string | null; // UUID
  transaction_date: string; // DATE (YYYY-MM-DD)
  description: string;
  amount: number; // NUMERIC
  currency_code: string;
  merchant_name?: string | null;
  status?: 'pending' | 'cleared' | 'cancelled' | 'disputed' | null;
  notes?: string | null;
  is_recurring?: boolean;
  source_data?: any | null; // JSONB
  created_at?: string;
  updated_at?: string;
  // For display purposes, we might join category name
  category_name?: string | null;
  account_name?: string | null; // from financial_accounts
}

// Placeholder for calculated spending data
interface SpendingByCategoryItem {
  category_id: string;
  category_name: string;
  amount: number;
  percentage: number;
  color_hex?: string | null;
  icon_name?: string | null;
}

export default function FinancesPage() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // State for actual financial data
  const [financialAccounts, setFinancialAccounts] = useState<FinancialAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionCategories, setTransactionCategories] = useState<TransactionCategory[]>([]);
  const [spendingByCategory, setSpendingByCategory] = useState<SpendingByCategoryItem[]>([]); 

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  // ADD: State for Boase Trust module visibility
  const [canUserAccessTrustModule, setCanUserAccessTrustModule] = useState(false);

  // State for Open Banking connection process
  const [isConnectingBank, setIsConnectingBank] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(''); // e.g., 'Initializing...', 'Provider Loaded', 'Error'

  // ADD: State for Google Auth status messages
  const [googleAuthMessage, setGoogleAuthMessage] = useState<string | null>(null);
  const [googleAuthError, setGoogleAuthError] = useState<string | null>(null);

  // ADD: useEffect to read Google Auth status from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const authStatus = searchParams.get('google_auth_status');
    const authError = searchParams.get('error'); // General error param
    const authMessage = searchParams.get('message'); // Specific message for Google errors

    if (authStatus === 'success') {
      setGoogleAuthMessage('Successfully connected your Google account!');
      setGoogleAuthError(null);
      // Clean up URL params
      router.replace('/finances', { scroll: false });
    } else if (authError && authError.startsWith('google_')) {
      setGoogleAuthError(authMessage || 'An error occurred with Google authentication.');
      setGoogleAuthMessage(null);
      // Clean up URL params
      router.replace('/finances', { scroll: false });
    }
  }, [router]);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      setLoadingUser(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      } else {
        console.log('No user session found on finances page, redirecting to login.');
        router.push('/login?redirectedFrom=/finances');
      }
      setLoadingUser(false);
    };
    getUser();
  }, [supabase, router]);

  // --- DATA FETCHING FUNCTIONS (to be implemented) ---
  const fetchAllFinancialData = useCallback(async (userId: string) => {
    if (!userId) return;
    setIsLoadingData(true);
    setDataError(null);
    try {
      console.log(`Fetching all financial data for user: ${userId}`);

      // Define the select string for transactions carefully - SIMPLIFIED (NO JOINS)
      const transactionSelect = '*'; // Select all direct columns from transactions table

      const promiseResults = await Promise.all([
        supabase.from('financial_accounts').select('*').eq('user_id', userId).order('name'),
        supabase.from('transactions').select(transactionSelect).eq('user_id', userId).order('transaction_date', { ascending: false }),
        supabase.from('transaction_categories').select('*').or(`user_id.eq.${userId},is_system_default.eq.true`).order('name')
      ]);

      const accountsResponse = promiseResults[0] as { data: FinancialAccount[] | null; error: any | null };
      // SIMPLIFIED: transactionsResponse type no longer expects nested financial_account or transaction_category
      const transactionsResponse = promiseResults[1] as { data: Omit<Transaction, 'account_name' | 'category_name' | 'category_icon' | 'category_color'>[] | null; error: any | null };
      const categoriesResponse = promiseResults[2] as { data: TransactionCategory[] | null; error: any | null };

      if (accountsResponse.error) throw accountsResponse.error;
      if (transactionsResponse.error) throw transactionsResponse.error;
      if (categoriesResponse.error) throw categoriesResponse.error;

      const fetchedAccounts = accountsResponse.data || [];
      const fetchedCategories = categoriesResponse.data || [];
      setFinancialAccounts(fetchedAccounts);
      setTransactionCategories(fetchedCategories);
      
      const processedTransactions = (transactionsResponse.data || []).map(tx => {
        // Find account name from fetchedAccounts (can be slow for many transactions, consider optimizing later if needed)
        const account = fetchedAccounts.find(acc => acc.id === tx.financial_account_id);
        // Find category name from fetchedCategories
        const category = fetchedCategories.find(cat => cat.id === tx.transaction_category_id);

        return {
          ...tx,
          account_name: account?.name || 'N/A',
          category_name: category?.name || 'Uncategorized',
          category_icon: category?.icon_name,
          category_color: category?.color_hex,
        } as Transaction; // Cast to final Transaction type
      });
      setTransactions(processedTransactions);

      // TODO: Calculate spending by category from processedTransactions and categoriesResponse.data
      setSpendingByCategory([]); 

    } catch (error: any) {
      console.error('Error fetching financial data:', error);
      setDataError(`Failed to load financial data: ${error.message}`);
      // Clear data on error to avoid showing stale info
      setFinancialAccounts([]);
      setTransactions([]);
      setTransactionCategories([]);
      setSpendingByCategory([]);
    } finally {
      setIsLoadingData(false);
    }
  }, [supabase]);

  const fetchTrustAccessPermission = useCallback(async (userId: string) => {
    if (!userId) return;
    try {
      console.log(`Checking trust access for user: ${userId} (DEBUGGING 406 ERROR)`);
      const { data, error, status } = await supabase
        .from('user_trust_access')
        .select('*') // DEBUG: Changed from 'can_access_trust_module' to '*'.
        .eq('user_id', userId)
        .maybeSingle(); // Using maybeSingle() as user might not have an entry, which is fine.

      console.log('Trust access response:', { data, error, status });

      if (error && error.code !== 'PGRST116') { // PGRST116: single row expected, but 0 rows found (no explicit grant/deny for this user)
        console.error('Supabase error fetching trust access (code != PGRST116):', error);
        throw error;
      }
      
      if (data?.can_access_trust_module) {
        setCanUserAccessTrustModule(true);
      } else {
        setCanUserAccessTrustModule(false); // Default to false if no record, explicitly false, or column not present after select('*')
      }
    } catch (error: any) {
      console.error('Error fetching trust access permission (catch block):', error.message);
      setCanUserAccessTrustModule(false); // Default to no access on error
    }
  }, [supabase]);

  useEffect(() => {
    if (user?.id) {
      fetchAllFinancialData(user.id);
      fetchTrustAccessPermission(user.id);
    }
  }, [user, fetchAllFinancialData, fetchTrustAccessPermission]);

  const handleConnectNewBankAccount = async () => {
    setIsConnectingBank(true);
    setConnectionStatus('Initializing connection with Open Banking provider...');
    try {
      const response = await fetch('/api/openbanking/initiate-link', { method: 'POST' });
      if (!response.ok) throw new Error(`Failed to initiate link: ${response.statusText}`);
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

  // ADD: Function to handle Google OAuth redirection
  const handleGoogleAuthRedirect = () => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      console.error('Google Client ID not found. Make sure NEXT_PUBLIC_GOOGLE_CLIENT_ID is set.');
      setGoogleAuthError('Configuration error: Google Client ID is missing.');
      return;
    }

    const redirectUri = `${window.location.origin}/api/auth/google/callback`;

    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/drive.file'
    ];

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.append('client_id', googleClientId);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', scopes.join(' '));
    authUrl.searchParams.append('access_type', 'offline'); // Important to get a refresh token
    authUrl.searchParams.append('prompt', 'consent'); // Forces consent screen, useful for dev/testing
    // authUrl.searchParams.append('state', 'YOUR_CSRF_TOKEN_HERE'); // Optional: for CSRF protection

    window.location.href = authUrl.toString();
  };

  // ADD: Placeholder for actual export function, to be called after auth
  const handleExportToGoogleSheets = async () => {
    setGoogleAuthMessage('Attempting to export transactions...');
    setGoogleAuthError(null);
    try {
      const response = await fetch('/api/google/export-transactions', { method: 'POST' });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Failed to export: ${response.statusText}`);
      }
      setGoogleAuthMessage(`Export successful! View your sheet: ${result.spreadsheetUrl}`);
      console.log('Export result:', result);
    } catch (err: any) {
      console.error('Error exporting to Google Sheets:', err);
      setGoogleAuthError(err.message || 'Could not export transactions.');
      setGoogleAuthMessage(null);
    }
  };

  if (loadingUser || (user && isLoadingData)) { // Show loading if user is loading OR if user is loaded but data is still loading
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-cyan-600" />
        <p className="ml-3 text-xl">{loadingUser ? 'Loading user data...' : 'Loading financial data...'}</p>
      </div>
    );
  }
  
  if (!user && !loadingUser) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center">
        <p className="text-xl mb-4">You need to be logged in to view your finances.</p>
        <Link href="/login?redirectedFrom=/finances" className="text-cyan-600 hover:text-cyan-700">
          Go to Login
        </Link>
      </div>
    );
  }

  // Filter accounts for display
  const bankAndCardAccounts = financialAccounts.filter(acc => acc.account_type === 'bank' || acc.account_type === 'credit_card');
  const cryptoAccounts = financialAccounts.filter(acc => acc.account_type === 'crypto_wallet');

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="w-full px-4 md:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4"><span className="text-cyan-600">//</span> Finances</h1>
        <p className="text-xl text-gray-700 max-w-4xl">
          Track your income, expenses, and financial goals across all your projects and investments.
        </p>
      </header>

      {/* Financial Overview */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Financial Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 shadow-lg p-6 text-center">
            <FaDollarSign className="text-green-600 text-3xl mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Total Income</h3>
            <p className="text-2xl font-bold text-gray-900">$18,750</p>
            <p className="text-sm text-gray-500">This Month</p>
            <div className="mt-2">
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                +15% from last month
              </span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-lg p-6 text-center">
            <FaCreditCard className="text-red-600 text-3xl mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Expenses</h3>
            <p className="text-2xl font-bold text-gray-900">$6,300</p>
            <p className="text-sm text-gray-500">This Month</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: '34%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">34% of income</p>
          </div>

          <div className="bg-white border border-gray-200 shadow-lg p-6 text-center">
            <FaChartLine className="text-cyan-600 text-3xl mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Net Profit</h3>
            <p className="text-2xl font-bold text-gray-900">$12,450</p>
            <p className="text-sm text-gray-500">This Month</p>
            <div className="mt-2">
              <span className="text-xs text-cyan-600 bg-cyan-100 px-2 py-1 rounded-full">
                66% profit margin
              </span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-lg p-6 text-center">
            <FaPiggyBank className="text-purple-600 text-3xl mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Savings</h3>
            <p className="text-2xl font-bold text-gray-900">$45,200</p>
            <p className="text-sm text-gray-500">Total</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '78%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">78% of goal</p>
          </div>
        </div>

        {/* Additional Financial Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h4 className="font-semibold text-lg mb-4 text-cyan-600">Income Sources</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Freelance Projects</span>
                <span className="font-medium">$12,450</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Consulting</span>
                <span className="font-medium">$4,200</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Token Rewards</span>
                <span className="font-medium">$1,800</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Platform Revenue</span>
                <span className="font-medium">$300</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-green-600">$18,750</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h4 className="font-semibold text-lg mb-4 text-cyan-600">Expense Categories</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Software & Tools</span>
                <span className="font-medium">$2,100</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Marketing</span>
                <span className="font-medium">$1,800</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Office & Equipment</span>
                <span className="font-medium">$1,200</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Professional Services</span>
                <span className="font-medium">$900</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Other</span>
                <span className="font-medium">$300</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-red-600">$6,300</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h4 className="font-semibold text-lg mb-4 text-cyan-600">Financial Goals</h4>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700">Emergency Fund</span>
                  <span className="font-medium">$25,000 / $30,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '83%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700">Equipment Fund</span>
                  <span className="font-medium">$12,200 / $15,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '81%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700">Business Expansion</span>
                  <span className="font-medium">$8,000 / $25,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '32%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Tools */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Financial Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 border border-gray-200 shadow-lg rounded-lg">
            <div className="flex items-center mb-4">
              <FaFileInvoiceDollar className="text-cyan-600 mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Invoice Tracker</h3>
            </div>
            <p className="text-gray-600 mb-4">Track sent invoices, payment status, and outstanding amounts.</p>
            <div className="text-gray-500 text-sm">
              Coming Soon
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-200 shadow-lg rounded-lg">
            <div className="flex items-center mb-4">
              <FaWallet className="text-gray-400 mr-3 text-xl" />
              <h3 className="font-semibold text-xl text-gray-700">Expense Tracker</h3>
            </div>
            <p className="text-gray-600 mb-4">Log and categorize your business expenses for tax purposes.</p>
            <div className="text-gray-500 text-sm">
              Coming Soon
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-200 shadow-lg rounded-lg">
            <div className="flex items-center mb-4">
              <FaChartLine className="text-gray-400 mr-3 text-xl" />
              <h3 className="font-semibold text-xl text-gray-700">Financial Reports</h3>
            </div>
            <p className="text-gray-600 mb-4">Generate detailed financial reports and analytics.</p>
            <div className="text-gray-500 text-sm">
              Coming Soon
            </div>
          </div>
        </div>
      </section>

      {/* Crypto & Token Holdings */}
      <section className="px-4 md:px-8 py-8 mb-16 bg-gray-50 border border-gray-200 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Crypto & Token Holdings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">$RAFS Token</h3>
            <p className="text-gray-600 mb-4">Your RafsKitchen ecosystem token holdings and staking rewards</p>
            <Link
              href="/tokens"
              className="inline-flex items-center text-cyan-600 hover:text-cyan-700 font-medium"
            >
              View Token Details →
            </Link>
          </div>

          <div className="p-6 border-l-2 border-gray-300">
            <h3 className="font-bold text-xl mb-2 text-gray-700">Portfolio Tracker</h3>
            <p className="text-gray-600 mb-4">Track your cryptocurrency and token portfolio performance</p>
            <div className="text-gray-500 text-sm">
              Coming Soon
            </div>
          </div>

          <div className="p-6 border-l-2 border-gray-300">
            <h3 className="font-bold text-xl mb-2 text-gray-700">DeFi Positions</h3>
            <p className="text-gray-600 mb-4">Monitor your DeFi investments and yield farming positions</p>
            <div className="text-gray-500 text-sm">
              Coming Soon
            </div>
          </div>

          <div className="p-6 border-l-2 border-gray-300">
            <h3 className="font-bold text-xl mb-2 text-gray-700">Tax Reporting</h3>
            <p className="text-gray-600 mb-4">Generate crypto tax reports for compliance</p>
            <div className="text-gray-500 text-sm">
              Coming Soon
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Financial Resources</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <Link href="/tokens" className="hover:text-cyan-600">Token Portfolio</Link></li>
              <li>• <Link href="/gigs" className="hover:text-cyan-600">Freelance Earnings</Link></li>
              <li>• <Link href="/projects" className="hover:text-cyan-600">Project Revenue</Link></li>
              <li>• <Link href="/profile" className="hover:text-cyan-600">Financial Settings</Link></li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">External Tools</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <a href="https://1sat.market" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-600">1Sat.Market Trading</a></li>
              <li>• <Link href="/services/defi-exchange" className="hover:text-cyan-600">DeFi Services</Link></li>
              <li>• <Link href="/services/tokenization-services" className="hover:text-cyan-600">Tokenization</Link></li>
              <li>• <Link href="/contact" className="hover:text-cyan-600">Financial Consulting</Link></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Demo Notice */}
      <section className="px-4 md:px-8 py-16 text-center mb-12">
        <div className="max-w-4xl mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Demo Mode</h3>
          <p className="text-yellow-700 mb-4">
            You're viewing a demo version of the finances dashboard. In the full version, you would have access to:
          </p>
          <ul className="text-yellow-700 text-sm space-y-1 mb-4">
            <li>• Real-time financial tracking and reporting</li>
            <li>• Automated invoice and expense management</li>
            <li>• Crypto portfolio tracking and tax reporting</li>
            <li>• Integration with banking and payment platforms</li>
            <li>• Advanced financial analytics and forecasting</li>
          </ul>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
} 