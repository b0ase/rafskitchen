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

const MyTokenPage = () => {
  const [profileToken, _setProfileToken] = useState<Token | null>(null);
  const [projectTokens, _setProjectTokens] = useState<Token[]>([]);
  const [teamTokens, _setTeamTokens] = useState<Token[]>([]);

  // TODO: Fetch actual user profile token, project tokens, and team tokens data from Supabase
  // TODO: Implement wallet connection logic
  // TODO: Implement actual token launch functionality

  const getChainIcon = (chain: Token['token_chain']) => {
    if (chain === 'BSV') return <SiBitcoinsv className="mr-1.5 text-yellow-500" />;
    if (chain === 'SOL') return <SiSolana className="mr-1.5 text-purple-600" />;
    if (chain === 'ETH') return <FaEthereum className="mr-1.5 text-gray-500" />;
    return <FaCoins className="mr-1.5 text-gray-400" />; // Default/unknown
  };

  return (
    <div className="min-h-screen bg-white text-black p-4 sm:p-6 md:p-8 space-y-8">
      {/* Header Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg text-black mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4 md:mb-0 flex items-center">
            <FaCubes className="mr-3 text-blue-600" /> My Tokens Dashboard
          </h1>
          <button 
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center"
            // onClick={handleConnectWallet} // TODO: Add connect wallet handler
          >
            Connect Wallet
          </button>
        </div>
      </div>

      {/* Profile Token Section */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-black mb-4 flex items-center">
          <FaUserCircle className="mr-2 text-blue-600" /> Profile Token
        </h2>
        {profileToken ? (
          <div className="space-y-3">
            <div className="flex items-center">
              {getChainIcon(profileToken.token_chain)}
              <h3 className="text-xl font-medium text-black">{profileToken.name} <span className="text-blue-600">({profileToken.ticker_symbol})</span></h3>
            </div>
            <p className="text-sm text-gray-700">
              Chain: <span className="font-medium text-gray-900">{profileToken.token_chain || 'Not set'}</span>
            </p>
            <p className="text-sm text-gray-700">
              Total Supply: <span className="font-medium text-gray-900">{profileToken.total_supply ? profileToken.total_supply.toLocaleString() : 'Not set'}</span>
            </p>
            <p className="text-sm text-gray-700">
              Dividend Bearing: <span className={`font-medium ${profileToken.dividend_bearing ? 'text-green-600' : 'text-red-600'}`}>{profileToken.dividend_bearing ? 'Yes' : 'No'}</span>
            </p>
            <button className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors">
              Manage Profile Token
            </button>
          </div>
        ) : (
          <div className="text-center py-4">
            <FaUserCircle className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-900 mb-3 font-semibold">Launch Your Unique Profile Token</p>
            <p className="text-gray-700 mb-2 text-sm">
              Create a personal token to represent your identity, brand, or influence within the platform.
            </p>
            <p className="text-gray-500 mb-4 text-xs">
              This can be used for exclusive access, fan engagement, or simply to tokenize your presence.
            </p>
            <button className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors">
              <FaPlusCircle className="mr-2" /> Launch Profile Token
            </button>
          </div>
        )}
      </section>

      {/* Project Tokens Section */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-black mb-4 flex items-center">
          <FaProjectDiagram className="mr-2 text-blue-600" /> Project Tokens
        </h2>
        {projectTokens.length > 0 ? (
          <ul className="space-y-4">
            {projectTokens.map((token) => (
              <li key={token.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center mb-1">
                       {getChainIcon(token.token_chain)}
                      <h3 className="text-lg font-medium text-black">{token.name}</h3>
                    </div>
                     <p className="text-xs text-blue-600 ml-1">{token.ticker_symbol || 'No Ticker'}</p>
                  </div>
                  {token.total_supply !== null ? (
                    <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap">
                      Manage Token
                    </button>
                  ) : (
                    <button className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap">
                      <FaPlusCircle className="mr-1.5" /> Launch Token for Project
                    </button>
                  )}
                </div>
                <div className="text-xs text-gray-700 space-y-0.5 pl-1">
                  <p>Chain: <span className="font-medium text-gray-900">{token.token_chain || 'Not set'}</span></p>
                  <p>Supply: <span className="font-medium text-gray-900">{token.total_supply ? token.total_supply.toLocaleString() : 'Not set'}</span></p>
                  <p>Dividends: <span className={`font-medium ${token.dividend_bearing ? 'text-green-600' : 'text-red-600'}`}>{token.dividend_bearing ? 'Yes' : 'No'}</span></p>
        </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4">
            <FaProjectDiagram className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-900 mb-3 font-semibold">Power Your Projects with Tokens</p>
            <p className="text-gray-700 mb-2 text-sm">
              When you create or join innovative projects on this platform, you can launch dedicated tokens right here.
            </p>
            <p className="text-gray-500 mb-2 text-xs">
              Project tokens can be used to fund development, grant governance rights, represent equity, or provide utility within your project's ecosystem.
            </p>
             <p className="text-gray-500 mb-4 text-xs">
              This is your hub for managing the financial engine of your creations.
            </p>
            <Link href="/myprojects" className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors">
              Go to My Projects <FaExternalLinkAlt className="ml-2 w-3 h-3" />
          </Link>
        </div>
        )}
      </section>

      {/* Team Tokens Section */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-black mb-4 flex items-center">
          <FaUsers className="mr-2 text-blue-600" /> Team Tokens
        </h2>
        {teamTokens.length > 0 ? (
          <ul className="space-y-4">
            {teamTokens.map((token) => (
              <li key={token.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                     <div className="flex items-center mb-1">
                       {getChainIcon(token.token_chain)}
                      <h3 className="text-lg font-medium text-black">{token.name}</h3>
                    </div>
                    <p className="text-xs text-blue-600 ml-1">{token.ticker_symbol || 'No Ticker'}</p>
                  </div>
                  {token.total_supply !== null ? (
                    <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap">
                      Manage Token
                    </button>
                  ) : (
                    <button className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold transition-colors whitespace-nowrap">
                      <FaPlusCircle className="mr-1.5" /> Launch Token for Team
                    </button>
                  )}
                </div>
                 <div className="text-xs text-gray-700 space-y-0.5 pl-1">
                  <p>Chain: <span className="font-medium text-gray-900">{token.token_chain || 'Not set'}</span></p>
                  <p>Supply: <span className="font-medium text-gray-900">{token.total_supply ? token.total_supply.toLocaleString() : 'Not set'}</span></p>
                  <p>Dividends: <span className={`font-medium ${token.dividend_bearing ? 'text-green-600' : 'text-red-600'}`}>{token.dividend_bearing ? 'Yes' : 'No'}</span></p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4">
            <FaUsers className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-900 mb-3 font-semibold">Collaborate with Team Tokens</p>
            <p className="text-gray-700 mb-2 text-sm">
              Once you form or become part of a team, this section will allow you to launch and manage your team's token.
            </p>
            <p className="text-gray-500 mb-2 text-xs">
              Team tokens can be used for shared governance, resource pooling, collaborative incentives, or to represent collective ownership.
            </p>
            <p className="text-gray-500 mb-4 text-xs">
               Solidify your team's synergy and goals with a dedicated token.
            </p>
            <Link href="/team" className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors">
              Go to My Teams <FaExternalLinkAlt className="ml-2 w-3 h-3" />
            </Link>
      </div>
        )}
      </section>

    </div>
  );
};

export default MyTokenPage; 