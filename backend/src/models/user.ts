import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * User/Wallet Profile Model - Off-chain user data
 * 
 * TODO: Implement full user profile system
 * - Add authentication (if needed)
 * - Add KYC/verification
 * - Add preferences and settings
 */
const UserSchema = new Schema(
  {
    // Wallet Information
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      index: true,
      // NOTE: Primary Solana wallet address
    },
    
    // Profile Information
    profile: {
      name: String,
      bio: {
        type: String,
        maxlength: 500,
      },
      avatar: String, // URL to avatar image
      coverImage: String,
      website: String,
      social: {
        twitter: String,
        discord: String,
        telegram: String,
        // TODO: Add more social links
      },
    },
    
    // Verification Status
    verification: {
      isVerified: {
        type: Boolean,
        default: false,
      },
      verifiedAt: Date,
      verificationType: {
        type: String,
        enum: ['Email', 'KYC', 'Organization', 'None'],
        default: 'None',
      },
      // TODO: Add KYC documents storage
    },
    
    // User Type
    userType: {
      type: String,
      enum: ['Individual', 'Organization', 'Project Developer', 'Verifier', 'Admin'],
      default: 'Individual',
      // TODO: Add role-based permissions
    },
    
    // Statistics
    stats: {
      totalMinted: {
        type: Number,
        default: 0,
      },
      totalPurchased: {
        type: Number,
        default: 0,
      },
      totalSold: {
        type: Number,
        default: 0,
      },
      totalRetired: {
        type: Number,
        default: 0,
      },
      totalVolume: {
        type: Number,
        default: 0,
        // NOTE: Total trading volume in SOL
      },
    },
    
    // Ratings & Reviews
    rating: {
      average: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    
    // Preferences
    preferences: {
      emailNotifications: {
        type: Boolean,
        default: false,
      },
      pushNotifications: {
        type: Boolean,
        default: false,
      },
      newsletter: {
        type: Boolean,
        default: false,
      },
      // TODO: Add more notification preferences
    },
    
    // Activity Tracking
    lastActive: {
      type: Date,
      default: Date.now,
    },
    
    // Status
    status: {
      type: String,
      enum: ['Active', 'Suspended', 'Banned'],
      default: 'Active',
    },
    
    // Notes (Admin only)
    adminNotes: {
      type: String,
      // TODO: Add admin note history
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
UserSchema.index({ 'profile.name': 'text' });
UserSchema.index({ userType: 1, status: 1 });
UserSchema.index({ 'verification.isVerified': 1 });

// Methods
UserSchema.methods.updateLastActive = function () {
  this.lastActive = new Date();
  return this.save();
};

UserSchema.methods.incrementMinted = function () {
  this.stats.totalMinted += 1;
  return this.save();
};

UserSchema.methods.incrementPurchased = function (amount: number) {
  this.stats.totalPurchased += 1;
  this.stats.totalVolume += amount;
  return this.save();
};

UserSchema.methods.incrementSold = function (amount: number) {
  this.stats.totalSold += 1;
  this.stats.totalVolume += amount;
  return this.save();
};

UserSchema.methods.incrementRetired = function () {
  this.stats.totalRetired += 1;
  return this.save();
};

// Statics
UserSchema.statics.findByWallet = function (walletAddress: string) {
  return this.findOne({ walletAddress });
};

UserSchema.statics.findVerified = function () {
  return this.find({ 'verification.isVerified': true, status: 'Active' });
};

UserSchema.statics.getTopSellers = function (limit: number = 10) {
  return this.find({ status: 'Active' })
    .sort({ 'stats.totalSold': -1 })
    .limit(limit);
};

export const User = mongoose.model('User', UserSchema);
export default User;
