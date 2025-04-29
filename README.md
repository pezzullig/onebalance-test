# Ethereum Balance Checker

A simple full-stack application to check the ETH, USDC, and LINK balances for a given Ethereum address on the Mainnet.

Demo: https://onebalance-test-production.up.railway.app/

## Features

*   **Frontend:** Enter an Ethereum address via a React/Next.js interface.
*   **Backend:** A Next.js API route (`/api/balance`) fetches balances using a public Ethereum RPC.
*   **Balance Display:** Shows formatted balances for ETH, USDC, and LINK.
*   **Formatting:** Applies specific number formatting rules as per requirements.
*   **Caching:** Backend includes a 60-second in-memory cache to reduce redundant RPC calls.
*   **Deployment** Currently deployed on railway: https://onebalance-test-production.up.railway.app/

## Tech Stack

*   **Framework:** Next.js (React)
*   **Language:** TypeScript
*   **Web3 Interaction:** ethers.js

## Prerequisites

*   Node.js (v18 or later recommended)
*   npm (or yarn/pnpm)

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```


3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open the application:**
    Open [http://localhost:5039](http://localhost:5039) in your browser.

## How to Use

1.  Enter a valid Ethereum address (e.g., `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`) into the input field.
2.  Click the "Check Balance" button.
3.  The balances for ETH, USDC, and LINK for that address will be displayed in cards below the form.
4.  Requests for the same address within 60 seconds will be served from the cache (check server console logs for cache hits/misses).

## Assumptions Made

*   **Public RPC:** The application uses a public Ethereum RPC endpoint (`https://eth.llamarpc.com`). In a production scenario, a dedicated RPC provider (e.g., Infura, Alchemy) with an API key would be recommended for reliability and rate limiting.
*   **Number Formatting:** The balance formatting logic in `src/lib/utils.ts` was implemented to match the specific examples provided in the requirements, particularly for numbers less than 1.
*   **Cache Scope:** The in-memory cache is per-server-process. In serverless or multi-instance deployments, each instance would have its own cache.
*   **Error Handling:** Basic error handling is implemented. More granular error handling could be added (e.g., distinguishing network errors from invalid responses).

## Available Scripts

*   `npm run dev`: Starts the development server.
*   `npm run build`: Builds the application for production.
*   `npm run start`: Starts the production server (requires `build` first).
*   `npm run lint`: Lints the codebase using Next.js ESLint config.
*   `npm test`: Runs integration tests using Jest against the API route logic (requires Node environment).
