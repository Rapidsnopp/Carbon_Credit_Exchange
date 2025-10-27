import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider } from '@coral-xyz/anchor';
import { getProgram, getExchangePDA } from './solana';
import { fetchMetadata } from './metaplex';

export interface HomeStats {
    totalCredits: number;
    verifiedProjects: number;
    treesPreserved: number;
    co2Offset: number;
}

export interface ProjectCategory {
    id: string;
    title: string;
    location: string;
    credits: number;
    impact: string;
    price: number;
    image: string;
    type: 'forest' | 'ocean' | 'renewable';
}

export const fetchHomeStats = async (connection: Connection, wallet: AnchorProvider | null): Promise<HomeStats> => {
    try {
        if (!connection) {
            throw new Error('Connection is required');
        }

        const program = wallet ? getProgram(connection, wallet) : null;
        let totalListings = 0;
        let totalMinted = 0;

        if (program) {
            const exchangePda = await getExchangePDA();
            const exchangeAccount = await program.account.carbonExchange.fetch(exchangePda);
            totalMinted = exchangeAccount.totalMinted?.toNumber() || 0;

            // Get all active listings
            const listings = await program.account.listing.all();
            totalListings = listings.length;
        }

        // Calculate approximate environmental impact
        // These are placeholder calculations - adjust based on your actual carbon credit metrics
        const avgCarbonPerCredit = 10; // tons of CO2 per credit
        const treesPerCredit = 50; // trees preserved per credit
        const estimatedCo2 = totalListings * avgCarbonPerCredit;
        const estimatedTrees = totalListings * treesPerCredit;

        return {
            totalCredits: totalListings,
            verifiedProjects: totalMinted,
            treesPreserved: estimatedTrees,
            co2Offset: estimatedCo2
        };
    } catch (error) {
        console.error('Error fetching home stats:', error);
        return {
            totalCredits: 0,
            verifiedProjects: 0,
            treesPreserved: 0,
            co2Offset: 0
        };
    }
};

export const fetchProjectCategories = async (connection: Connection, wallet: AnchorProvider | null): Promise<Record<string, ProjectCategory[]>> => {
    try {
        if (!connection) {
            throw new Error('Connection is required');
        }

        const program = wallet ? getProgram(connection, wallet) : null;
        if (!program) {
            throw new Error('Program not available');
        }

        // Get all listings
        const listings = await program.account.listing.all();
        const projectsWithMetadata = await Promise.all(
            listings.map(async (item: any) => {
                const listing = item.account;
                const mint = new PublicKey(listing.mint);

                try {
                    const metadata = await fetchMetadata(connection, mint);
                    let jsonMetadata = null;

                    if (metadata.data.uri) {
                        if (metadata.data.uri.startsWith('data:application/json;base64,')) {
                            const base64Data = metadata.data.uri.replace('data:application/json;base64,', '');
                            const decodedData = atob(base64Data);
                            jsonMetadata = JSON.parse(decodedData);
                        } else if (metadata.data.uri.startsWith('ipfs://')) {
                            const ipfsGatewayURL = metadata.data.uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
                            const response = await fetch(ipfsGatewayURL);
                            if (response.ok) {
                                jsonMetadata = await response.json();
                            }
                        }
                    }

                    const projectType = jsonMetadata?.attributes?.find((a: any) => a.trait_type === 'Project Type')?.value?.toLowerCase();
                    let type: 'forest' | 'ocean' | 'renewable' = 'forest';

                    if (projectType?.includes('ocean') || projectType?.includes('marine')) {
                        type = 'ocean';
                    } else if (projectType?.includes('energy') || projectType?.includes('renewable')) {
                        type = 'renewable';
                    }

                    return {
                        id: mint.toBase58(),
                        title: metadata.data.name || `Carbon Credit #${mint.toBase58().slice(0, 8)}`,
                        location: jsonMetadata?.location || 'Global',
                        credits: jsonMetadata?.attributes?.find((a: any) => a.trait_type === 'Credits')?.value || 1,
                        impact: `${jsonMetadata?.attributes?.find((a: any) => a.trait_type === 'Impact')?.value || '10'} tons CO₂/year`,
                        price: listing.price.toNumber() / 1e9, // Convert from lamports to SOL
                        image: jsonMetadata?.image || 'https://placehold.co/400x400',
                        type
                    };
                } catch (error) {
                    console.error('Error fetching metadata for mint:', mint.toBase58(), error);
                    return null;
                }
            })
        );

        // Filter out null values and group by type
        const validProjects = projectsWithMetadata.filter((p): p is ProjectCategory => p !== null);
        return {
            forest: validProjects.filter(p => p.type === 'forest'),
            ocean: validProjects.filter(p => p.type === 'ocean'),
            renewable: validProjects.filter(p => p.type === 'renewable')
        };
    } catch (error) {
        console.error('Error fetching project categories:', error);
        return {
            forest: [],
            ocean: [],
            renewable: []
        };
    }
};