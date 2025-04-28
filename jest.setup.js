import { jest } from '@jest/globals';

// Increase timeout for slower integration tests (useful for network calls)
jest.setTimeout(30000);

// No other setup needed for 'node' environment for these tests 