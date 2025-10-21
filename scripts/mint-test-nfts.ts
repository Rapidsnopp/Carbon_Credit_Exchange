import * as anchor from '@coral-xyz/anchor';
import { Program, AnchorProvider, Wallet } from '@coral-xyz/anchor';
import { Connection, Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import BN from 'bn.js';
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load IDL
const idlPath = path.join(__dirname, '../target/idl/carbon_credit_exchange.json');
const idl = JSON.parse(fs.readFileSync(idlPath, 'utf-8'));

// Configuration
const NETWORK = 'devnet';
const RPC_URL = 'https://api.devnet.solana.com';
const PROGRAM_ID = new PublicKey('CjZ3Y485ryrigRSdD1ZhDmMYxxhcXv29J5sLU6icopND');
const METAPLEX_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

// Test data for 5 NFTs
const TEST_NFTS = [
  {
    projectName: 'Amazon Rainforest Protection',
    projectId: 'AMZN-RF-2024-001',
    country: 'Brazil',
    projectType: 'Forestry',
    standard: 'VCS',
    validator: 'Verra',
    vintageYear: '2023',
    amount: 100,
    name: 'Amazon Rainforest Credit',
    symbol: 'CARBON',
    uri: 'https://arweave.net/amazon-metadata',
  },
  {
    projectName: 'Solar Energy India',
    projectId: 'SOLAR-IN-2024-002',
    country: 'India',
    projectType: 'Renewable Energy',
    standard: 'Gold Standard',
    validator: 'Gold Standard Foundation',
    vintageYear: '2024',
    amount: 150,
    name: 'Solar Energy Credit',
    symbol: 'SOLAR',
    uri: 'https://arweave.net/solar-metadata',
  },
  {
    projectName: 'Ocean Conservation Australia',
    projectId: 'OCEAN-AU-2024-003',
    country: 'Australia',
    projectType: 'Marine Conservation',
    standard: 'Plan Vivo',
    validator: 'Plan Vivo Foundation',
    vintageYear: '2024',
    amount: 75,
    name: 'Ocean Conservation Credit',
    symbol: 'OCEAN',
    uri: 'https://arweave.net/ocean-metadata',
  },
  {
    projectName: 'Wind Farm Scotland',
    projectId: 'WIND-SC-2024-004',
    country: 'Scotland',
    projectType: 'Renewable Energy',
    standard: 'ACR',
    validator: 'American Carbon Registry',
    vintageYear: '2023',
    amount: 200,
    name: 'Wind Energy Credit',
    symbol: 'WIND',
    uri: 'https://arweave.net/wind-metadata',
  },
  {
    projectName: 'Mangrove Restoration Vietnam',
    projectId: 'MANG-VN-2024-005',
    country: 'Vietnam',
    projectType: 'Marine Conservation',
    standard: 'VCS',
    validator: 'Verra',
    vintageYear: '2024',
    amount: 120,
    name: 'Mangrove Restoration Credit',
    symbol: 'MANG',
    uri: 'https://arweave.net/mangrove-metadata',
  },
];

// Helper: Trim and limit string length
function trimAndLimit(str: string, maxLength: number): string {
  return str.slice(0, maxLength).trim();
}

// Helper: Get exchange PDA
async function getExchangePDA(): Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('carbon_exchange')],
    PROGRAM_ID
  );
}

// Helper: Get metadata PDA
async function getMetadataPDA(mint: PublicKey): Promise<PublicKey> {
  const [metadataPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      METAPLEX_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    METAPLEX_PROGRAM_ID
  );
  return metadataPDA;
}

// Helper: Get master edition PDA
async function getMasterEditionPDA(mint: PublicKey): Promise<PublicKey> {
  const [masterEditionPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      METAPLEX_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      Buffer.from('edition'),
    ],
    METAPLEX_PROGRAM_ID
  );
  return masterEditionPDA;
}

