import React from 'react';
import Image from 'next/image'; // Import Next.js Image component
import { formatBalance } from '@/lib/utils';

interface BalanceCardProps {
  token: string;
  balance: string;
}

// Store logo URLs
const LOGO_URLS: { [key: string]: string } = {
  ETH: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
  USDC: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  LINK: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png',
};

export default function BalanceCard({ token, balance }: BalanceCardProps) {
  const formattedBalance = formatBalance(balance);
  const logoUrl = LOGO_URLS[token];

  // Removed token-specific background/accent color logic

  return (
    <div className={`p-4 rounded-xl shadow-sm bg-white border border-gray-200 flex items-center space-x-4`}>
      {logoUrl && (
        <Image
          src={logoUrl}
          alt={`${token} logo`}
          width={40}
          height={40}
          className="rounded-full bg-white border border-gray-100 p-1"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <span className={`text-lg font-semibold text-gray-800`}>{token}</span>
        </div>
        <p className={`text-xl md:text-2xl font-mono break-all text-black`}>
          {formattedBalance}
        </p>
      </div>
    </div>
  );
} 