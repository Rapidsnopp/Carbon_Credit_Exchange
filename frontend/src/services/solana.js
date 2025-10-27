/**
 * Solana Service for Frontend
 * Handles all Solana blockchain interactions
 */

import * as anchor from "@coral-xyz/anchor";
import {
  PublicKey,
  SystemProgram,
  Keypair,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import idl from "../idl/carbon_credit_exchange.json";
import { PROGRAM_ID, METAPLEX_PROGRAM_ID } from "../config/constants";

const METAPLEX_TOKEN_METADATA_PROGRAM_ID = METAPLEX_PROGRAM_ID;

// Debug: Log IDL on load
console.log("📄 IDL loaded:", !!idl);
if (idl) {
  console.log("  IDL version:", idl.version);
  console.log("  IDL name:", idl.name);
  console.log("  IDL instructions:", idl.instructions?.length);
  console.log("  IDL address:", idl.metadata?.address);
  console.log("  IDL keys:", Object.keys(idl));
}

/**
 * Get Anchor program instance
 */
export const getProgram = (connection, wallet) => {
  console.log("🔧 Creating program instance...");
  console.log("  Connection:", !!connection);
  console.log("  Wallet:", !!wallet);
  console.log("  Wallet PublicKey:", wallet?.publicKey?.toBase58());
  console.log("  IDL:", !!idl);
  console.log("  PROGRAM_ID:", PROGRAM_ID?.toBase58());

  if (!connection) {
    throw new Error("Connection is required");
  }

  if (!wallet || !wallet.publicKey) {
    throw new Error("Wallet must be connected");
  }

  if (!idl) {
    throw new Error("IDL not loaded");
  }

  if (!PROGRAM_ID) {
    throw new Error("PROGRAM_ID not defined");
  }

  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });

  console.log("  Provider created:", !!provider);

  try {
    console.log("  Creating Program with IDL...");
    console.log("  IDL type:", typeof idl);
    console.log("  IDL is object:", idl && typeof idl === "object");
    console.log("  PROGRAM_ID type:", typeof PROGRAM_ID);
    console.log("  PROGRAM_ID toBase58:", PROGRAM_ID.toBase58());

    // Remove metadata.address from IDL if it exists to avoid conflicts
    // We'll pass PROGRAM_ID explicitly
    const idlWithoutMetadata = { ...idl };
    delete idlWithoutMetadata.metadata;

    console.log("  Creating program with explicit program ID...");

    // Create program with explicit program ID (not from metadata)
    const program = new anchor.Program(
      idlWithoutMetadata,
      PROGRAM_ID,
      provider
    );

    console.log("✅ Program instance created");
    console.log("  Program ID from instance:", program.programId.toBase58());

    return program;
  } catch (error) {
    console.error("❌ Failed to create program:", error);
    console.error("  Error details:", error.message);
    console.error("  Error stack:", error.stack);
    throw error;
  }
};

/**
 * Derive Exchange PDA
 */
export const getExchangePDA = async () => {
  const [exchangePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("carbon_exchange")],
    PROGRAM_ID
  );
  return exchangePda;
};

/**
 * Derive Metadata PDA (Metaplex)
 */
export const getMetadataPDA = async (mint) => {
  const [metadataPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      METAPLEX_TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    METAPLEX_TOKEN_METADATA_PROGRAM_ID
  );
  return metadataPda;
};

/**
 * Derive Master Edition PDA (Metaplex)
 */
export const getMasterEditionPDA = async (mint) => {
  const [masterEditionPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      METAPLEX_TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      Buffer.from("edition"),
    ],
    METAPLEX_TOKEN_METADATA_PROGRAM_ID
  );
  return masterEditionPda;
};

/**
 * Mint Carbon Credit NFT
 *
 * @param {Object} connection - Solana connection
 * @param {Object} wallet - Wallet adapter
 * @param {Object} carbonData - Carbon credit data
 * @param {string} metadataUri - URI to metadata JSON
 * @param {string} name - NFT name
 * @param {string} symbol - NFT symbol
 * @returns {Promise<Object>} - Mint address and transaction signature
 */
