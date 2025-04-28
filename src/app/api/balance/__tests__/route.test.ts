import { GET } from '../route';
// Use node-fetch Request/Response for Node.js environment testing
import { Request } from 'node-fetch';
// import type { Request as NodeFetchRequest } from 'node-fetch'; // Keep if needed for explicit casting
import type { NextRequest } from 'next/server';

describe('Balance API Integration (Node Env)', () => {
  // Using Vitalik's address.
  // you can view it and verify it here: https://etherscan.io/address/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045#asset-tokens
  const TEST_ADDRESS = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

  const createRequest = (url: string): NextRequest => {
    // We cast because the structure is compatible enough for the handler
    return new Request(url) as unknown as NextRequest
  };

  it('should return balances for a valid address', async () => {
    const request = createRequest(`http://localhost/api/balance?address=${TEST_ADDRESS}`);
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.balances).toBeDefined();
    expect(typeof data.balances.ETH).toBe('string');
    expect(Number(data.balances.ETH)).toBeGreaterThan(0);
    
    console.log('Balances found:', JSON.stringify(data.balances, null, 2));
  });

  it('should return 400 for invalid address', async () => {
    const request = createRequest('http://localhost/api/balance?address=invalid');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid Ethereum address');
  });

  it('should return 400 when no address is provided', async () => {
    const request = createRequest('http://localhost/api/balance');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Address parameter is required');
  });

}); 