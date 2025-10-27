import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor';
import fs from 'fs';
import path from 'path';

export interface SolanaConfig {
  connection: Connection;
  programId: PublicKey;
  provider: AnchorProvider;
  program: Program | null;
  adminKeypair: Keypair;
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
const loadAdminKeypair = (): Keypair => { 
  try {
    const keypairPath = process.env.ADMIN_KEYPAIR_PATH;
    if (keypairPath && fs.existsSync(keypairPath)) {
      const secretKey = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'));
      console.log("✅ Admin keypair loaded successfully."); // Thêm log
      return Keypair.fromSecretKey(Uint8Array.from(secretKey));
    }
    // Nếu không có key, đây là lỗi nghiêm trọng
    throw new Error('ADMIN_KEYPAIR_PATH is not set or file not found.');
  } catch (error) {
    console.error('❌ Error loading admin keypair:', error);
    // Thoát tiến trình nếu không load được key
    process.exit(1); 
  }
};

export const getSolanaConfig = (): SolanaConfig => {
  const rpcUrl = process.env.SOLANA_RPC_URL || clusterApiUrl('devnet');
  const programIdStr = process.env.PROGRAM_ID || '4fyXjVKLcRA13LdvudaHQnc14JcdJa8ZUMAqbfkgMe1s';
  
  const connection = new Connection(rpcUrl, 'confirmed');
  const programId = new PublicKey(programIdStr);
  
  // Create a wallet (can be dummy for read-only operations)
  const adminKeypair = loadAdminKeypair(); // Hàm này giờ sẽ luôn trả về Keypair
  const wallet = new Wallet(adminKeypair);
  
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
    adminKeypair: adminKeypair, 
  };
};

export const solanaConfig = getSolanaConfig();
