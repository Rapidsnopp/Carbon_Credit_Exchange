/**
 * Script to initialize the Carbon Credit Exchange on Solana
 * This must be run once before using the marketplace
 */

import * as anchor from '@coral-xyz/anchor';
import { PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
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

async function loadOrCreateKeypair(): Promise<Keypair> {
  const keypairPath = path.join(__dirname, '../.keys/admin-keypair.json');
  
  try {
    // Try to load existing keypair
    if (fs.existsSync(keypairPath)) {
      const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
      const keypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
      console.log('✅ Loaded existing admin keypair');
      console.log(`   Public Key: ${keypair.publicKey.toBase58()}`);
      return keypair;
    }
  } catch (error) {
    console.log('⚠️  Could not load existing keypair, creating new one...');
  }

  // Create new keypair
  const newKeypair = Keypair.generate();
  
  // Save to file
  const dir = path.dirname(keypairPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(
    keypairPath,
    JSON.stringify(Array.from(newKeypair.secretKey)),
    'utf8'
  );
  
  console.log('✅ Created new admin keypair');
  console.log(`   Public Key: ${newKeypair.publicKey.toBase58()}`);
  console.log(`   Saved to: ${keypairPath}`);
  
  return newKeypair;
}

async function requestAirdrop(connection: anchor.web3.Connection, publicKey: PublicKey) {
  console.log('\n💰 Requesting airdrop...');
  try {
    const signature = await connection.requestAirdrop(publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
    await connection.confirmTransaction(signature);
    console.log('✅ Airdrop successful');
    
    const balance = await connection.getBalance(publicKey);
    console.log(`   Balance: ${balance / anchor.web3.LAMPORTS_PER_SOL} SOL`);
  } catch (error: any) {
    console.log('⚠️  Airdrop failed:', error.message);
    console.log('   You may need to wait or use a faucet');
  }
}

async function initializeExchange() {
  console.log('🚀 Initializing Carbon Credit Exchange');
  console.log(`📡 Cluster: ${CLUSTER}`);
  console.log(`🔗 RPC URL: ${RPC_URL}`);
  console.log(`📝 Program ID: ${PROGRAM_ID.toBase58()}\n`);

  // Setup connection
  const connection = new anchor.web3.Connection(RPC_URL, 'confirmed');
  
  // Load or create admin keypair
  const adminKeypair = await loadOrCreateKeypair();
  
  // Check balance
  let balance = await connection.getBalance(adminKeypair.publicKey);
  console.log(`\n💼 Admin wallet balance: ${balance / anchor.web3.LAMPORTS_PER_SOL} SOL`);
  
  // Request airdrop if balance is low
  if (balance < 0.1 * anchor.web3.LAMPORTS_PER_SOL) {
    await requestAirdrop(connection, adminKeypair.publicKey);
    balance = await connection.getBalance(adminKeypair.publicKey);
  }
  
  if (balance < 0.01 * anchor.web3.LAMPORTS_PER_SOL) {
    console.error('\n❌ Insufficient balance. Please fund the wallet:');
    console.error(`   Address: ${adminKeypair.publicKey.toBase58()}`);
    console.error(`   Use devnet faucet: https://faucet.solana.com/`);
    process.exit(1);
  }

  // Load IDL
  console.log('\n📄 Loading IDL...');
  const idl = await loadIDL();
  console.log('✅ IDL loaded');

  // Setup provider and program
  const wallet = new anchor.Wallet(adminKeypair);
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
  });
  anchor.setProvider(provider);

  const program = new anchor.Program(idl, PROGRAM_ID, provider);
  console.log('✅ Program initialized');

  // Derive exchange PDA
  const [exchangePda, exchangeBump] = PublicKey.findProgramAddressSync(
    [Buffer.from('carbon_exchange')],
    program.programId
  );

  console.log(`\n🔑 Exchange PDA: ${exchangePda.toBase58()}`);
  console.log(`   Bump: ${exchangeBump}`);

  // Check if exchange already exists
  try {
    const exchangeAccount: any = await program.account.carbonExchange.fetch(exchangePda);
    console.log('\n⚠️  Exchange already initialized!');
    console.log(`   Authority: ${exchangeAccount.authority.toBase58()}`);
    console.log(`   Total Credits: ${exchangeAccount.totalCredits.toString()}`);
    console.log(`   Bump: ${exchangeAccount.bump}`);
    return;
  } catch (error) {
    console.log('\n✅ Exchange not yet initialized, proceeding...');
  }

  // Initialize exchange
  try {
    console.log('\n🔄 Sending initialize transaction...');
    
    const tx = await program.methods
      .initialize()
      .accounts({
        carbonExchange: exchangePda,
        authority: adminKeypair.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log('✅ Transaction sent!');
    console.log(`   Signature: ${tx}`);
    console.log(`   Explorer: https://explorer.solana.com/tx/${tx}?cluster=${CLUSTER}`);

    // Wait for confirmation
    console.log('\n⏳ Waiting for confirmation...');
    await connection.confirmTransaction(tx, 'confirmed');
    
    // Fetch the created account
    const exchangeAccount: any = await program.account.carbonExchange.fetch(exchangePda);
    
    console.log('\n🎉 Exchange initialized successfully!');
    console.log('═══════════════════════════════════════');
    console.log(`Exchange PDA: ${exchangePda.toBase58()}`);
    console.log(`Authority: ${exchangeAccount.authority.toBase58()}`);
    console.log(`Total Credits: ${exchangeAccount.totalCredits.toString()}`);
    console.log(`Bump: ${exchangeAccount.bump}`);
    console.log('═══════════════════════════════════════');

  } catch (error: any) {
    console.error('\n❌ Failed to initialize exchange');
    console.error('Error:', error.message);
    
    if (error.logs) {
      console.error('\nProgram Logs:');
      error.logs.forEach((log: string) => console.error('  ', log));
    }
    
    process.exit(1);
  }
}

// Run the script
initializeExchange()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
