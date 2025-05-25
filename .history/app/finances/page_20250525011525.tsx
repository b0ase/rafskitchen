'use client';

import React, { useState, useEffect, useCallback } from 'react';
import getSupabaseBrowserClient from '@/lib/supabase/client'; // Adjust path if needed
import { User } from '@supabase/supabase-js';
import { FaUniversity, FaBitcoin, FaExchangeAlt, FaPlusCircle, FaTable, FaChartPie, FaSpinner, FaGoogle, FaDollarSign, FaChartLine, FaCreditCard, FaWallet, FaFileInvoiceDollar, FaPiggyBank, FaExternalLinkAlt, FaShoppingBag } from 'react-icons/fa';
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
  category_icon?: string | null; // Added for UI consistency
  category_color?: string | null; // Added for UI consistency
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

  const [canUserAccessTrustModule, setCanUserAccessTrustModule] = useState(false);
  const [isConnectingBank, setIsConnectingBank] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('');
  const [googleAuthMessage, setGoogleAuthMessage] = useState<React.ReactNode | null>(null);
  const [googleAuthError, setGoogleAuthError] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const authStatus = searchParams.get('google_auth_status');
    const authError = searchParams.get('error');
    const authMessage = searchParams.get('message');

    if (authStatus === 'success') {
      setGoogleAuthMessage('Successfully connected your Google account!');
      setGoogleAuthError(null);
      router.replace('/finances', { scroll: false });
    } else if (authError && authError.startsWith('google_')) {
      setGoogleAuthError(authMessage || 'An error occurred with Google authentication.');
      setGoogleAuthMessage(null);
      router.replace('/finances', { scroll: false });
    }
  }, [router]);

  useEffect(() => {
    const getUser = async () => {
      setLoadingUser(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      } else {
        router.push('/login?redirectedFrom=/finances');
      }
      setLoadingUser(false);
    };
    getUser();
  }, [supabase, router]);

  const fetchAllFinancialData = useCallback(async (userId: string) => {
    if (!userId) return;
    setIsLoadingData(true);
    setDataError(null);
    try {
      const transactionSelect = '*';
      const promiseResults = await Promise.all([
        supabase.from('financial_accounts').select('*').eq('user_id', userId).order('name'),
        supabase.from('transactions').select(transactionSelect).eq('user_id', userId).order('transaction_date', { ascending: false }),
        supabase.from('transaction_categories').select('*').or(`user_id.eq.${userId},is_system_default.eq.true`).order('name')
      ]);
      const accountsResponse = promiseResults[0] as { data: FinancialAccount[] | null; error: any | null };
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
        const account = fetchedAccounts.find(acc => acc.id === tx.financial_account_id);
        const category = fetchedCategories.find(cat => cat.id === tx.transaction_category_id);
        return {
          ...tx,
          account_name: account?.name || 'N/A',
          category_name: category?.name || 'Uncategorized',
          category_icon: category?.icon_name,
          category_color: category?.color_hex,
        } as Transaction;
      });
      setTransactions(processedTransactions);
      // Mock spending data for now
      if (fetchedCategories.length > 0 && processedTransactions.length > 0) {
        setSpendingByCategory([
          { category_id: '1', category_name: fetchedCategories[0]?.name || 'Food & Drink', amount: 570.50, percentage: 35, color_hex: '#34D399', icon_name: 'FaUtensils' },
          { category_id: '2', category_name: fetchedCategories[1]?.name || 'Shopping', amount: 320.00, percentage: 20, color_hex: '#60A5FA', icon_name: 'FaShoppingBag' },
          { category_id: '3', category_name: fetchedCategories[2]?.name || 'Transport', amount: 150.75, percentage: 10, color_hex: '#FBBF24', icon_name: 'FaCar' },
        ]);
      } else {
        setSpendingByCategory([]);
      }
    } catch (error: any) {
      setDataError(`Failed to load financial data: ${error.message}`);
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
      const { data, error } = await supabase
        .from('user_trust_access')
        .select('can_access_trust_module')
        .eq('user_id', userId)
        .maybeSingle();
      if (error && error.code !== 'PGRST116') throw error;
      setCanUserAccessTrustModule(data?.can_access_trust_module || false);
    } catch (error: any) {
      setCanUserAccessTrustModule(false);
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
    setConnectionStatus('Initializing connection...');
    try {
      const response = await fetch('/api/openbanking/initiate-link', { method: 'POST' });
      if (!response.ok) throw new Error(`Failed to initiate link: ${response.statusText}`);
      const data = await response.json();
      if (data.link_token) {
        setConnectionStatus(`Mock: Plaid Link would open with token: ${data.link_token}`);
        setTimeout(() => {
          setConnectionStatus('Simulated successful bank connection!');
          setIsConnectingBank(false);
          fetchAllFinancialData(user!.id); // Refresh data
        }, 3000);
      } else {
        throw new Error(data.error || 'Failed to get link_token.');
      }
    } catch (err: any) {
      setConnectionStatus(`Error: ${err.message}`);
      setIsConnectingBank(false);
    }
  };

  const handleGoogleAuthRedirect = () => {
    const googleAuthUrl = '/api/gdrive-auth/authorize';
    window.location.href = googleAuthUrl;
  };

  const handleExportToGoogleSheets = async () => {
    setGoogleAuthMessage('Exporting to Google Sheets...');
    setGoogleAuthError(null);
    try {
      const response = await fetch('/api/gdrive-auth/export-transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions }),
      });
      const result = await response.json();
      if (response.ok) {
        setGoogleAuthMessage(
          <span>Export successful! <a href={result.spreadsheetUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Sheet</a></span>
        );
      } else if (response.status === 401) { // Unauthorized, likely needs re-auth
        setGoogleAuthError('Google authorization required. Please connect your Google account.');
        setGoogleAuthMessage(null);
      } else {
        throw new Error(result.error || 'Failed to export to Google Sheets');
      }
    } catch (error: any) {
      setGoogleAuthError(`Error exporting: ${error.message}`);
      setGoogleAuthMessage(null);
    }
  };
  
  if (loadingUser) {
    return <div className="min-h-screen bg-white flex items-center justify-center"><FaSpinner className="animate-spin text-4xl text-blue-600" /></div>;
  }

  // Simplified icon getter for categories - extend as needed
  const getCategoryIcon = (iconName?: string | null) => {
    if (iconName === 'FaShoppingBag') return <FaShoppingBag className="mr-2" />;
    if (iconName === 'FaUtensils') return <FaDollarSign className="mr-2" />;
    // Add more mappings
    return <FaDollarSign className="mr-2 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-white text-black p-4 sm:p-6 md:p-8 space-y-8">
      {/* Header Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg text-black mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <FaDollarSign className="text-3xl text-blue-600" />
            <div>
                <h1 className="text-3xl font-bold text-black">Finances</h1>
                <p className="text-gray-600 text-sm">Manage your financial accounts, transactions, and insights.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button 
              onClick={handleConnectNewBankAccount}
              disabled={isConnectingBank}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center text-sm whitespace-nowrap disabled:opacity-50"
            >
              <FaPlusCircle className="mr-2" /> {isConnectingBank ? 'Connecting...' : 'Connect Bank Account'}
            </button>
            <button 
              onClick={handleExportToGoogleSheets}
              className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center text-sm whitespace-nowrap"
            >
              <FaGoogle className="mr-2" /> Export to Sheets
            </button>
          </div>
        </div>
        {connectionStatus && <p className={`mt-3 text-sm ${connectionStatus.startsWith('Error') ? 'text-red-600' : 'text-gray-600'}`}>{connectionStatus}</p>}
      </div>

      {isLoadingData && <div className="flex justify-center py-8"><FaSpinner className="animate-spin text-3xl text-blue-600" /></div>}
      {dataError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg mb-6" role="alert">{dataError}</div>}
      
      {/* Google Auth Messages */}
      {googleAuthMessage && <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg">{googleAuthMessage}</div>}
      {googleAuthError && 
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
            <p>{googleAuthError}</p>
            <button onClick={handleGoogleAuthRedirect} className="mt-2 text-sm font-semibold text-red-800 hover:underline">Connect Google Account Now</button>
        </div>
      }

      {/* Financial Accounts Section */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-black mb-4">Financial Accounts</h2>
        {financialAccounts.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {financialAccounts.map(acc => (
              <li key={acc.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-black">{acc.name}</h3>
                <p className="text-sm text-gray-600">{acc.provider_name || acc.account_type}</p>
                <p className="text-xl font-bold text-blue-600 mt-1">{acc.current_balance?.toLocaleString(undefined, {style: 'currency', currency: acc.currency_code || 'USD'}) || 'N/A'}</p>
                <span className={`mt-2 inline-block px-2 py-0.5 text-xs rounded-full ${acc.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{acc.status || 'unknown'}</span>
              </li>
            ))}
          </ul>
        ) : (
          !isLoadingData && <p className="text-gray-600">No financial accounts linked yet. Connect a bank account to get started.</p>
        )}
      </section>

      {/* Recent Transactions Section */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-black mb-4">Recent Transactions</h2>
        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.slice(0, 10).map(tx => (
                  <tr key={tx.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(tx.transaction_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{tx.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{tx.category_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{tx.account_name}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${tx.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>{tx.amount.toLocaleString(undefined, {style: 'currency', currency: tx.currency_code || 'USD'})}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !isLoadingData && <p className="text-gray-600">No transactions found.</p>
        )}
        {transactions.length > 10 && <Link href="/finances/transactions" className="mt-4 inline-block text-sm text-blue-600 hover:underline">View all transactions →</Link>}
      </section>

      {/* Spending Overview Section (Placeholder) */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-black mb-4">Spending Overview</h2>
        {spendingByCategory.length > 0 ? (
             <ul className="space-y-3">
                {spendingByCategory.map(item => (
                    <li key={item.category_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center">
                            {getCategoryIcon(item.icon_name)} 
                            <span className="text-sm font-medium text-black">{item.category_name}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm text-gray-700 mr-3">{item.amount.toLocaleString(undefined, {style: 'currency', currency: 'USD'})}</span>
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div style={{ width: `${item.percentage}%`, backgroundColor: item.color_hex || '#60A5FA' }} className="h-full"></div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        ) : (
          !isLoadingData && <p className="text-gray-600">No spending data available yet. Transactions need to be categorized.</p>
        )}
      </section>

      {/* Boase Trust Module (Conditional) */}
      {canUserAccessTrustModule && (
        <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-black mb-4 flex items-center">
            <FaPiggyBank className="mr-2 text-blue-600" /> Boase Family Trust Management
          </h2>
          <p className="text-gray-700 mb-4">Access restricted Boase Family Trust financial details and management tools.</p>
          {/* Placeholder content for trust module */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800">Trust Balance</h3>
                <p className="text-2xl font-bold text-blue-700">$X,XXX,XXX.XX</p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800">Recent Distributions</h3>
                <p className="text-2xl font-bold text-green-700">$XX,XXX.XX</p>
            </div>
          </div>
          <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors">
            View Detailed Trust Report
          </button>
        </section>
      )}
    </div>
  );
} 