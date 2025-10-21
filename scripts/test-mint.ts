/**
 * Simple Mint Test Script
 * Tests if minting works via command line
 */

import * as anchor from '@coral-xyz/anchor';
import {
  PublicKey,
  Keypair,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';

// Import BN from bn.js directly
import BN from 'bn.js';
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const PROGRAM_ID = new PublicKey(process.env.PROGRAM_ID || 'CjZ3Y485ryrigRSdD1ZhDmMYxxhcXv29J5sLU6icopND');
const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const METAPLEX_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

async function loadIDL() {
  const idlPath = path.join(__dirname, '../target/idl/carbon_credit_exchange.json');
  const idlData = fs.readFileSync(idlPath, 'utf8');
  return JSON.parse(idlData);
}

async function loadKeypair() {
  const keypairPath = path.join(__dirname, '../.keys/admin-keypair.json');
  const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
  return Keypair.fromSecretKey(new Uint8Array(keypairData));
}

async function mintTestNFT() {
  console.log('🧪 Starting Mint Test...\n');

  // Setup
  const connection = new anchor.web3.Connection(RPC_URL, 'confirmed');
  const payer = await loadKeypair();
  const wallet = new anchor.Wallet(payer);
  
  console.log('💼 Using wallet:', payer.publicKey.toBase58());
  
  // Check balance
  const balance = await connection.getBalance(payer.publicKey);
  console.log(`💰 Balance: ${balance / anchor.web3.LAMPORTS_PER_SOL} SOL\n`);
  
  if (balance < 0.01 * anchor.web3.LAMPORTS_PER_SOL) {
    console.error('❌ Insufficient balance. Need at least 0.01 SOL');
    process.exit(1);
  }

  // Load program
  const idl = await loadIDL();
  const provider = new anchor.AnchorProvider(connection, wallet, { commitment: 'confirmed' });
  const program = new anchor.Program(idl, PROGRAM_ID, provider);

  // Generate mint
  const mintKeypair = Keypair.generate();
  const mint = mintKeypair.publicKey;
  
  console.log('🔑 Mint address:', mint.toBase58());

  // Derive PDAs
  const [exchangePda] = PublicKey.findProgramAddressSync(
    [Buffer.from('carbon_exchange')],
    program.programId
  );
  
  const tokenAccount = await getAssociatedTokenAddress(mint, payer.publicKey);
  
  const [metadataPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      METAPLEX_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    METAPLEX_PROGRAM_ID
  );
  
  const [masterEditionPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      METAPLEX_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      Buffer.from('edition'),
    ],
    METAPLEX_PROGRAM_ID
  );

  console.log('📦 Exchange PDA:', exchangePda.toBase58());
  console.log('🎫 Token Account:', tokenAccount.toBase58());
  console.log('📝 Metadata PDA:', metadataPda.toBase58());
  console.log('🏆 Master Edition PDA:', masterEditionPda.toBase58());

  // Prepare test data
  const carbonData = {
    projectName: 'Test Mint Script',
    projectId: `TEST-${Date.now()}`,
    vintageYear: 2024,
    metricTons: new BN(10),
    validator: 'Test Validator',
    standard: 'VCS',
    projectType: 'Reforestation',
    country: 'Test Country',
  };

  const metadataUri = 'data:application/json;base64,' + Buffer.from(JSON.stringify({
    name: 'Test Carbon Credit',
    symbol: 'CARBON',
    description: 'Test mint from script',
  })).toString('base64');

  console.log('\n📋 Carbon Data:', carbonData);
  console.log('\n🚀 Minting NFT...');

  try {
    const tx = await program.methods
      .mintCarbonCredit(
        carbonData,
        metadataUri,
        'Test Carbon Credit',
        'CARBON'
      )
      .accounts({
        carbonExchange: exchangePda,
        mint: mint,
        tokenAccount: tokenAccount,
        metadata: metadataPda,
        masterEdition: masterEditionPda,
        payer: payer.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        tokenMetadataProgram: METAPLEX_PROGRAM_ID,
        sysvarInstructions: SYSVAR_INSTRUCTIONS_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .signers([mintKeypair])
      .rpc();

    console.log('✅ Transaction successful!');
    console.log(`📜 Signature: ${tx}`);
    console.log(`🔗 Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`);
    console.log(`🎨 NFT: https://explorer.solana.com/address/${mint.toBase58()}?cluster=devnet`);

    // Wait for confirmation
    await connection.confirmTransaction(tx, 'confirmed');
    console.log('✅ Transaction confirmed');

    // Verify mint
    const mintInfo = await connection.getAccountInfo(mint);
    console.log('\n✅ Mint created:', !!mintInfo);
    
    const tokenAccountInfo = await connection.getAccountInfo(tokenAccount);
    console.log('✅ Token account created:', !!tokenAccountInfo);
    
    const metadataInfo = await connection.getAccountInfo(metadataPda);
    console.log('✅ Metadata created:', !!metadataInfo);

    console.log('\n🎉 Mint test completed successfully!');

  } catch (error: any) {
    console.error('\n❌ Mint failed:', error);
    
    if (error.logs) {
      console.error('\nProgram logs:');
      error.logs.forEach((log: string) => console.error('  ', log));
    }
    
    process.exit(1);
  }
}

mintTestNFT()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
