import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

// --- Cache Implementation --- >
interface CacheEntry {
  balances: { [token: string]: string };
  timestamp: number;
}

// Simple in-memory cache Map (persists across requests in the same server process)
const balanceCache = new Map<string, CacheEntry>();
const CACHE_DURATION_MS = 60 * 1000; // 60 seconds
// < --- End Cache Implementation ---

// Token contract addresses on Ethereum mainnet
const TOKEN_ADDRESSES = {
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
};

// Token decimals
const TOKEN_DECIMALS = {
  USDC: 6,
  LINK: 18,
};

// ABI for ERC20 token balance
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { error: 'Address parameter is required' },
      { status: 400 }
    );
  }

  // Validate Ethereum address *before* cache check
  if (!ethers.isAddress(address)) {
    return NextResponse.json(
      { error: 'Invalid Ethereum address' },
      { status: 400 }
    );
  }

  // --- Cache Check --- >
  const cachedEntry = balanceCache.get(address);
  if (cachedEntry && (Date.now() - cachedEntry.timestamp < CACHE_DURATION_MS)) {
    console.log(`Cache hit for address: ${address}`);
    // Return cached data
    return NextResponse.json({ balances: cachedEntry.balances });
  }
  console.log(`Cache miss or expired for address: ${address}`);
  // < --- End Cache Check ---

  try {
    // Initialize provider (using public RPC endpoint)
    // Consider moving this inside the try or making it configurable/env variable
    const provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');

    // Fetch ETH balance
    const ethBalance = await provider.getBalance(address);
    const ethBalanceInEther = ethers.formatEther(ethBalance);

    // Fetch token balances
    const tokenBalances = await Promise.allSettled(
      Object.entries(TOKEN_ADDRESSES).map(async ([token, contractAddress]) => {
        const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);
        const balance = await contract.balanceOf(address);
        const formattedBalance = ethers.formatUnits(balance, TOKEN_DECIMALS[token as keyof typeof TOKEN_DECIMALS]);
        return { token, balance: formattedBalance };
      })
    );

    const successfulTokenBalances = tokenBalances
      .filter((result): result is PromiseFulfilledResult<{ token: string; balance: string }> =>
        result.status === 'fulfilled')
      .map(result => result.value);

    const finalBalances: { [token: string]: string } = {
      ETH: ethBalanceInEther,
      ...Object.fromEntries(
        successfulTokenBalances.map(({ token, balance }) => [token, balance])
      ),
    };

    // If no balances are available (after filtering errors), return an error
    // We check the final map content, not just the initial fetches
    const hasAnyBalance = Object.values(finalBalances).some(bal => parseFloat(bal) > 0);
    if (!hasAnyBalance) {
        return NextResponse.json(
          { error: 'No balances found for this address' },
          { status: 404 }
        );
    }

    // --- Cache Update --- >
    balanceCache.set(address, {
      balances: finalBalances,
      timestamp: Date.now(),
    });
    console.log(`Cache updated for address: ${address}`);
    // < --- End Cache Update ---

    return NextResponse.json({ balances: finalBalances });

  } catch (error) {
    console.error('Error fetching balances:', error);
    // Don't cache errors
    return NextResponse.json(
      { error: 'Internal server error during balance fetch' }, // More specific error
      { status: 500 }
    );
  }
} 