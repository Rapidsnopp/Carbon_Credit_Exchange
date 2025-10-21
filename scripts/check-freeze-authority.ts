/**
 * Check Freeze Authority of Minted NFTs
 */

import * as anchor from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { getMint } from '@solana/spl-token';

const DEVNET_URL = 'https://api.devnet.solana.com';

async function checkFreezeAuthority() {
  const connection = new Connection(DEVNET_URL, 'confirmed');

  // Lấy mint addresses từ minted-nfts.json
  const mintAddresses = [
    '5JGCLhQXNeJtqsq2xdGD19BW3BXen6247bSv6toYWn3x',
    '2LRhQ9BCMPq4ZC5j3Fnn6JLgS99RSHsCWgnDaxZNzgvY',
    '8qJiYeCAENSvDhZmgZnJsX1Loek3nnh9av9XGNVvT7nU',
  ];

  console.log('🔍 Checking Freeze Authority...\n');

  for (const mintAddress of mintAddresses) {
    try {
      const mint = new PublicKey(mintAddress);
      const mintInfo = await getMint(connection, mint);

      console.log(`📍 Mint: ${mintAddress}`);
      console.log(`   Decimals: ${mintInfo.decimals}`);
      console.log(`   Supply: ${mintInfo.supply}`);
      console.log(`   Mint Authority: ${mintInfo.mintAuthority?.toBase58() || 'null'}`);
      console.log(`   Freeze Authority: ${mintInfo.freezeAuthority?.toBase58() || 'null'}`);
      console.log('');
    } catch (error: any) {
      console.log(`❌ Failed to check ${mintAddress}:`, error.message);
    }
  }
}

checkFreezeAuthority()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
