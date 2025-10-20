import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Transaction Model - Transaction history storage
 * 
 * TODO: Customize based on analytics needs
 * - Add more transaction types
 * - Add fee tracking
 * - Add batch transaction support
 */
const TransactionSchema = new Schema(
  {
    // Transaction Identification
    signature: {
      type: String,
      required: true,
      unique: true,
      index: true,
      // NOTE: Solana transaction signature
    },
    
    // Transaction Type
    type: {
      type: String,
      required: true,
      enum: [
        'MINT',
        'LIST',
        'CANCEL_LISTING',
        'PURCHASE',
        'RETIRE',
        'TRANSFER',
        'OTHER',
      ],
      index: true,
      // TODO: Add more transaction types as needed
    },
    
    // Involved Parties
    from: {
      type: String,
      index: true,
      // NOTE: Sender wallet address (null for minting)
    },
    to: {
      type: String,
      index: true,
      // NOTE: Receiver wallet address
    },
    
    // Asset Information
    mint: {
      type: String,
      required: true,
      index: true,
      // NOTE: NFT mint address
    },
    
    // Transaction Details
    amount: {
      type: Number,
      // NOTE: Amount in lamports for purchases, null for other types
    },
    amountInSOL: {
      type: Number,
      // NOTE: Computed field for display
    },
    
    // Blockchain Data
    slot: {
      type: Number,
      index: true,
      // NOTE: Solana slot number
    },
    blockTime: {
      type: Date,
      index: true,
      // NOTE: Block timestamp
    },
    
    // Status
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Failed', 'Cancelled'],
      default: 'Confirmed',
      index: true,
    },
    error: {
      type: String,
      // NOTE: Error message if failed
    },
    
    // Additional Metadata
    metadata: {
      listingAddress: String,
      price: Number,
      beneficiary: String, // For retirement
      projectName: String,
      // TODO: Add more metadata fields as needed
    },
    
    // Analytics
    feesPaid: {
      type: Number,
      default: 0,
      // NOTE: Transaction fees in lamports
    },
    
    // Notes
    notes: {
      type: String,
      maxlength: 500,
      // TODO: Add user notes or admin notes
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
// TODO: Add compound indexes based on your analytics queries
TransactionSchema.index({ type: 1, blockTime: -1 });
TransactionSchema.index({ from: 1, blockTime: -1 });
TransactionSchema.index({ to: 1, blockTime: -1 });
TransactionSchema.index({ mint: 1, blockTime: -1 });
TransactionSchema.index({ status: 1, blockTime: -1 });

// Pre-save middleware
TransactionSchema.pre('save', function (next) {
  // Convert lamports to SOL
  if (this.amount) {
    this.amountInSOL = this.amount / 1e9;
  }
  next();
});

// Statics
TransactionSchema.statics.findByWallet = function (wallet: string) {
  return this.find({
    $or: [{ from: wallet }, { to: wallet }],
  }).sort({ blockTime: -1 });
};

TransactionSchema.statics.findByMint = function (mint: string) {
  return this.find({ mint }).sort({ blockTime: -1 });
};

TransactionSchema.statics.findByType = function (type: string) {
  return this.find({ type }).sort({ blockTime: -1 });
};

TransactionSchema.statics.getRecentTransactions = function (limit: number = 50) {
  return this.find({ status: 'Confirmed' })
    .sort({ blockTime: -1 })
    .limit(limit);
};

// Analytics methods
TransactionSchema.statics.getTotalVolume = async function () {
  const result = await this.aggregate([
    { $match: { type: 'PURCHASE', status: 'Confirmed' } },
    { $group: { _id: null, totalVolume: { $sum: '$amount' } } },
  ]);
  return result[0]?.totalVolume || 0;
};

TransactionSchema.statics.getVolumeByPeriod = async function (
  startDate: Date,
  endDate: Date
) {
  return this.aggregate([
    {
      $match: {
        type: 'PURCHASE',
        status: 'Confirmed',
        blockTime: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$blockTime' } },
        volume: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

export const Transaction = mongoose.model('Transaction', TransactionSchema);
export default Transaction;