export const mintCarbonCredit = async (
  connection,
  wallet,
  carbonData,
  metadataUri,
  name,
  symbol
) => {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  // Validate carbon data
  if (
    !carbonData.projectName ||
    !carbonData.projectId ||
    !carbonData.vintageYear
  ) {
    throw new Error("Missing required carbon credit data");
  }

  console.log("🚀 Starting mint process...");
  console.log("Wallet:", wallet.publicKey.toBase58());
  console.log("Carbon Data:", carbonData);

  // Get program
  const program = getProgram(connection, wallet);

  // Generate new mint keypair
  const mintKeypair = Keypair.generate();
  const mint = mintKeypair.publicKey;

  console.log("🔑 Mint address:", mint.toBase58());

  // Get PDAs
  const exchangePda = await getExchangePDA();
  const tokenAccount = await getAssociatedTokenAddress(mint, wallet.publicKey);
  const metadataPda = await getMetadataPDA(mint);
  const masterEditionPda = await getMasterEditionPDA(mint);

  console.log("📦 Exchange PDA:", exchangePda.toBase58());
  console.log("🎫 Token Account:", tokenAccount.toBase58());
  console.log("📝 Metadata PDA:", metadataPda.toBase58());
  console.log("🏆 Master Edition PDA:", masterEditionPda.toBase58());

  // Prepare carbon credit data for on-chain
  // Important: Trim and limit string lengths for Borsh serialization
  const trimAndLimit = (str, maxLen = 32) => {
    if (!str) return "";
    return str.trim().substring(0, maxLen);
  };

  const onChainCarbonData = {
    projectName: trimAndLimit(carbonData.projectName, 50),
    projectId: trimAndLimit(carbonData.projectId, 32),
    vintageYear: parseInt(carbonData.vintageYear),
    metricTons: new anchor.BN(
      carbonData.metricTons || carbonData.creditAmount || 1
    ),
    validator: trimAndLimit(
      carbonData.validator || carbonData.certificationBody || "Unknown",
      32
    ),
    standard: trimAndLimit(
      carbonData.standard || carbonData.creditStandard || "VCS",
      16
    ),
    projectType: trimAndLimit(carbonData.projectType || "Reforestation", 32),
    country: trimAndLimit(
      carbonData.country || carbonData.projectLocation || "Unknown",
      32
    ),
  };

  console.log("📋 On-chain data:", onChainCarbonData);
  console.log("📏 String lengths:", {
    projectName: onChainCarbonData.projectName.length,
    projectId: onChainCarbonData.projectId.length,
    validator: onChainCarbonData.validator.length,
    standard: onChainCarbonData.standard.length,
    projectType: onChainCarbonData.projectType.length,
    country: onChainCarbonData.country.length,
  });

  try {
    // Validate and trim metadata parameters
    const trimmedName = (name || "Carbon Credit").trim().substring(0, 32);
    const trimmedSymbol = (symbol || "CARBON").trim().substring(0, 10);
    const trimmedUri = (metadataUri || "").substring(0, 200);

    console.log("📝 Metadata params:", {
      name: trimmedName,
      symbol: trimmedSymbol,
      uriLength: trimmedUri.length,
    });

    // Send transaction
    console.log("📤 Sending transaction...");

    const tx = await program.methods
      .mintCarbonCredit(
        onChainCarbonData,
        trimmedUri,
        trimmedName,
        trimmedSymbol
      )
      .accounts({
        carbonExchange: exchangePda,
        mint: mint,
        tokenAccount: tokenAccount,
        metadata: metadataPda,
        masterEdition: masterEditionPda,
        payer: wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        tokenMetadataProgram: METAPLEX_TOKEN_METADATA_PROGRAM_ID,
        sysvarInstructions: SYSVAR_INSTRUCTIONS_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .signers([mintKeypair])
      .rpc();

    console.log("✅ Transaction successful!");
    console.log("📜 Signature:", tx);

    // Wait for confirmation
    await connection.confirmTransaction(tx, "confirmed");
    console.log("✅ Transaction confirmed");

    return {
      mint: mint.toBase58(),
      signature: tx,
      explorerUrl: `https://explorer.solana.com/tx/${tx}?cluster=${
        import.meta.env.VITE_SOLANA_NETWORK || "devnet"
      }`,
      mintExplorerUrl: `https://explorer.solana.com/address/${mint.toBase58()}?cluster=${
        import.meta.env.VITE_SOLANA_NETWORK || "devnet"
      }`,
    };
  } catch (error) {
    console.error("❌ Mint failed:", error);

    // Parse Anchor errors
    if (error.logs) {
      console.error("Program logs:", error.logs);
    }

    throw new Error(error.message || "Failed to mint carbon credit");
  }
};

/**
 * Get carbon credit info from mint address
 */
export const getCarbonCreditInfo = async (connection, wallet, mintAddress) => {
  try {
    const program = getProgram(connection, wallet);
    const mint = new PublicKey(mintAddress);

    // Get token account
    const tokenAccount = await getAssociatedTokenAddress(
      mint,
      wallet.publicKey
    );
    const tokenAccountInfo = await connection.getAccountInfo(tokenAccount);

    if (!tokenAccountInfo) {
      throw new Error("Token account not found");
    }

    // Get metadata
    const metadataPda = await getMetadataPDA(mint);
    const metadataAccountInfo = await connection.getAccountInfo(metadataPda);

    return {
      mint: mint.toBase58(),
      owner: wallet.publicKey.toBase58(),
      hasMetadata: !!metadataAccountInfo,
    };
  } catch (error) {
    console.error("Error getting carbon credit info:", error);
    throw error;
  }
};

/**
 * ✅ Check if wallet owns an NFT
 */
export const checkNFTOwnership = async (connection, wallet, mintAddress) => {
  try {
    if (!wallet.publicKey) {
      return {
        owned: false,
        balance: 0,
        error: "Wallet not connected",
      };
    }

    const mint = new PublicKey(mintAddress);
    const tokenAccount = await getAssociatedTokenAddress(
      mint,
      wallet.publicKey
    );

    // Check if ATA exists
    const tokenAccountInfo = await connection.getAccountInfo(tokenAccount);

    if (!tokenAccountInfo) {
      return {
        owned: false,
        balance: 0,
        tokenAccount: tokenAccount.toBase58(),
        error:
          "Token account does not exist. You have not minted or received this NFT.",
      };
    }

    // Check balance
    const tokenAccountData = await connection.getTokenAccountBalance(
      tokenAccount
    );
    const balance = parseInt(tokenAccountData.value.amount);

    return {
      owned: balance >= 1,
      balance,
      tokenAccount: tokenAccount.toBase58(),
      error: balance < 1 ? "You do not own this NFT (balance = 0)" : null,
    };
  } catch (error) {
    console.error("Error checking NFT ownership:", error);
    return {
      owned: false,
      balance: 0,
      error: error.message,
    };
  }
};

/**
 * List carbon credit for sale
 */
export const listForSale = async (
  connection,
  wallet,
  mintAddress,
  priceInSOL
) => {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  const program = getProgram(connection, wallet);
  const mint = new PublicKey(mintAddress);
  const exchangePda = await getExchangePDA();
  const tokenAccount = await getAssociatedTokenAddress(mint, wallet.publicKey);

  // ✅ Kiểm tra xem ATA có tồn tại không
  const tokenAccountInfo = await connection.getAccountInfo(tokenAccount);

  if (!tokenAccountInfo) {
    throw new Error(
      "You do not own this NFT. The token account does not exist for your wallet. " +
        "Please make sure you minted or received this NFT first."
    );
  }

  // ✅ Kiểm tra balance của ATA
  const tokenAccountData = await connection.getTokenAccountBalance(
    tokenAccount
  );
  const balance = parseInt(tokenAccountData.value.amount);

  if (balance < 1) {
    throw new Error(
      `You do not own this NFT. Your token balance is ${balance}. ` +
        "You need at least 1 NFT to list it for sale."
    );
  }

  // Derive listing PDA
  const [listingPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("listing"), mint.toBuffer()],
    PROGRAM_ID
  );

  const priceInLamports = new anchor.BN(
    priceInSOL * anchor.web3.LAMPORTS_PER_SOL
  );

  // Check if there's already a listing for this NFT
  const existingListing = await connection.getAccountInfo(listingPda);
  if (existingListing) {
    throw new Error(
      "This NFT is already listed for sale. Please delist it first if you want to update the price."
    );
  }

  try {
    const tx = await program.methods
      .listForSale(priceInLamports)
      .accounts({
        carbonExchange: exchangePda,
        owner: wallet.publicKey,
        mint: mint,
        tokenAccount: tokenAccount,
        listing: listingPda,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    await connection.confirmTransaction(tx, "confirmed");

    return {
      signature: tx,
      listing: listingPda.toBase58(),
    };
  } catch (error) {
    console.error("List for sale failed:", error);
    throw error;
  }
};

/**
 * Buy carbon credit
 */
export const buyCarbonCredit = async (connection, wallet, mintAddress) => {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  const program = getProgram(connection, wallet);
  const mint = new PublicKey(mintAddress);
  const exchangePda = await getExchangePDA();

  // Derive listing PDA
  const [listingPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("listing"), mint.toBuffer()],
    PROGRAM_ID
  );

  // Get listing to find seller
  const listing = await program.account.listing.fetch(listingPda);
  const seller = listing.owner;

  const sellerTokenAccount = await getAssociatedTokenAddress(mint, seller);
  const buyerTokenAccount = await getAssociatedTokenAddress(
    mint,
    wallet.publicKey
  );

  try {
    const tx = await program.methods
      .buyCarbonCredit()
      .accounts({
        carbonExchange: exchangePda,
        buyer: wallet.publicKey,
        seller: seller,
        mint: mint,
        sellerTokenAccount: sellerTokenAccount,
        buyerTokenAccount: buyerTokenAccount,
        listing: listingPda,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    await connection.confirmTransaction(tx, "confirmed");

    return {
      signature: tx,
    };
  } catch (error) {
    console.error("Buy failed:", error);
    throw error;
  }
};

/**
 * Retire carbon credit
 */
export const retireCarbonCredit = async (
  connection,
  wallet,
  mintAddress,
  beneficiary
) => {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  const program = getProgram(connection, wallet);
  const mint = new PublicKey(mintAddress);
  const exchangePda = await getExchangePDA();
  const tokenAccount = await getAssociatedTokenAddress(mint, wallet.publicKey);

  // Derive retirement record PDA
  const [retirementRecordPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("retirement"), mint.toBuffer()],
    PROGRAM_ID
  );

  const beneficiaryPubkey = beneficiary
    ? new PublicKey(beneficiary)
    : wallet.publicKey;

  try {
    const tx = await program.methods
      .retireCarbonCredit(beneficiaryPubkey)
      .accounts({
        carbonExchange: exchangePda,
        owner: wallet.publicKey,
        mint: mint,
        tokenAccount: tokenAccount,
        retirementRecord: retirementRecordPda,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    await connection.confirmTransaction(tx, "confirmed");

    return {
      signature: tx,
      retirementRecord: retirementRecordPda.toBase58(),
    };
  } catch (error) {
    console.error("Retire failed:", error);
    throw error;
  }
};

export default {
  getProgram,
  getExchangePDA,
  mintCarbonCredit,
  getCarbonCreditInfo,
  listForSale,
  buyCarbonCredit,
  retireCarbonCredit,
};
