import {
  PublicKey,
  Transaction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_INSTRUCTIONS_PUBKEY,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { BN } from '@coral-xyz/anchor';
import { solanaConfig } from '../config/solana.config';

const MPL_TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

/**
 * Find Program Derived Address for Exchange account
 */
export const getExchangePDA = async (): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('carbon_exchange')],
    solanaConfig.programId
  );
};

/**
 * Find Program Derived Address for Listing account
 */
export const getListingPDA = async (mint: PublicKey): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('listing'), mint.toBuffer()],
    solanaConfig.programId
  );
};

/**
 * Find Program Derived Address for Retirement Record
 */
export const getRetirementRecordPDA = async (mint: PublicKey): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('retirement'), mint.toBuffer()],
    solanaConfig.programId
  );
};

/**
 * Find Metadata PDA for a mint (Metaplex)
 */
export const getMetadataPDA = async (mint: PublicKey): Promise<PublicKey> => {
  const [metadata] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    MPL_TOKEN_METADATA_PROGRAM_ID
  );
  return metadata;
};

/**
 * Find Master Edition PDA for a mint (Metaplex)
 */
export const getMasterEditionPDA = async (mint: PublicKey): Promise<PublicKey> => {
  const [masterEdition] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      Buffer.from('edition'),
    ],
    MPL_TOKEN_METADATA_PROGRAM_ID
  );
  return masterEdition;
};

/**
 * Get Exchange account info
 */
export const getExchangeInfo = async () => {
  const [exchangePDA] = await getExchangePDA();
  
  try {
    const exchangeAccount: any = await solanaConfig.program?.account.carbonExchange.fetch(exchangePDA);
    if (!exchangeAccount) {
      return null;
    }
    return {
      address: exchangePDA.toBase58(),
      authority: exchangeAccount.authority.toBase58(),
      totalCredits: exchangeAccount.totalCredits.toString(),
      bump: exchangeAccount.bump,
    };
  } catch (error) {
    console.error('Exchange account not found or not initialized');
    return null;
  }
};

/**
 * Get Listing info by mint address
 */
export const getListingInfo = async (mintAddress: string) => {
  const mint = new PublicKey(mintAddress);
  const [listingPDA] = await getListingPDA(mint);
  
  try {
    const listingAccount: any = await solanaConfig.program?.account.listing.fetch(listingPDA);
    if (!listingAccount) {
      return null;
    }
    return {
      address: listingPDA.toBase58(),
      owner: listingAccount.owner.toBase58(),
      mint: listingAccount.mint.toBase58(),
      price: listingAccount.price.toString(),
      bump: listingAccount.bump,
    };
  } catch (error) {
    console.error('Listing not found:', error);
    return null;
  }
};

/**
 * Get all active listings
 */
export const getAllListings = async () => {
  try {
    const listings = await solanaConfig.program?.account.listing.all();
    return listings?.map((listing: any) => ({
      address: listing.publicKey.toBase58(),
      owner: listing.account.owner.toBase58(),
      mint: listing.account.mint.toBase58(),
      price: listing.account.price.toString(),
    })) || [];
  } catch (error) {
    console.error('Error fetching listings:', error);
    return [];
  }
};

/**
 * Get Retirement Record by mint address
 */
export const getRetirementRecord = async (mintAddress: string) => {
  const mint = new PublicKey(mintAddress);
  const [retirementPDA] = await getRetirementRecordPDA(mint);
  
  try {
    const retirementAccount: any = await solanaConfig.program?.account.retirementRecord.fetch(retirementPDA);
    if (!retirementAccount) {
      return null;
    }
    return {
      address: retirementPDA.toBase58(),
      mint: retirementAccount.mint.toBase58(),
      retiredBy: retirementAccount.retiredBy.toBase58(),
      retiredAt: retirementAccount.retiredAt.toString(),
    };
  } catch (error) {
    console.error('Retirement record not found');
    return null;
  }
};

/**
 * Get NFT metadata from Metaplex
 */
export const getNFTMetadata = async (mintAddress: string) => {
  const mint = new PublicKey(mintAddress);
  const metadataPDA = await getMetadataPDA(mint);
  
  try {
    const accountInfo = await solanaConfig.connection.getAccountInfo(metadataPDA);
    if (!accountInfo) {
      return null;
    }
    
    // Parse metadata (simplified - you may want to use Metaplex SDK)
    return {
      mint: mintAddress,
      metadataAddress: metadataPDA.toBase58(),
      // Add full parsing logic here
    };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return null;
  }
};

/**
 * Get token balance for a wallet
 */
export const getTokenBalance = async (walletAddress: string, mintAddress: string) => {
  try {
    const wallet = new PublicKey(walletAddress);
    const mint = new PublicKey(mintAddress);
    const tokenAccount = await getAssociatedTokenAddress(mint, wallet);
    
    const balance = await solanaConfig.connection.getTokenAccountBalance(tokenAccount);
    return balance.value.uiAmount || 0;
  } catch (error) {
    console.error('Error getting token balance:', error);
    return 0;
  }
};

/**
 * Get all NFTs owned by a wallet
 */
export const getWalletNFTs = async (walletAddress: string) => {
  try {
    const wallet = new PublicKey(walletAddress);
    const tokenAccounts = await solanaConfig.connection.getParsedTokenAccountsByOwner(
      wallet,
      { programId: TOKEN_PROGRAM_ID }
    );
    
    // Filter for NFTs (amount = 1, decimals = 0)
    const nfts = tokenAccounts.value
      .filter(account => {
        const amount = account.account.data.parsed.info.tokenAmount;
        return amount.decimals === 0 && amount.uiAmount === 1;
      })
      .map(account => ({
        mint: account.account.data.parsed.info.mint,
        tokenAccount: account.pubkey.toBase58(),
      }));
    
    return nfts;
  } catch (error) {
    console.error('Error fetching wallet NFTs:', error);
    return [];
  }
};

/**
 * Get program events (transactions)
 */
export const getProgramEvents = async (limit: number = 10) => {
  try {
    const signatures = await solanaConfig.connection.getSignaturesForAddress(
      solanaConfig.programId,
      { limit }
    );
    
    const transactions = await Promise.all(
      signatures.map(async (sig) => {
        const tx = await solanaConfig.connection.getParsedTransaction(sig.signature, {
          maxSupportedTransactionVersion: 0,
        });
        return {
          signature: sig.signature,
          blockTime: sig.blockTime,
          slot: sig.slot,
          err: sig.err,
          transaction: tx,
        };
      })
    );
    
    return transactions;
  } catch (error) {
    console.error('Error fetching program events:', error);
    return [];
  }
};

/**
 * Verify program deployment
 */
export const verifyProgramDeployment = async (): Promise<boolean> => {
  try {
    const accountInfo = await solanaConfig.connection.getAccountInfo(solanaConfig.programId);
    return accountInfo !== null && accountInfo.executable;
  } catch (error) {
    console.error('Error verifying program:', error);
    return false;
  }
};

export const SolanaService = {
  getExchangePDA,
  getListingPDA,
  getRetirementRecordPDA,
  getMetadataPDA,
  getMasterEditionPDA,
  getExchangeInfo,
  getListingInfo,
  getAllListings,
  getRetirementRecord,
  getNFTMetadata,
  getTokenBalance,
  getWalletNFTs,
  getProgramEvents,
  verifyProgramDeployment,
};

export default SolanaService;
