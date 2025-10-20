import {
    Connection,
    PublicKey,
    Keypair,
    Transaction,
    sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
    createCreateMetadataAccountV3Instruction,
    PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import fs from "fs";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const payer = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync("./payer.json", "utf-8")))
);

async function mintCarbonCreditNFT() {
    // 1️⃣ Tạo mint NFT (chỉ 1 token)
    const mint = await createMint(connection, payer, payer.publicKey, payer.publicKey, 0);
    console.log("Mint address:", mint.toBase58());

    // 2️⃣ Tạo ATA cho chính chủ
    const ata = await getOrCreateAssociatedTokenAccount(connection, payer, mint, payer.publicKey);

    // 3️⃣ Mint 1 token (NFT)
    await mintTo(connection, payer, mint, ata.address, payer, 1);

    // 4️⃣ Metadata PDA
    const [metadataPDA] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("metadata"),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            mint.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
    );

    // 5️⃣ Metadata URI (đã upload trước lên Arweave/IPFS)
    const metadataUri = "https://arweave.net/xxxxxx.json";

    // 6️⃣ Tạo Metadata on-chain
    const metadataIx = createCreateMetadataAccountV3Instruction(
        {
            metadata: metadataPDA,
            mint,
            mintAuthority: payer.publicKey,
            payer: payer.publicKey,
            updateAuthority: payer.publicKey,
        },
        {
            createMetadataAccountArgsV3: {
                data: {
                    name: "Carbon Credit #01",
                    symbol: "CO2C",
                    uri: metadataUri,
                    sellerFeeBasisPoints: 1000, // 10% royalty
                    creators: [
                        { address: payer.publicKey, verified: true, share: 100 },
                    ],
                    collection: null,
                    uses: null,
                },
                isMutable: true,
                collectionDetails: null,
            },
        }
    );

    const tx = new Transaction().add(metadataIx);
    const sig = await sendAndConfirmTransaction(connection, tx, [payer]);
    console.log("✅ Metadata created:", sig);
}

mintCarbonCreditNFT().catch(console.error);
