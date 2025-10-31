import { Connection, PublicKey } from '@solana/web3.js';

export interface MetaplexMetadata {
    key: number;
    updateAuthority: string;
    mint: string;
    data: {
        name: string;
        symbol: string;
        uri: string;
        sellerFeeBasisPoints: number;
        creators?: Array<{
            address: string;
            verified: boolean;
            share: number;
        }>;
    };
    primarySaleHappened: boolean;
    isMutable: boolean;
    editionNonce: number | null;
    tokenStandard: number | null;
    collection: null | {
        verified: boolean;
        key: string;
    };
    uses: null | {
        useMethod: number;
        remaining: number;
        total: number;
    };
}

export const METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

export const getMetadataPDA = async (mint: PublicKey): Promise<PublicKey> => {
    const [metadataPda] = PublicKey.findProgramAddressSync(
        [
            Buffer.from('metadata'),
            METADATA_PROGRAM_ID.toBuffer(),
            mint.toBuffer(),
        ],
        METADATA_PROGRAM_ID
    );
    return metadataPda;
};

export const decodeMetadata = (buffer: Buffer): MetaplexMetadata => {
    let offset = 0;

    const readString = () => {
        const len = buffer[offset];
        offset += 1;
        const str = buffer.slice(offset, offset + len).toString('utf8');
        offset += 32; // Fixed length in Rust, padded with 0s
        return str.replace(/\0/g, '');
    };

    const key = buffer[0];
    offset += 1;

    const updateAuthority = new PublicKey(buffer.slice(1, 33));
    const mint = new PublicKey(buffer.slice(33, 65));

    offset = 65;

    const name = readString();
    const symbol = readString();
    const uri = readString();

    const sellerFeeBasisPoints = buffer.readUInt16LE(offset);
    offset += 2;

    let creators: { address: string; verified: boolean; share: number }[] | undefined;

    const hasCreators = buffer[offset] === 1;
    offset += 1;

    if (hasCreators) {
        const creatorCount = buffer[offset];
        offset += 1;
        creators = [];

        for (let i = 0; i < creatorCount; i++) {
            const creator = new PublicKey(buffer.slice(offset, offset + 32));
            offset += 32;
            const verified = buffer[offset] === 1;
            offset += 1;
            const share = buffer[offset];
            offset += 1;

            creators.push({
                address: creator.toBase58(),
                verified,
                share,
            });
        }
    }

    const primarySaleHappened = buffer[offset] === 1;
    offset += 1;

    const isMutable = buffer[offset] === 1;
    offset += 1;

    // Optional fields
    let editionNonce: number | null = null;
    if (buffer.length > offset) {
        const hasEditionNonce = buffer[offset] === 1;
        offset += 1;
        if (hasEditionNonce) {
            editionNonce = buffer[offset];
            offset += 1;
        }
    }

    let tokenStandard: number | null = null;
    if (buffer.length > offset) {
        tokenStandard = buffer[offset];
        offset += 1;
    }

    let collection: null | { verified: boolean; key: string } = null;
    if (buffer.length > offset && buffer[offset] === 1) {
        offset += 1;
        const collectionKey = new PublicKey(buffer.slice(offset, offset + 32));
        offset += 32;
        const verified = buffer[offset] === 1;
        offset += 1;
        collection = {
            verified,
            key: collectionKey.toBase58(),
        };
    }

    let uses: null | { useMethod: number; remaining: number; total: number } = null;
    if (buffer.length > offset && buffer[offset] === 1) {
        offset += 1;
        const useMethod = buffer[offset];
        offset += 1;
        const remaining = buffer.readBigUInt64LE(offset);
        offset += 8;
        const total = buffer.readBigUInt64LE(offset);
        uses = {
            useMethod,
            remaining: Number(remaining),
            total: Number(total),
        };
    }

    return {
        key,
        updateAuthority: updateAuthority.toBase58(),
        mint: mint.toBase58(),
        data: {
            name,
            symbol,
            uri,
            sellerFeeBasisPoints,
            creators,
        },
        primarySaleHappened,
        isMutable,
        editionNonce,
        tokenStandard,
        collection,
        uses,
    };
};

export const fetchMetadata = async (connection: Connection, mint: PublicKey): Promise<MetaplexMetadata> => {
    const metadataPDA = await getMetadataPDA(mint);
    const accountInfo = await connection.getAccountInfo(metadataPDA);

    if (!accountInfo) {
        throw new Error('Metadata account not found');
    }

    return decodeMetadata(accountInfo.data);
};