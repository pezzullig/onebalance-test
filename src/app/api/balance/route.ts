import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

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
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required' },
        { status: 400 }
      );
    }

    // Validate Ethereum address
    if (!ethers.isAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum address' },
        { status: 400 }
      );
    }

    // Initialize provider (using public RPC endpoint)
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

    // Process token balances, filtering out failed requests
    const successfulTokenBalances = tokenBalances
      .filter((result): result is PromiseFulfilledResult<{ token: string; balance: string }> => 
        result.status === 'fulfilled')
      .map(result => result.value);

    // If no balances are available, return an error
    if (ethBalanceInEther === '0.0' && successfulTokenBalances.length === 0) {
      return NextResponse.json(
        { error: 'No balances found for this address' },
        { status: 404 }
      );
    }

    // Combine all balances
    const balances = {
      ETH: ethBalanceInEther,
      ...Object.fromEntries(
        successfulTokenBalances.map(({ token, balance }) => [token, balance])
      ),
    };

    return NextResponse.json({ balances });
  } catch (error) {
    console.error('Error fetching balances:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 