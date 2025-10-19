/**
 * Script to check the status of the Carbon Credit Exchange
 */

import * as anchor from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// ES module dirname replacement
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const PROGRAM_ID = new PublicKey(process.env.PROGRAM_ID || 'G1oyFNSMSHRBPG6LWWpAMhJJNf23HWjNpq8FALJSUqs3');
const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const CLUSTER = process.env.SOLANA_CLUSTER || 'devnet';

interface ExchangeAccount {
  authority: PublicKey;
  totalCredits: anchor.BN;
  bump: number;
}

async function loadIDL() {
  const idlPath = path.join(__dirname, '../target/idl/carbon_credit_exchange.json');
  const idlData = fs.readFileSync(idlPath, 'utf8');
  return JSON.parse(idlData);
}

async function checkExchange() {
  console.log('🔍 Checking Carbon Credit Exchange Status');
  console.log(`📡 Cluster: ${CLUSTER}`);
  console.log(`🔗 RPC URL: ${RPC_URL}`);
  console.log(`📝 Program ID: ${PROGRAM_ID.toBase58()}\n`);

  // Setup connection
  const connection = new anchor.web3.Connection(RPC_URL, 'confirmed');

  // Load IDL
  const idl = await loadIDL();
  const program = new anchor.Program(idl, PROGRAM_ID, { connection } as any);

  // Derive exchange PDA
  const [exchangePda] = PublicKey.findProgramAddressSync(
    [Buffer.from('carbon_exchange')],
    program.programId
  );

  console.log(`🔑 Exchange PDA: ${exchangePda.toBase58()}\n`);

  // Check if exchange exists
  try {
    const exchangeAccount = (await program.account.carbonExchange.fetch(exchangePda)) as ExchangeAccount;
    
    console.log('✅ Exchange is initialized!');
    console.log('═══════════════════════════════════════');
    console.log(`Authority: ${(exchangeAccount as any).authority.toBase58()}`);
    console.log(`Total Credits Minted: ${(exchangeAccount as any).totalCredits.toString()}`);
    console.log(`Bump: ${(exchangeAccount as any).bump}`);
    console.log('═══════════════════════════════════════');
    console.log(`\n🔗 View on Explorer: https://explorer.solana.com/address/${exchangePda.toBase58()}?cluster=${CLUSTER}`);
    
  } catch (error: any) {
    if (error.message.includes('Account does not exist')) {
      console.log('❌ Exchange not initialized yet');
      console.log('\nTo initialize the exchange, run:');
      console.log('  npm run init-exchange');
    } else {
      console.error('❌ Error checking exchange:', error.message);
    }
    process.exit(1);
  }

  // Check program deployment
  console.log('\n📦 Checking program deployment...');
  const programInfo = await connection.getAccountInfo(PROGRAM_ID);
  
  if (programInfo) {
    console.log('✅ Program is deployed');
    console.log(`   Executable: ${programInfo.executable}`);
    console.log(`   Owner: ${programInfo.owner.toBase58()}`);
    console.log(`   Data Length: ${programInfo.data.length} bytes`);
  } else {
    console.log('❌ Program not found at this address');
  }
}

// Run the script
checkExchange()
  .then(() => {
    console.log('\n✅ Check completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Check failed:', error);
    process.exit(1);
  });