// Main minting function
async function mintTestNFT(
  program: Program,
  wallet: Wallet,
  nftData: typeof TEST_NFTS[0]
) {
  console.log(`\n🎨 Minting: ${nftData.name}...`);

  try {
    const connection = program.provider.connection;
    const [exchangePda] = await getExchangePDA();

    // Generate new mint
    const mintKeypair = Keypair.generate();
    const mint = mintKeypair.publicKey;

    // Get token account
    const tokenAccount = await getAssociatedTokenAddress(
      mint,
      wallet.publicKey
    );

    // Get metadata PDA
    const metadataPDA = await getMetadataPDA(mint);
    
    // Get master edition PDA
    const masterEditionPDA = await getMasterEditionPDA(mint);

    // Prepare data with length limits
    const projectName = trimAndLimit(nftData.projectName, 50);
    const projectId = trimAndLimit(nftData.projectId, 32);
    const country = trimAndLimit(nftData.country, 32);
    const projectType = trimAndLimit(nftData.projectType, 32);
    const standard = trimAndLimit(nftData.standard, 16);
    const validator = trimAndLimit(nftData.validator, 32);
    const vintageYear = parseInt(trimAndLimit(nftData.vintageYear, 4));
    const name = trimAndLimit(nftData.name, 32);
    const symbol = trimAndLimit(nftData.symbol, 10);
    const uri = trimAndLimit(nftData.uri, 200);

    console.log(`   Mint address: ${mint.toBase58()}`);
    console.log(`   Amount: ${nftData.amount} credits`);

    // Create carbonData object
    const carbonData = {
      projectName,
      projectId,
      vintageYear,
      metricTons: new BN(nftData.amount),
      validator,
      standard,
      projectType,
      country,
    };

    // Mint NFT
    const tx = await program.methods
      .mintCarbonCredit(
        carbonData,
        uri,
        name,
        symbol
      )
      .accounts({
        carbonExchange: exchangePda,
        mint: mint,
        tokenAccount: tokenAccount,
        metadata: metadataPDA,
        masterEdition: masterEditionPDA,
        payer: wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        tokenMetadataProgram: METAPLEX_PROGRAM_ID,
        sysvarInstructions: anchor.web3.SYSVAR_INSTRUCTIONS_PUBKEY,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([mintKeypair])
      .rpc();

    await connection.confirmTransaction(tx, 'confirmed');

    console.log(`   ✅ Success!`);
    console.log(`   TX: ${tx}`);
    console.log(`   Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`);

    return {
      mint: mint.toBase58(),
      tx,
      ...nftData,
    };
  } catch (error) {
    console.error(`   ❌ Failed to mint ${nftData.name}:`, error);
    throw error;
  }
}

// Main function
async function main() {
  console.log('🚀 Starting Test NFT Minting Script...\n');

  // Connect to devnet
  const connection = new Connection(RPC_URL, 'confirmed');
  console.log(`📡 Connected to: ${NETWORK}`);

  // Load wallet
  const walletPath = path.join(
    process.env.HOME || process.env.USERPROFILE || '',
    '.config/solana/id.json'
  );

  if (!fs.existsSync(walletPath)) {
    console.error('❌ Wallet not found at:', walletPath);
    console.log('   Please ensure you have a Solana wallet configured');
    process.exit(1);
  }

  const walletKeypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(walletPath, 'utf-8')))
  );
  const wallet = new Wallet(walletKeypair);

  console.log(`👛 Wallet: ${wallet.publicKey.toBase58()}`);

  // Check balance
  const balance = await connection.getBalance(wallet.publicKey);
  console.log(`💰 Balance: ${balance / 1e9} SOL`);

  if (balance < 0.5 * 1e9) {
    console.warn('⚠️  Low balance! You may need more SOL to mint all NFTs');
    console.log('   Get devnet SOL from: https://faucet.solana.com/\n');
  }

  // Setup provider and program
  const provider = new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
  });
  const program = new Program(idl, PROGRAM_ID, provider);

  console.log(`📋 Program ID: ${PROGRAM_ID.toBase58()}\n`);

  // Check exchange initialized
  const [exchangePda] = await getExchangePDA();
  try {
    const exchange: any = await program.account.carbonExchange.fetch(exchangePda);
    console.log(`✅ Exchange initialized`);
    console.log(`   Total credits minted: ${exchange.totalCredits.toString()}\n`);
  } catch (error) {
    console.error('❌ Exchange not initialized!');
    console.log('   Run: npm run initialize-exchange\n');
    process.exit(1);
  }

  // Mint all test NFTs
  const results = [];
  let successCount = 0;
  let failCount = 0;

  console.log('🎨 Minting 5 test NFTs...\n');
  console.log('='.repeat(60));

  for (let i = 0; i < TEST_NFTS.length; i++) {
    try {
      const result = await mintTestNFT(program, wallet, TEST_NFTS[i]);
      results.push(result);
      successCount++;

      // Small delay between mints
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      failCount++;
      console.error(`Failed to mint NFT #${i + 1}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Summary:\n');
  console.log(`   Total: ${TEST_NFTS.length} NFTs`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}\n`);

  if (results.length > 0) {
    console.log('📝 Minted NFTs:\n');
    results.forEach((nft, idx) => {
      console.log(`${idx + 1}. ${nft.name}`);
      console.log(`   Mint: ${nft.mint}`);
      console.log(`   Amount: ${nft.amount} credits`);
      console.log(`   Type: ${nft.projectType}`);
      console.log('');
    });

    // Save to file
    const outputPath = path.join(__dirname, 'minted-nfts.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`💾 Saved mint addresses to: ${outputPath}\n`);

    console.log('🎯 Next Steps:\n');
    console.log('1. List some NFTs on marketplace:');
    console.log('   → Go to Trading page → Tab "List NFT"');
    console.log('   → Paste mint address + price → List\n');
    console.log('2. Verify NFTs:');
    console.log('   → Go to Verify page');
    console.log('   → Paste mint address → Verify\n');
    console.log('3. Test buy:');
    console.log('   → Go to Trading page');
    console.log('   → Select listed NFT → Buy\n');
  }

  console.log('✅ Script completed!\n');
}

// Run
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
