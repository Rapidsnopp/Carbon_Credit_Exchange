export type ProjectDetails = {
    projectName: string;
    projectLocation: string;
    projectType: string;
    creditAmount: string | number;
    creditStandard: string;
    certificationBody: string;
    verificationDate: string;
    description: string;
};

export type MintedNFT = {
    id: number | string;
    name: string;
    tokenId: string;
    image: string;
    attributes: Array<{ trait_type: string; value: string | number }>;
};

export type VerificationResult = {
    id: string;
    isValid: boolean;
    project: string;
    location: string;
    credits: number;
    vintage: string;
    standard: string;
    issuedDate: string;
    status: 'Active' | 'Retired' | string;
    blockchain?: string;
    transactionHash?: string;
};

export type TradingAsset = {
    id: string | number;
    name: string;
    location: string;
    credits: number;
    price: number;
    change: number;
    image: string;
    category: string;
    mint?: string; // Optional mint address for blockchain NFTs
};

export type Stats = {
    totalCredits: number;
    verifiedProjects: number;
    treesPreserved: number;
    co2Offset: number;
};

export { CarbonCreditType } from "./carbonCredit"
export { MarketplaceListingType } from "./marketplaceListing"