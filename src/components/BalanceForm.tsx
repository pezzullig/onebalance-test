'use client';

import React, { useState } from 'react';
import BalanceCard from './BalanceCard';

interface Balances {
  ETH?: string;
  USDC?: string;
  LINK?: string;
  [key: string]: string | undefined;
}

export default function BalanceForm() {
  const [address, setAddress] = useState('');
  const [balances, setBalances] = useState<Balances | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedAddress, setSubmittedAddress] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setBalances(null);
    setError(null);
    setSubmittedAddress(null);

    try {
      const response = await fetch(`/api/balance?address=${address}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Error: ${response.status}`);
      }

      setBalances(data.balances);
      setSubmittedAddress(address);
    } catch (err) {
      console.error('API call failed:', err);
      const errorMessage = (err instanceof Error) ? err.message : 'Failed to fetch balances.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="p-6 md:p-8 bg-gray-50 border border-gray-200 rounded-xl shadow-lg mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-black mb-2">Ethereum Balance Checker</h1>
        <p className="text-center text-gray-600 mb-6">Enter an Ethereum address to check its ETH, USDC, and LINK balances.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="address" className="sr-only">Ethereum Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              required
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Ethereum Address"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !address}
            className="w-full px-4 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-50 transition duration-150 ease-in-out disabled:opacity-60 disabled:cursor-wait"
          >
            {isLoading ? 'Checking...' : 'Check Balance'}
          </button>
        </form>
      </div>

      {isLoading && (
        <div className="mt-6 text-center text-gray-500">
          <p>Loading balances...</p>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-300 text-red-700 rounded-xl text-center shadow-lg">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {balances && submittedAddress && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center text-black">Balances for:</h2>
          <p className="text-sm text-center text-gray-500 break-all mb-4">{submittedAddress}</p>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(balances).map(([token, balance]) => (
              balance !== undefined ? (
                <BalanceCard key={token} token={token} balance={balance} />
              ) : null
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 