import { Request, Response } from 'express';
import SolanaService from '../services/solanaService';
import PinataClient from '@pinata/sdk';
import fs from 'fs';
import { Buffer } from 'buffer';
import { solanaConfig } from '../config/solana.config'; // Chứa admin keypair, connection
import CarbonCredit from '../models/carbonCredit'; // Model MongoDB

import {
    Keypair,
    Transaction,
    SystemProgram,
    PublicKey,
} from "@solana/web3.js";
import {
    TOKEN_PROGRAM_ID,
    MINT_SIZE,
    createInitializeMintInstruction,
    createAssociatedTokenAccountInstruction,
    createMintToInstruction,
    getAssociatedTokenAddress
} from "@solana/spl-token";
import {
    createCreateMetadataAccountV3Instruction,
    PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";

// --- Khởi tạo Pinata Client  ---
const pinata = new PinataClient({
  pinataJWTKey: process.env.PINATA_JWT,
});
/**
 * GET /api/carbon-credits
 * Get all carbon credit NFTs (listings)
 */
export const getAllCarbonCredits = async (req: Request, res: Response) => {
  try {
    const listings = await SolanaService.getAllListings();
    
    // Enrich with metadata if needed
    const enrichedListings = await Promise.all(
      listings.map(async (listing) => {
        const metadata = await SolanaService.getNFTMetadata(listing.mint);
        return {
          ...listing,
          metadata,
        };
      })
    );
    
    res.json({
      success: true,
      data: enrichedListings,
      count: enrichedListings.length,
    });
  } catch (error: any) {
    console.error('Error fetching carbon credits:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch carbon credits',
      message: error.message,
    });
  }
};

/**
 * GET /api/carbon-credits/:mint
 * Get specific carbon credit NFT by mint address
 */
export const getCarbonCreditByMint = async (req: Request, res: Response) => {
  try {
    const { mint } = req.params;

    // BƯỚC 1: Luôn lấy dữ liệu gốc từ MongoDB
    // Đây là metadata (tên, ảnh, mô tả...)
    const dbMetadata = await CarbonCredit.findOne({ mint });

    // Nếu không có trong DB, thì đó mới thực sự là 404
    if (!dbMetadata) {
      return res.status(404).json({
        success: false,
        error: 'Carbon credit not found in database',
      });
    }

    // BƯỚC 2: Thử lấy thông tin on-chain (Listing và Retirement)

    let listing = null;
    try {
      listing = await SolanaService.getListingInfo(mint);
    } catch (error) {
      console.log(`Info: NFT ${mint} is not listed for sale.`);
    }

    let retirement = null;
    try {
      retirement = await SolanaService.getRetirementRecord(mint);
    } catch (error) {
      console.log(`Info: NFT ${mint} is not retired.`);
    }

    // BƯỚC 3: Trả về tất cả dữ liệu
    // Frontend sẽ nhận được metadata (từ DB) và trạng thái on-chain (listing/retirement)
    res.json({
      success: true,
      data: {
        mint,
        metadata: dbMetadata, // Gửi toàn bộ object từ MongoDB
        listing, // Sẽ là null nếu chưa list
        retirement, // Sẽ là null nếu chưa retired
        isListed: !!listing,
        isRetired: !!retirement,
      },
    });

  } catch (error: any) {
    console.error('Error fetching carbon credit:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch carbon credit',
      message: error.message,
    });
  }
};

/**
 * GET /api/carbon-credits/wallet/:address
 * Get all carbon credits owned by a wallet
 */
export const getCarbonCreditsByWallet = async (req: Request, res: Response) => {
  try {
    const { address } = req.params;

    // --- BƯỚC 1: Lấy danh sách NFT từ on-chain ---
    // Điều này đảm bảo chúng ta chỉ lấy những NFT mà người dùng thực sự sở hữu.
    const onChainNfts = await SolanaService.getWalletNFTs(address);
    if (!onChainNfts || onChainNfts.length === 0) {
      return res.json({
        success: true,
        data: [],
        count: 0,
      });
    }
    
    // Lấy ra danh sách các địa chỉ mint
    const mintAddresses = onChainNfts.map(nft => nft.mint);

    // --- BƯỚC 2: Dùng danh sách mint để truy vấn MongoDB ---
    // Thay vì đọc metadata on-chain, chúng ta đọc metadata
    // đã được lưu trong database của chính mình.
    const dbCredits = await CarbonCredit.find({
      'mint': { $in: mintAddresses }
    });
    
    // --- BƯỚC 3: Kết hợp và trả về dữ liệu ---
    // Chuyển dbCredits thành một map để dễ dàng tra cứu
    const dbCreditsMap = new Map(dbCredits.map(c => [c.mint, c]));

    const enrichedNFTs = mintAddresses.map(mint => {
      const onChainData = onChainNfts.find(nft => nft.mint === mint);
      const dbData = dbCreditsMap.get(mint);
      
      // Kết hợp dữ liệu từ cả hai nguồn nếu cần,
      // nhưng ưu tiên dữ liệu từ DB.
      return {
        ...onChainData, // Chứa tokenAccount
        ...dbData?.toObject(), // Chứa tất cả thông tin dự án, ảnh, và quan trọng nhất là ATTRIBUTES
      };
    });

    res.json({
      success: true,
      data: enrichedNFTs,
      count: enrichedNFTs.length,
    });
  } catch (error: any) {
    console.error('Error fetching wallet NFTs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch wallet NFTs',
      message: error.message,
    });
  }
};

