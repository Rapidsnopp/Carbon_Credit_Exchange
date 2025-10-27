import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * CarbonCredit Model - Off-chain metadata storage
 * 
 * TODO: Customize fields based on your carbon credit standards
 * - Add more certification fields
 * - Add verification documents
 * - Add project milestones
 */
const CarbonCreditSchema = new Schema(
  {
    // On-chain references
    mint: {
      type: String,
      required: true,
      unique: true,
      index: true,
      // NOTE: Mint address from Solana
    },
    owner: {
      type: String,
      required: true,
      index: true,
      // NOTE: Current owner wallet address
    },
    
    // Project Information
    projectName: {
      type: String,
      required: true,
      // TODO: Add validation for project name format
    },
    location: {
      country: { type: String, required: true },
      region: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
      // TODO: Add GeoJSON support for map visualization
    },
    
    // Carbon Credit Details
    vintageYear: {
      type: Number,
      required: true,
      min: 2000,
      max: 2100,
      // TODO: Validate vintage year is not in future
    },
    carbonAmount: {
      type: Number,
      required: true,
      min: 0,
      // NOTE: Amount in tonnes CO2e
    },
    verificationStandard: {
      type: String,
      required: true,
      enum: ['VCS', 'Gold Standard', 'CDM', 'CAR', 'CCP', 'Verra', 'Other'],
      // Add more standards as needed
    },
    
    // Metadata
    metadata: {
      name: String,
      symbol: String,
      uri: String, // Metadata URI on-chain
      description: String,
      image: String, // IPFS or CDN URL
      // TODO: Add additional metadata fields
      attributes: [
        {
          trait_type: String,
          value: String,
        },
      ],
    },
    
    // Project Details (Off-chain only)
    projectType: {
      type: String,
      enum: [
        'Renewable Energy',
        'Forestry',
        'Agriculture',
        'Waste Management',
        'Industrial',
        'Afforestation',
        'Reforestation',
        'Other',
      ],
      // TODO: Customize project types
    },
    projectDescription: {
      type: String,
      maxlength: 5000,
      // TODO: Add rich text support if needed
    },
    projectDocuments: [
      {
        name: String,
        url: String, // IPFS or S3 URL
        type: {
          type: String,
          enum: ['Certificate', 'Verification Report', 'Project Document', 'Other'],
        },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    
    // Verification & Certification
    verificationDetails: {
      verifier: String,
      verificationDate: Date,
      certificateNumber: String,
      expiryDate: Date,
      status: {
        type: String,
        enum: ['Pending', 'Verified', 'Expired', 'Rejected'],
        default: 'Pending',
      },
      // TODO: Add verification workflow states
    },
    
    // Marketplace Status
    isListed: {
      type: Boolean,
      default: false,
      index: true,
    },
    listingPrice: Number, // In SOL (lamports)
    
    // Retirement Status
    isRetired: {
      type: Boolean,
      default: false,
      index: true,
    },
    retirementDetails: {
      retiredBy: String,
      retiredAt: Date,
      beneficiary: String,
      reason: String,
      // TODO: Add retirement certificate generation
    },
    
    // Analytics & Tracking
    views: {
      type: Number,
      default: 0,
    },
    favorites: {
      type: Number,
      default: 0,
    },
    
    // Status
    status: {
      type: String,
      enum: ['Active', 'Listed', 'Retired', 'Archived'],
      default: 'Active',
      index: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    // TODO: Add indexes for common queries
  }
);

// Indexes for performance
// TODO: Add compound indexes based on your query patterns
CarbonCreditSchema.index({ owner: 1, status: 1 });
CarbonCreditSchema.index({ projectType: 1, vintageYear: -1 });
CarbonCreditSchema.index({ isListed: 1, listingPrice: 1 });
CarbonCreditSchema.index({ 'location.country': 1 });

// Virtual for age
CarbonCreditSchema.virtual('age').get(function () {
  const currentYear = new Date().getFullYear();
  return currentYear - this.vintageYear;
});

// Methods
CarbonCreditSchema.methods.retire = function (retiredBy: string, beneficiary: string, reason?: string) {
  this.isRetired = true;
  this.retirementDetails = {
    retiredBy,
    retiredAt: new Date(),
    beneficiary,
    reason: reason || 'Carbon offset',
  };
  this.status = 'Retired';
  return this.save();
};

CarbonCreditSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Statics
CarbonCreditSchema.statics.findByOwner = function (owner: string) {
  return this.find({ owner, status: { $ne: 'Archived' } });
};

CarbonCreditSchema.statics.findActive = function () {
  return this.find({ status: 'Active', isRetired: false });
};

CarbonCreditSchema.statics.findListed = function () {
  return this.find({ isListed: true, status: 'Listed' });
};

export const CarbonCredit = mongoose.model('CarbonCredit', CarbonCreditSchema);
export default CarbonCredit;
