import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * MarketplaceListing Model - Off-chain listing data
 * 
 * TODO: Customize based on your marketplace features
 * - Add auction support
 * - Add bulk listing
 * - Add listing categories
 */
const MarketplaceListingSchema = new Schema(
  {
    // On-chain references
    listingAddress: {
      type: String,
      required: true,
      unique: true,
      index: true,
      // NOTE: PDA address of listing account
    },
    mint: {
      type: String,
      required: true,
      index: true,
      // NOTE: NFT mint address
    },
    
    // Seller Information
    seller: {
      type: String,
      required: true,
      index: true,
      // NOTE: Seller wallet address
    },
    sellerProfile: {
      name: String,
      avatar: String,
      rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      totalSales: {
        type: Number,
        default: 0,
      },
      // TODO: Add seller verification status
    },
    
    // Pricing
    price: {
      type: Number,
      required: true,
      min: 0,
      // NOTE: Price in lamports (1 SOL = 1e9 lamports)
    },
    priceInSOL: {
      type: Number,
      // NOTE: Computed field for display
    },
    
    // Listing Details
    title: {
      type: String,
      maxlength: 200,
      // TODO: Add title generation from carbon credit data
    },
    description: {
      type: String,
      maxlength: 2000,
      // TODO: Add rich text description support
    },
    
    // Categories & Tags
    category: {
      type: String,
      enum: [
        'Renewable Energy',
        'Forestry',
        'Agriculture',
        'Waste Management',
        'Industrial',
        'Other',
      ],
      // TODO: Sync with CarbonCredit projectType
    },
    tags: [String],
    
    // Status
    status: {
      type: String,
      enum: ['Active', 'Sold', 'Cancelled', 'Expired'],
      default: 'Active',
      index: true,
    },
    
    // Visibility
    featured: {
      type: Boolean,
      default: false,
      index: true,
      // TODO: Add featured listing logic (payment, admin selection, etc.)
    },
    visibility: {
      type: String,
      enum: ['Public', 'Private', 'Unlisted'],
      default: 'Public',
    },
    
    // Sale Information
    soldTo: String,
    soldAt: Date,
    soldPrice: Number,
    transactionSignature: String,
    
    // Analytics
    views: {
      type: Number,
      default: 0,
    },
    favorites: {
      type: Number,
      default: 0,
    },
    inquiries: {
      type: Number,
      default: 0,
    },
    
    // Expiration
    expiresAt: {
      type: Date,
      index: true,
      // TODO: Implement auto-expiration logic
    },
    
    // Additional Features
    negotiable: {
      type: Boolean,
      default: false,
      // TODO: Add price negotiation feature
    },
    bulkDiscount: {
      enabled: Boolean,
      minQuantity: Number,
      discountPercentage: Number,
      // TODO: Implement bulk purchase logic
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
// TODO: Add indexes based on your query patterns
MarketplaceListingSchema.index({ seller: 1, status: 1 });
MarketplaceListingSchema.index({ price: 1, status: 1 });
MarketplaceListingSchema.index({ category: 1, status: 1 });
MarketplaceListingSchema.index({ featured: 1, status: 1 });
MarketplaceListingSchema.index({ createdAt: -1 });

// Pre-save middleware
MarketplaceListingSchema.pre('save', function (next) {
  // Convert lamports to SOL for display
  if (this.price) {
    this.priceInSOL = this.price / 1e9;
  }
  next();
});

// Methods
MarketplaceListingSchema.methods.markAsSold = function (
  buyer: string,
  transactionSignature: string
) {
  this.status = 'Sold';
  this.soldTo = buyer;
  this.soldAt = new Date();
  this.soldPrice = this.price;
  this.transactionSignature = transactionSignature;
  return this.save();
};

MarketplaceListingSchema.methods.cancel = function () {
  this.status = 'Cancelled';
  return this.save();
};

MarketplaceListingSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

MarketplaceListingSchema.methods.incrementFavorites = function () {
  this.favorites += 1;
  return this.save();
};

// Statics
MarketplaceListingSchema.statics.findActive = function () {
  return this.find({ status: 'Active' }).sort({ createdAt: -1 });
};

MarketplaceListingSchema.statics.findBySeller = function (seller: string) {
  return this.find({ seller }).sort({ createdAt: -1 });
};

MarketplaceListingSchema.statics.findFeatured = function () {
  return this.find({ featured: true, status: 'Active' }).limit(10);
};

export const MarketplaceListing = mongoose.model(
  'MarketplaceListing',
  MarketplaceListingSchema
);
export default MarketplaceListing;
