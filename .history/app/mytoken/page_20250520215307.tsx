'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaUserCircle, FaProjectDiagram, FaUsers, FaPlusCircle, FaCubes, FaExternalLinkAlt, FaEthereum, FaCoins } from 'react-icons/fa';
import { SiBitcoinsv, SiSolana } from 'react-icons/si';

// New Token Interface
interface Token {
  id: string;
  name: string;
  ticker_symbol: string;
  token_category: 'profile' | 'project' | 'team';
  token_chain: 'BSV' | 'SOL' | 'ETH' | null; // Nullable if not yet set
  total_supply: number | null;
  dividend_bearing: boolean;
  mint_public_address?: string; // Optional for UI
  // mint_private_key is not needed for UI
}

// Dummy data using the new Token interface
const dummyProfileToken: Token | null = {
  id: 'user1-token',
  name: 'My Profile Token',
  ticker_symbol: '$MYSELF',
  token_category: 'profile',
  token_chain: 'ETH',
  total_supply: 1000000,
  dividend_bearing: true,
};

const dummyProjectTokens: Token[] = [
  {
    id: 'proj1-token',
    name: 'Project Alpha Token',
    ticker_symbol: '$ALPHA',
    token_category: 'project',
    token_chain: 'SOL',
    total_supply: 10000000,
    dividend_bearing: false,
  },
  {
    id: 'proj2-token',
    name: 'Project Beta Initiative', // Example of a project that hasn't launched its token yet
    ticker_symbol: '$BETA',
    token_category: 'project',
    token_chain: null, // Not yet launched/selected
    total_supply: null,
    dividend_bearing: false,
  },
];

const dummyTeamTokens: Token[] = []; // Start with no team tokens to show placeholder

