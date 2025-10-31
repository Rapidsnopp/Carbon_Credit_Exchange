export type MarketplaceListingType = {
  // On-chain references
  listingAddress: string; // PDA address of listing account
  mint: string; // NFT mint address

  // Seller Information
  seller: string; // Seller wallet address
  sellerProfile?: {
    name?: string;
    avatar?: string;
    rating?: number; // 0 - 5
    totalSales?: number;
  };

  // Pricing
  price: number; // In lamports
  priceInSOL?: number; // Computed field for display

  // Listing Details
  title?: string;
  description?: string;

  // Categories & Tags
  category?:
  | "Renewable Energy"
  | "Forestry"
  | "Agriculture"
  | "Waste Management"
  | "Industrial"
  | "Other";
  tags?: string[];

  // Status
  status?: "Active" | "Sold" | "Cancelled" | "Expired";

  // Visibility
  featured?: boolean;
  visibility?: "Public" | "Private" | "Unlisted";

  // Sale Information
  soldTo?: string;
  soldAt?: Date;
  soldPrice?: number;
  transactionSignature?: string;

  // Analytics
  views?: number;
  favorites?: number;
  inquiries?: number;

  // Expiration
  expiresAt?: Date;

  // Additional Features
  negotiable?: boolean;
  bulkDiscount?: {
    enabled?: boolean;
    minQuantity?: number;
    discountPercentage?: number;
  };
};
