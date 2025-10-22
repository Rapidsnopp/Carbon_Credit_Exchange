import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import routes
import carbonCreditRoutes from './routes/carbonCreditRoutes';
import marketplaceRoutes from './routes/marketplaceRoutes';
import metadataRoutes from './routes/metadataRoutes';
import uploadRoutes from './routes/uploadRoutes';

// Import services
import { solanaConfig } from './config/solana.config';
import { connectDB, createIndexes, checkDBHealth } from './config/database';
import SolanaService from './services/solanaService';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true,
}));
app.use(morgan('dev')); // Logging
app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
  try {
    const isProgramDeployed = await SolanaService.verifyProgramDeployment();
    const exchangeInfo = await SolanaService.getExchangeInfo();
    const isDBHealthy = await checkDBHealth();
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      solana: {
        cluster: process.env.SOLANA_CLUSTER || 'devnet',
        programId: solanaConfig.programId.toBase58(),
        isProgramDeployed,
        exchangeInitialized: !!exchangeInfo,
      },
      database: {
        connected: isDBHealthy,
        type: 'MongoDB',
      },
    });
  } catch (error: any) {
    res.status(503).json({
      status: 'error',
      message: 'Service unhealthy',
      error: error.message,
    });
  }
});

// API Routes
app.use('/api/carbon-credits', carbonCreditRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/metadata', metadataRoutes);
app.use('/api/upload', uploadRoutes);

// Program info endpoint
app.get('/api/program-info', async (req: Request, res: Response) => {
  try {
    const exchangeInfo = await SolanaService.getExchangeInfo();
    
    res.json({
      success: true,
      data: {
        programId: solanaConfig.programId.toBase58(),
        cluster: process.env.SOLANA_CLUSTER || 'devnet',
        rpcUrl: process.env.SOLANA_RPC_URL,
        exchange: exchangeInfo,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch program info',
      message: error.message,
    });
  }
});

// Program events endpoint
app.get('/api/events', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const events = await SolanaService.getProgramEvents(limit);
    
    res.json({
      success: true,
      data: events,
      count: events.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events',
      message: error.message,
    });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
const server = app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Solana Cluster: ${process.env.SOLANA_CLUSTER || 'devnet'}`);
  console.log(`📝 Program ID: ${solanaConfig.programId.toBase58()}`);
  
  // Connect to MongoDB
  try {
    await connectDB();
    await createIndexes();
  } catch (error: any) {
    console.error(`❌ MongoDB initialization failed: ${error.message}`);
  }
  
  // Verify program deployment
  try {
    const isProgramDeployed = await SolanaService.verifyProgramDeployment();
    console.log(`✅ Program deployed: ${isProgramDeployed}`);
    
    if (isProgramDeployed) {
      const exchangeInfo = await SolanaService.getExchangeInfo();
      if (exchangeInfo) {
        console.log(`✅ Exchange initialized at: ${exchangeInfo.address}`);
        console.log(`   Total credits minted: ${exchangeInfo.totalCredits}`);
      } else {
        console.log(`⚠️  Exchange not initialized yet`);
      }
    }
  } catch (error: any) {
    console.error(`❌ Error verifying program: ${error.message}`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;
