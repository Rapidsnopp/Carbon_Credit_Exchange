import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor';
import fs from 'fs';
import path from 'path';

export interface SolanaConfig {
  connection: Connection;
  programId: PublicKey;
  provider: AnchorProvider;
  program: Program | null;
}

// Load IDL
const loadIDL = () => {
  try {
    const idlPath = path.join(__dirname, '../../../contracts/carbon-credit-exchange/target/idl/carbon_credit_exchange.json');
    if (fs.existsSync(idlPath)) {
      return JSON.parse(fs.readFileSync(idlPath, 'utf-8'));
    }
    console.warn('IDL file not found, program instance will be null');
    return null;
  } catch (error) {
    console.error('Error loading IDL:', error);
    return null;
  }
};

// Load admin keypair (optional, for backend-initiated transactions)
const loadAdminKeypair = (): Keypair | null => {
  try {
    const keypairPath = process.env.ADMIN_KEYPAIR_PATH;
    if (keypairPath && fs.existsSync(keypairPath)) {
      const secretKey = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'));
      return Keypair.fromSecretKey(Uint8Array.from(secretKey));
    }
    console.warn('Admin keypair not found, using dummy wallet');
    return null;
  } catch (error) {
    console.error('Error loading admin keypair:', error);
    return null;
  }
};

export const getSolanaConfig = (): SolanaConfig => {
  const rpcUrl = process.env.SOLANA_RPC_URL || clusterApiUrl('devnet');
  const programIdStr = process.env.PROGRAM_ID || 'G1oyFNSMSHRBPG6LWWpAMhJJNf23HWjNpq8FALJSUqs3';
  
  const connection = new Connection(rpcUrl, 'confirmed');
  const programId = new PublicKey(programIdStr);
  
  // Create a wallet (can be dummy for read-only operations)
  const adminKeypair = loadAdminKeypair();
  const wallet = adminKeypair 
    ? new Wallet(adminKeypair)
    : new Wallet(Keypair.generate()); // Dummy wallet for read-only
  
  const provider = new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
    preflightCommitment: 'confirmed',
  });
  
  // Load program
  const idl = loadIDL();
  const program = idl ? new Program(idl, programId, provider) : null;
  
  return {
    connection,
    programId,
    provider,
    program,
  };
};

export const solanaConfig = getSolanaConfig();