/**
 * GET /api/carbon-credits/stats
 * Get statistics about carbon credits
 */
export const getCarbonCreditStats = async (req: Request, res: Response) => {
  try {
    const exchange = await SolanaService.getExchangeInfo();
    const listings = await SolanaService.getAllListings();
    
    res.json({
      success: true,
      data: {
        totalMinted: exchange?.totalCredits || 0,
        activeListings: listings.length,
        exchangeAddress: exchange?.address,
        exchangeAuthority: exchange?.authority,
      },
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message,
    });
  }
};

/**
 * POST /api/carbon-credits/mint
 * Controller chính để mint NFT
 */
export const mintCarbonCredit = async (req: Request, res: Response) => {
    try {
        // --- BƯỚC 1: Nhận dữ liệu ---
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }
        
        // Dữ liệu form từ req.body (ví dụ: projectName, description...)
        const projectDetails = req.body;
        const filePath = req.file.path;
        const fileStream = fs.createReadStream(filePath);

        // Lấy ví admin từ config (thay vì anchorWallet của frontend)
        const adminWallet = solanaConfig.adminKeypair; 
        const connection = solanaConfig.connection;

        console.log("Bắt đầu mint với ví Admin:", adminWallet.publicKey.toBase58());

        // --- BƯỚC 2: Upload ảnh lên IPFS ---
        // (Logic giống hệt uploadController.ts)
        const imageResult = await pinata.pinFileToIPFS(fileStream, {
            pinataMetadata: { name: req.file.originalname },
        });
        const imageUrl = `ipfs://${imageResult.IpfsHash}`;
        console.log("Image uploaded:", imageUrl);
        // Xóa file tạm
        fs.unlinkSync(filePath);

        // --- BƯỚC 3: Tạo và Upload JSON Metadata lên IPFS ---
        const metadataJson = {
            name: projectDetails.projectName,
            symbol: "CO2C", // Hoặc lấy từ req.body
            description: projectDetails.description,
            image: imageUrl,
            attributes: [
                { trait_type: 'Location', value: projectDetails.projectLocation },
                { trait_type: 'Type', value: projectDetails.projectType },
                { trait_type: 'Credits', value: projectDetails.creditAmount },
                { trait_type: 'Standard', value: projectDetails.creditStandard },
            ]
        };

        const jsonResult = await pinata.pinJSONToIPFS(metadataJson, {
            pinataMetadata: { name: `${projectDetails.projectName} Metadata` },
        });
        const metadataUri = `ipfs://${jsonResult.IpfsHash}`;
        console.log("Metadata JSON uploaded:", metadataUri);
        
        // --- BƯỚC 4: Thực thi Mint On-Chain ---
        // (Logic giống hệt handleMint (thật) trong MintCredit.tsx)
        const mintKeypair = Keypair.generate();
        const transaction = new Transaction();
        const lamports = await connection.getMinimumBalanceForRentExemption(MINT_SIZE);

        transaction.add(
            SystemProgram.createAccount({
                fromPubkey: adminWallet.publicKey, // Payer là Admin
                newAccountPubkey: mintKeypair.publicKey,
                space: MINT_SIZE,
                lamports,
                programId: TOKEN_PROGRAM_ID,
            })
        );
        transaction.add(
            createInitializeMintInstruction(
                mintKeypair.publicKey, 0, adminWallet.publicKey, adminWallet.publicKey // Mint Authority là Admin
            )
        );
        
        // Gửi NFT cho ai? Mặc định là cho chính Admin.
        // Nếu bạn muốn gửi cho người dùng, frontend phải gửi `userPublicKey` trong req.body
        const ownerPublicKey = projectDetails.userPublicKey 
            ? new PublicKey(projectDetails.userPublicKey) 
            : adminWallet.publicKey;

        const ata = await getAssociatedTokenAddress(mintKeypair.publicKey, ownerPublicKey);
        transaction.add(
            createAssociatedTokenAccountInstruction(
                adminWallet.publicKey, ata, ownerPublicKey, mintKeypair.publicKey
            )
        );
        transaction.add(
            createMintToInstruction(
                mintKeypair.publicKey, ata, adminWallet.publicKey, 1 // Mint 1 NFT
            )
        );

        const [metadataPDA] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("metadata"),
                TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                mintKeypair.publicKey.toBuffer(),
            ],
            TOKEN_METADATA_PROGRAM_ID
        );

        const metadataIx = createCreateMetadataAccountV3Instruction(
            {
                metadata: metadataPDA,
                mint: mintKeypair.publicKey,
                mintAuthority: adminWallet.publicKey,
                payer: adminWallet.publicKey,
                updateAuthority: adminWallet.publicKey, // Update Authority là Admin
            },
            {
                createMetadataAccountArgsV3: {
                    data: {
                        name: projectDetails.projectName,
                        symbol: "CO2C",
                        uri: metadataUri, // Dùng URI thật đã upload
                        sellerFeeBasisPoints: 500,
                        creators: [{ address: adminWallet.publicKey, verified: true, share: 100 }],
                        collection: null,
                        uses: null,
                    },
                    isMutable: true,
                    collectionDetails: null,
                },
            }
        );
        transaction.add(metadataIx);

        transaction.feePayer = adminWallet.publicKey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        
        // Ký giao dịch (dùng keypair của Admin, không cần client ký)
        transaction.partialSign(mintKeypair, adminWallet); 
        
        const sig = await connection.sendRawTransaction(transaction.serialize());
        await connection.confirmTransaction(sig);
        console.log("✅ Transaction successful:", sig);

        const newMintAddress = mintKeypair.publicKey.toBase58();

        // --- BƯỚC 5: Lưu vào MongoDB ---
        // (Logic giống hệt createMetadata trong metadataController.ts)
        const carbonCredit = new CarbonCredit({
            mint: newMintAddress,
            owner: ownerPublicKey.toBase58(), // Lưu chủ sở hữu
            projectName: projectDetails.projectName,
            location: { country: projectDetails.projectLocation },
            vintageYear: new Date(projectDetails.verificationDate).getFullYear() || 2025,
            carbonAmount: parseInt(projectDetails.creditAmount) || 0,
            verificationStandard: projectDetails.creditStandard,
            projectType: projectDetails.projectType,
            projectDescription: projectDetails.description,
            metadata: {
                name: projectDetails.projectName,
                image: imageUrl,
                uri: metadataUri,
                attributes: metadataJson.attributes
            }
        });
        await carbonCredit.save();
        console.log("Saved to MongoDB");

        // --- BƯỚC 6: Trả về kết quả ---
        res.status(201).json({
            success: true,
            message: "NFT Minted successfully!",
            mint: newMintAddress,
            imageUrl: imageUrl,
            metadataUri: metadataUri,
        });

    } catch (error: any) {
        console.error("Lỗi nghiêm trọng khi mint on-chain:", error);
        res.status(500).json({ success: false, error: 'Failed to mint NFT', message: error.message });
    }
};

/**
 * POST /api/carbon-credits/verify
 * Verify a carbon credit NFT authenticity
 */
export const verifyCarbonCredit = async (req: Request, res: Response) => {
  try {
    const { mint } = req.body;
    
    if (!mint) {
      return res.status(400).json({
        success: false,
        error: 'Mint address is required',
      });
    }
    
    // Check metadata
    const metadata = await SolanaService.getNFTMetadata(mint);
    
    // Check if it's from our program
    const listing = await SolanaService.getListingInfo(mint);
    const retirement = await SolanaService.getRetirementRecord(mint);
    
    const isValid = !!(metadata && (listing || retirement));
    
    res.json({
      success: true,
      data: {
        mint,
        isValid,
        metadata,
        listing,
        retirement,
        verifiedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Error verifying carbon credit:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify carbon credit',
      message: error.message,
    });
  }
};

export const CarbonCreditController = {
  getAllCarbonCredits,
  getCarbonCreditByMint,
  getCarbonCreditsByWallet,
  getCarbonCreditStats,
  verifyCarbonCredit,
};

export default CarbonCreditController;
