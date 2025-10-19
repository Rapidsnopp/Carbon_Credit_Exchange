# MongoDB Off-chain Data Setup - Implementation Guide

## ✅ **Đã Hoàn Thành**

### **1. MongoDB Models** (`src/models/`)

#### **CarbonCredit Model** 
Lưu trữ metadata off-chain cho carbon credit NFTs
```typescript
- mint: Solana NFT mint address
- owner: Wallet address của owner hiện tại
- projectName, location, vintageYear: Thông tin dự án
- carbonAmount, verificationStandard: Chi tiết carbon credit
- metadata: Name, symbol, URI, description, image
- projectType, projectDescription: Thông tin chi tiết dự án
- projectDocuments: Array tài liệu (certificates, reports)
- verificationDetails: Trạng thái verification
- isListed, listingPrice: Status marketplace
- isRetired, retirementDetails: Trạng thái retired
- views, favorites: Analytics
```

**TODO Placeholders:**
- [ ] Line 17: Add validation for project name format
- [ ] Line 27: Add GeoJSON support for map visualization  
- [ ] Line 36: Validate vintage year is not in future
- [ ] Line 49: Add more standards as needed
- [ ] Line 57: Add additional metadata fields
- [ ] Line 73: Customize project types
- [ ] Line 80: Add rich text support if needed
- [ ] Line 102: Add verification workflow states
- [ ] Line 122: Add retirement certificate generation
- [ ] Line 146: Add compound indexes based on query patterns

#### **MarketplaceListing Model**
Lưu listing information
```typescript
- listingAddress: PDA của listing account
- mint, seller: NFT và seller info
- price, priceInSOL: Pricing
- title, description: Listing details
- category, tags: Classification
- status: Active/Sold/Cancelled/Expired
- featured, visibility: Display options
- soldTo, soldAt, transactionSignature: Sale info
- views, favorites, inquiries: Analytics
```

**TODO Placeholders:**
- [ ] Line 21: Add seller verification status
- [ ] Line 46: Add title generation from carbon credit data
- [ ] Line 51: Add rich text description support
- [ ] Line 62: Sync with CarbonCredit projectType
- [ ] Line 75: Add featured listing logic
- [ ] Line 97: Implement auto-expiration logic
- [ ] Line 105: Add price negotiation feature
- [ ] Line 112: Implement bulk purchase logic
- [ ] Line 120: Add indexes based on query patterns

#### **Transaction Model**
Lưu transaction history
```typescript
- signature: Solana transaction signature
- type: MINT/LIST/CANCEL_LISTING/PURCHASE/RETIRE/TRANSFER
- from, to: Wallet addresses
- mint: NFT mint address
- amount, amountInSOL: Transaction amount
- slot, blockTime: Blockchain data
- status: Pending/Confirmed/Failed/Cancelled
- metadata: Additional transaction info
```

**TODO Placeholders:**
- [ ] Line 25: Add more transaction types as needed
- [ ] Line 79: Add user notes or admin notes
- [ ] Line 86: Add compound indexes based on analytics queries

#### **User Model**
Lưu user/wallet profiles
```typescript
- walletAddress: Primary Solana wallet
- profile: name, bio, avatar, social links
- verification: KYC status
- userType: Individual/Organization/Project Developer/Verifier/Admin
- stats: totalMinted, totalPurchased, totalSold, totalRetired, totalVolume
- rating: average, count
- preferences: notifications settings
```

**TODO Placeholders:**
- [ ] Line 28: Add more social links
- [ ] Line 43: Add KYC documents storage
- [ ] Line 52: Add role-based permissions
- [ ] Line 94: Add more notification preferences
- [ ] Line 114: Add admin note history

### **2. Database Configuration** (`src/config/database.ts`)

**TODO Placeholders:**
- [ ] Line 11: Add connection pooling settings
- [ ] Line 12: Add replica set configuration
- [ ] Line 13: Add SSL/TLS settings for production
- [ ] Line 17: Adjust based on deployment environment
- [ ] Line 30-34: Add authentication if required
- [ ] Line 36-38: Add SSL/TLS for production
- [ ] Line 51: Implement retry logic or fallback

### **3. Controllers** (`src/controllers/metadataController.ts`)

**TODO Placeholders:**
- [ ] Line 11: Connect to IPFS/Arweave for decentralized storage
- [ ] Line 12: Implement metadata validation
- [ ] Line 13: Add image processing
- [ ] Line 21: Implement this endpoint
- [ ] Line 22: Validate input data
- [ ] Line 23: Upload images to IPFS
- [ ] Line 24: Store metadata in MongoDB
- [ ] Line 25: Return metadata URI
- [ ] Line 38: Validate required fields
- [ ] Line 47: Check if mint already exists
- [ ] Line 56: Implement metadata creation
- [ ] Line 107: Add authorization - only owner can update
- [ ] Line 116: Validate owner
- [ ] Line 117: Validate fields that can be updated
- [ ] Line 142: Implement background sync job
- [ ] Line 143-145: Full sync logic steps
- [ ] Line 151: Return sync statistics

### **4. API Routes**

**Metadata Routes** (`/api/metadata`)
- POST `/create` - Create off-chain metadata
- GET `/:mint` - Get metadata by mint
- PUT `/:mint` - Update metadata
- POST `/sync` - Sync on-chain with off-chain

## 📋 **Cách Sử Dụng**

### **Khởi động MongoDB**
```bash
# Local MongoDB
mongod --dbpath /path/to/data

# Or Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### **Cấu hình .env**
```env
MONGODB_URI=mongodb://localhost:27017/carbon-credit-exchange
```

### **Start Backend**
```bash
cd backend
npm run dev
```

## 🔧 **Implementation Checklist**

### **Priority 1 - Core Functionality**
- [ ] Implement createMetadata endpoint with IPFS upload
- [ ] Add owner verification middleware
- [ ] Implement metadata sync job
- [ ] Add input validation for all endpoints
- [ ] Create indexes for common queries

### **Priority 2 - User Features**
- [ ] Add user profile management
- [ ] Implement favorites/likes system
- [ ] Add search and filter functionality
- [ ] Create analytics dashboard queries
- [ ] Add pagination for list endpoints

### **Priority 3 - Advanced Features**
- [ ] Add KYC/verification workflow
- [ ] Implement price negotiation
- [ ] Add bulk operations
- [ ] Create admin panel endpoints
- [ ] Add real-time notifications

### **Priority 4 - Production Ready**
- [ ] Add authentication/authorization
- [ ] Implement rate limiting
- [ ] Add caching layer (Redis)
- [ ] Set up database backups
- [ ] Add monitoring and logging
- [ ] Write API documentation
- [ ] Add unit and integration tests

## 📝 **Notes**

- All models have `timestamps: true` (createdAt, updatedAt)
- Indexes are defined but need tuning based on actual queries
- Methods and statics provide common operations
- Validation rules need customization
- Authentication/authorization not implemented yet
- IPFS integration needs implementation
- Sync job needs scheduling (cron/worker)

## 🚀 **Next Steps**

1. Install MongoDB and start server
2. Test database connection
3. Implement createMetadata with IPFS
4. Add authentication middleware
5. Implement sync job for on-chain data
6. Add comprehensive validation
7. Create API documentation
8. Write tests