const MyTokenPage = () => {
  const [profileToken, setProfileToken] = useState<Token | null>(null); // Set to null initially to show "haven't launched"
  const [projectTokens, setProjectTokens] = useState<Token[]>(dummyProjectTokens);
  const [teamTokens, setTeamTokens] = useState<Token[]>(dummyTeamTokens);

  // useEffect to simulate fetching data - remove when actual fetching is implemented
  useEffect(() => {
    // Simulate fetching profile token, set to dummyProfileToken or null
    // setProfileToken(dummyProfileToken); 
  }, []);


  // TODO: Fetch actual user profile token, project tokens, and team tokens data
  // TODO: Implement wallet connection logic

  const getChainIcon = (chain: Token['token_chain']) => {
    if (chain === 'BSV') return <SiBitcoinsv className="mr-1.5 text-yellow-500" />;
    if (chain === 'SOL') return <SiSolana className="mr-1.5 text-purple-500" />;
    if (chain === 'ETH') return <FaEthereum className="mr-1.5 text-gray-400" />;
    return <FaCoins className="mr-1.5 text-gray-500" />; // Default/unknown
  };

  return (
    <div className="space-y-12 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-0 flex items-center">
          <FaCubes className="mr-3 text-sky-500" /> My Tokens Dashboard
        </h1>
        <button 
          className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-base font-medium transition-colors flex items-center"
          // onClick={handleConnectWallet} // TODO: Add connect wallet handler
        >
          Connect Wallet
        </button>
      </div>

      {/* Profile Token Section */}
      <section className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-xl">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
          <FaUserCircle className="mr-2 text-sky-400" /> Profile Token
        </h2>
        {profileToken ? (
          <div className="space-y-3">
            <div className="flex items-center">
              {getChainIcon(profileToken.token_chain)}
              <h3 className="text-xl font-medium text-white">{profileToken.name} <span className="text-sky-400">({profileToken.ticker_symbol})</span></h3>
            </div>
            <p className="text-sm text-gray-400">
              Chain: <span className="font-medium text-gray-300">{profileToken.token_chain || 'Not set'}</span>
            </p>
            <p className="text-sm text-gray-400">
              Total Supply: <span className="font-medium text-gray-300">{profileToken.total_supply ? profileToken.total_supply.toLocaleString() : 'Not set'}</span>
            </p>
            <p className="text-sm text-gray-400">
              Dividend Bearing: <span className={`font-medium ${profileToken.dividend_bearing ? 'text-green-400' : 'text-red-400'}`}>{profileToken.dividend_bearing ? 'Yes' : 'No'}</span>
            </p>
            <button className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors">
              Manage Profile Token
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-300 mb-3">You haven't launched a profile token yet.</p>
            <button className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors">
              <FaPlusCircle className="mr-2" /> Launch Profile Token
            </button>
          </div>
        )}
      </section>

      {/* Project Tokens Section */}
      <section className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-xl">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
          <FaProjectDiagram className="mr-2 text-sky-400" /> Project Tokens
        </h2>
        {projectTokens.length > 0 ? (
          <ul className="space-y-4">
            {projectTokens.map((token) => (
              <li key={token.id} className="p-4 bg-gray-750 rounded-md border border-gray-600">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center mb-1">
                       {getChainIcon(token.token_chain)}
                      <h3 className="text-lg font-medium text-white">{token.name}</h3>
                    </div>
                     <p className="text-xs text-sky-400 ml-1">{token.ticker_symbol || 'No Ticker'}</p>
                  </div>
                  {token.total_supply !== null ? ( // Assuming if total_supply is set, token is launched
                    <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs transition-colors whitespace-nowrap">
                      Manage Token
                    </button>
                  ) : (
                    <button className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs transition-colors whitespace-nowrap">
                      <FaPlusCircle className="mr-1.5" /> Launch Token
                    </button>
                  )}
                </div>
                <div className="text-xs text-gray-400 space-y-0.5 pl-1">
                  <p>Chain: <span className="font-medium text-gray-300">{token.token_chain || 'Not set'}</span></p>
                  <p>Supply: <span className="font-medium text-gray-300">{token.total_supply ? token.total_supply.toLocaleString() : 'Not set'}</span></p>
                  <p>Dividends: <span className={`font-medium ${token.dividend_bearing ? 'text-green-400' : 'text-red-400'}`}>{token.dividend_bearing ? 'Yes' : 'No'}</span></p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4">
            <FaProjectDiagram className="mx-auto text-3xl text-gray-500 mb-3" />
            <p className="text-gray-400 mb-2">
              When you create or join projects, you'll be able to launch and manage their dedicated tokens from this section. 
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Project tokens can represent equity, utility, or rewards within your project's ecosystem.
            </p>
            <Link href="/myprojects" className="inline-flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-sm transition-colors">
              Go to My Projects <FaExternalLinkAlt className="ml-2 w-3 h-3" />
            </Link>
          </div>
        )}
      </section>

      {/* Team Tokens Section */}
      <section className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-xl">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
          <FaUsers className="mr-2 text-sky-400" /> Team Tokens
        </h2>
        {teamTokens.length > 0 ? (
          <ul className="space-y-4">
            {teamTokens.map((token) => (
              <li key={token.id} className="p-4 bg-gray-750 rounded-md border border-gray-600">
                <div className="flex justify-between items-start mb-2">
                  <div>
                     <div className="flex items-center mb-1">
                       {getChainIcon(token.token_chain)}
                      <h3 className="text-lg font-medium text-white">{token.name}</h3>
                    </div>
                    <p className="text-xs text-sky-400 ml-1">{token.ticker_symbol || 'No Ticker'}</p>
                  </div>
                  {token.total_supply !== null ? (
                    <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs transition-colors whitespace-nowrap">
                      Manage Token
                    </button>
                  ) : (
                    <button className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs transition-colors whitespace-nowrap">
                      <FaPlusCircle className="mr-1.5" /> Launch Token
                    </button>
                  )}
                </div>
                 <div className="text-xs text-gray-400 space-y-0.5 pl-1">
                  <p>Chain: <span className="font-medium text-gray-300">{token.token_chain || 'Not set'}</span></p>
                  <p>Supply: <span className="font-medium text-gray-300">{token.total_supply ? token.total_supply.toLocaleString() : 'Not set'}</span></p>
                  <p>Dividends: <span className={`font-medium ${token.dividend_bearing ? 'text-green-400' : 'text-red-400'}`}>{token.dividend_bearing ? 'Yes' : 'No'}</span></p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4">
            <FaUsers className="mx-auto text-3xl text-gray-500 mb-3" />
            <p className="text-gray-400 mb-2">
              Once you form or become part of a team, this area will allow you to launch and manage your team's token.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Team tokens can be used for governance, shared resources, or collaborative incentives.
            </p>
            <Link href="/team" className="inline-flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-sm transition-colors">
              Go to My Teams <FaExternalLinkAlt className="ml-2 w-3 h-3" />
            </Link>
          </div>
        )}
      </section>

    </div>
  );
};

export default MyTokenPage; 