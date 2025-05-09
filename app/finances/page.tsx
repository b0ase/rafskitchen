'use client';

import React, { useState, useEffect } from 'react';
import { FaUniversity, FaBitcoin, FaExchangeAlt, FaPlusCircle, FaTable, FaChartPie, FaSignOutAlt, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';

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

export default function FinancesPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // State for Open Banking connection process
  const [isConnectingBank, setIsConnectingBank] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(''); // e.g., 'Initializing...', 'Provider Loaded', 'Error'

  // Check local storage on mount for persisted authentication
  useEffect(() => {
    const storedAuth = localStorage.getItem('financesAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      const response = await fetch('/api/finances-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        // Handle non-2xx responses (e.g., 500 server error)
        const errorData = await response.json().catch(() => ({})); // Try to parse error, or default to empty object
        setError(errorData.message || 'Authentication request failed. Please try again.');
        return;
      }

      const data = await response.json();
      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('financesAuthenticated', 'true');
        setError('');
      } else {
        setError('Incorrect password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('financesAuthenticated');
    setPassword('');
    setError('');
    setIsConnectingBank(false); // Reset connection state on logout
    setConnectionStatus('');
  };

  const handleConnectNewBankAccount = async () => {
    setIsConnectingBank(true);
    setConnectionStatus('Initializing connection with Open Banking provider...');
    try {
      // Step 2: Frontend calls Your Backend for a link_token
      const response = await fetch('/api/openbanking/initiate-link', { method: 'POST' });
      if (!response.ok) {
        throw new Error(`Failed to initiate link: ${response.statusText}`);
      }
      const data = await response.json();
      
      if (data.link_token) {
        setConnectionStatus(`Link token received. Provider SDK would open now with token: ${data.link_token}`);
        // In a real app, you would now initialize Plaid Link (or other provider SDK) with this token.
        // For example: const { open, ready } = usePlaidLink({ token: data.link_token, onSuccess: (public_token, metadata) => { /* send public_token to backend */ } });
        // open();
        console.log('Mock: Plaid Link would open here with token:', data.link_token);
        // Simulate some time for the user to interact with the provider
        setTimeout(() => {
            setConnectionStatus('Simulating successful bank connection! Public token would be sent to backend.');
            setIsConnectingBank(false);
            // Here you would normally get a public_token and send it to your backend
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col">
        <main className="flex-grow flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-sm bg-gray-900 p-8 shadow-lg border border-gray-800">
            <h1 className="text-xl font-bold text-white mb-4 text-center">Finances Access</h1>
            <p className="text-sm text-gray-400 mb-6 text-center">Enter the password to view financial information.</p>
            <form onSubmit={handleLogin}>
              <div className="mb-4 relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1 sr-only">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm pr-10"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {error && <p className="text-red-500 text-xs mb-4 text-center">{error}</p>}
              <button type="submit" className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 transition duration-300 shadow-md">
                View Finances
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  // If authenticated, show finances content
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Financial Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-sm font-medium transition-colors shadow-md flex items-center"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
        
        {/* Account Connections Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-700 pb-3">Account Connections</h2>
          
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
              {dummyBankAccounts.map(acc => (
                <div key={acc.id} className="p-4 bg-gray-800 border border-gray-700">
                  <p className="font-semibold text-white">{acc.name}</p>
                  <p className="text-lg text-gray-300">{acc.balance}</p>
                  <p className={`text-xs ${acc.status === 'Connected' ? 'text-green-400' : 'text-yellow-400'}`}>{acc.status}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptocurrency Wallets */}
          <div className="mb-8 p-6 bg-gray-900 border border-gray-800 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-yellow-400 flex items-center"><FaBitcoin className="mr-3" /> Cryptocurrency Wallets</h3>
              {/* Placeholder for adding wallet */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {dummyCryptoWallets.map(wallet => (
                <div key={wallet.id} className="p-4 bg-gray-800 border border-gray-700">
                  <p className="font-semibold text-white">{wallet.name}</p>
                  <p className="text-xs text-gray-500 truncate">{wallet.address}</p>
                  <p className="text-lg text-gray-300">{wallet.balance}</p>
                </div>
              ))}
            </div>
            <div className="flex">
                <input type="text" placeholder="Enter Wallet Address (e.g., ETH, BTC)" className="flex-grow px-3 py-2 bg-gray-800 border border-gray-600 text-gray-200 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none mr-2" />
                <button className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 text-sm font-medium flex items-center"><FaPlusCircle className="mr-2" /> Add Wallet</button>
            </div>
          </div>

          {/* Cryptocurrency Exchanges */}
          <div className="p-6 bg-gray-900 border border-gray-800 shadow-lg">
            <h3 className="text-xl font-medium text-purple-400 flex items-center mb-4"><FaExchangeAlt className="mr-3" /> Cryptocurrency Exchanges</h3>
            <div className="flex space-x-4">
              <button className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 text-sm font-medium flex items-center"><FaPlusCircle className="mr-2" /> Connect Coinbase</button>
              <button className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 text-sm font-medium flex items-center"><FaPlusCircle className="mr-2" /> Connect Binance</button>
            </div>
          </div>
        </section>

        {/* Financial Overview Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-700 pb-3 flex items-center"><FaTable className="mr-3" /> Transactions Overview</h2>
          <div className="bg-gray-900 p-6 border border-gray-800 shadow-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Source/Account</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Income</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Outgoing</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-700">
                {dummyTransactions.map(tx => (
                  <tr key={tx.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{tx.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{tx.description}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-700 text-gray-200">{tx.category}</span></td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{tx.source}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-green-400">{tx.income}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-red-400">{tx.outgoing}</td>
                  </tr>
                ))}
                 <tr>
                    <td colSpan={4} className="px-4 py-3 text-right text-sm font-semibold text-gray-200">Totals:</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-semibold text-green-400">£5,200.00</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-semibold text-red-400">£1,265.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Spending by Category Section */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-700 pb-3 flex items-center"><FaChartPie className="mr-3" /> Spending by Category</h2>
          <div className="bg-gray-900 p-6 border border-gray-800 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dummySpendingByCategory.map(cat => (
                    <div key={cat.category} className="p-4 bg-gray-800 border border-gray-700">
                        <div className="flex justify-between items-baseline">
                            <h4 className="text-md font-medium text-gray-200">{cat.category}</h4>
                            <span className="text-xs text-gray-400">({cat.percentage})</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{cat.amount}</p>
                         {/* Basic progress bar placeholder */}
                        <div className="w-full bg-gray-700 h-2 mt-2">
                            <div className="bg-blue-500 h-2" style={{ width: cat.percentage }}></div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Placeholder for a more detailed chart component */}
            <p className="text-center text-gray-500 mt-6 italic">Chart visualization coming soon.</p>
          </div>
        </section>

      </main>
    </div>
  );
} 