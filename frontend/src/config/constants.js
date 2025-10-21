/**
 * Frontend Configuration Constants
 * Centralized configuration for Solana program
 */

import { PublicKey } from '@solana/web3.js';

// Environment variables with fallbacks
export const CONFIG = {
  // API
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  
  // Solana Network
  SOLANA_NETWORK: import.meta.env.VITE_SOLANA_NETWORK || 'devnet',
  SOLANA_RPC_URL: import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  
  // Program IDs
  PROGRAM_ID_STRING: import.meta.env.VITE_PROGRAM_ID || 'CjZ3Y485ryrigRSdD1ZhDmMYxxhcXv29J5sLU6icopND',
  
  // Metaplex
  METAPLEX_PROGRAM_ID_STRING: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
};

// Validate and create PublicKeys
let programId;
let metaplexProgramId;

try {
  programId = new PublicKey(CONFIG.PROGRAM_ID_STRING);
  console.log('✅ Program ID loaded:', programId.toBase58());
} catch (error) {
  console.error('❌ Invalid Program ID:', CONFIG.PROGRAM_ID_STRING);
  throw new Error('Invalid VITE_PROGRAM_ID in environment variables');
}

try {
  metaplexProgramId = new PublicKey(CONFIG.METAPLEX_PROGRAM_ID_STRING);
} catch (error) {
  console.error('❌ Invalid Metaplex Program ID');
  throw new Error('Invalid Metaplex Program ID');
}

export const PROGRAM_ID = programId;
export const METAPLEX_PROGRAM_ID = metaplexProgramId;

// Log configuration on load
console.log('🔧 Frontend Configuration:');
console.log('  Network:', CONFIG.SOLANA_NETWORK);
console.log('  RPC URL:', CONFIG.SOLANA_RPC_URL);
console.log('  Program ID:', PROGRAM_ID.toBase58());
console.log('  API URL:', CONFIG.API_URL);
