// types.ts - Định nghĩa các interface
export interface NFTProject {
  id: number;
  title: string;
  name: string;
  location: string;
  image: string;
  credits: number;
  price: number; // in ETH
  priceDisplay: string; // formatted price for display
  impact: string;
  change?: number; // % change in 24h
  category: 'Forestry' | 'Marine Conservation' | 'Renewable Energy';
  description?: string;
}

export type ProjectCategory = 'forest' | 'ocean' | 'renewable';

// mockdata.ts - Dữ liệu tập trung
export const allNFTProjects: NFTProject[] = [
  // Forest Conservation Projects
  {
    id: 1,
    title: "ForestForFuture",
    name: "ForestForFuture",
    location: "Afforestation, Brazil",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80",
    credits: 76,
    price: 0.025,
    priceDisplay: "0.025 ETH",
    impact: "2,400 tons CO₂/year",
    change: 2.5,
    category: "Forestry",
    description: "Comprehensive afforestation project in the Brazilian Amazon region"
  },
  {
    id: 2,
    title: "Amazon Rainforest Protection",
    name: "Amazon Protection",
    location: "Conservation, Peru",
    image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&q=80",
    credits: 120,
    price: 0.029,
    priceDisplay: "0.029 ETH",
    impact: "3,800 tons CO₂/year",
    change: -1.2,
    category: "Forestry",
    description: "Protecting critical rainforest ecosystems in Peru"
  },
  {
    id: 3,
    title: "MountainShield",
    name: "MountainShield",
    location: "Mountain Preservation, Nepal",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=80",
    credits: 95,
    price: 0.028,
    priceDisplay: "0.028 ETH",
    impact: "3,200 tons CO₂/year",
    change: 0.8,
    category: "Forestry",
    description: "Mountain forest preservation in the Himalayan region"
  },
  {
    id: 7,
    title: "Amazon Rainforest Protection",
    name: "Amazon Protection",
    location: "Rainforest, Peru",
    image: "https://images.unsplash.com/photo-1511497584788-876760111969?w=400&q=80",
    credits: 120,
    price: 0.027,
    priceDisplay: "0.027 ETH",
    impact: "3,800 tons CO₂/year",
    change: -0.5,
    category: "Forestry",
    description: "Large-scale rainforest conservation initiative"
  },
  {
    id: 11,
    title: "Alpine Forest Care",
    name: "Alpine Forest Care",
    location: "Mountain Forest, Switzerland",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
    credits: 88,
    price: 0.031,
    priceDisplay: "0.031 ETH",
    impact: "2,800 tons CO₂/year",
    change: -0.8,
    category: "Forestry",
    description: "Alpine forest conservation in the Swiss mountains"
  },

  // Ocean & Marine Conservation Projects
  {
    id: 4,
    title: "OceanGuardian",
    name: "OceanGuardian",
    location: "Marine Conservation, Australia",
    image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=400&q=80",
    credits: 150,
    price: 0.032,
    priceDisplay: "0.032 ETH",
    impact: "4,200 tons CO₂/year",
    change: -1.2,
    category: "Marine Conservation",
    description: "Protecting marine ecosystems along the Great Barrier Reef"
  },
  {
    id: 5,
    title: "Coral Reef Restoration",
    name: "Coral Reef Revival",
    location: "Southeast Asia",
    image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&q=80",
    credits: 89,
    price: 0.027,
    priceDisplay: "0.027 ETH",
    impact: "2,900 tons CO₂/year",
    change: 1.5,
    category: "Marine Conservation",
    description: "Coral reef restoration across Southeast Asian waters"
  },
  {
    id: 8,
    title: "Coral Reef Revival",
    name: "Coral Reef Revival",
    location: "Reef Conservation, Indonesia",
    image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&q=80",
    credits: 89,
    price: 0.024,
    priceDisplay: "0.024 ETH",
    impact: "2,900 tons CO₂/year",
    change: 1.5,
    category: "Marine Conservation",
    description: "Indonesian coral reef restoration project"
  },
  {
    id: 10,
    title: "Mangrove Restoration",
    name: "Mangrove Restoration",
    location: "Coastal Protection, Vietnam",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80",
    credits: 110,
    price: 0.023,
    priceDisplay: "0.023 ETH",
    impact: "3,500 tons CO₂/year",
    change: 2.7,
    category: "Marine Conservation",
    description: "Restoring mangrove forests for coastal protection"
  },

  // Renewable Energy Projects
  {
    id: 6,
    title: "Solar Power Initiative",
    name: "Solar Power Initiative",
    location: "Kenya",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80",
    credits: 200,
    price: 0.035,
    priceDisplay: "0.035 ETH",
    impact: "5,600 tons CO₂/year",
    change: 3.1,
    category: "Renewable Energy",
    description: "Large-scale solar power installation in Kenya"
  },
  {
    id: 9,
    title: "Wind Energy Farm",
    name: "WindForce Scotland",
    location: "Scotland",
    image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=400&q=80",
    credits: 165,
    price: 0.033,
    priceDisplay: "0.033 ETH",
    impact: "5,100 tons CO₂/year",
    change: 2.2,
    category: "Renewable Energy",
    description: "Wind energy farm in the Scottish Highlands"
  },
  {
    id: 12,
    title: "GreenEnergy",
    name: "GreenEnergy",
    location: "Renewable Energy, India",
    image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&q=80",
    credits: 200,
    price: 0.022,
    priceDisplay: "0.022 ETH",
    impact: "6,000 tons CO₂/year",
    change: 3.1,
    category: "Renewable Energy",
    description: "Comprehensive renewable energy project in India"
  },
  {
    id: 13,
    title: "Solar Power India",
    name: "SolarPower India",
    location: "Solar Farm, Rajasthan",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80",
    credits: 180,
    price: 0.029,
    priceDisplay: "0.029 ETH",
    impact: "5,400 tons CO₂/year",
    change: 1.8,
    category: "Renewable Energy",
    description: "Solar farm in the Rajasthan desert"
  },
  {
    id: 14,
    title: "BioGas Kenya",
    name: "BioGas Kenya",
    location: "Biogas Project, Nairobi",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400&q=80",
    credits: 142,
    price: 0.026,
    priceDisplay: "0.026 ETH",
    impact: "4,300 tons CO₂/year",
    change: 0.9,
    category: "Renewable Energy",
    description: "Biogas generation project in Nairobi"
  },
  {
    id: 15,
    title: "Hydro Power Thailand",
    name: "Hydro Power Thailand",
    location: "Hydroelectric, Chiang Mai",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80",
    credits: 175,
    price: 0.030,
    priceDisplay: "0.030 ETH",
    impact: "5,300 tons CO₂/year",
    change: 1.2,
    category: "Renewable Energy",
    description: "Hydroelectric power generation in northern Thailand"
  }
];

// Helper functions để filter data
export const getProjectsByCategory = (category: ProjectCategory): NFTProject[] => {
  const categoryMap: Record<ProjectCategory, NFTProject['category']> = {
    forest: 'Forestry',
    ocean: 'Marine Conservation',
    renewable: 'Renewable Energy'
  };

  return allNFTProjects.filter(project => project.category === categoryMap[category]);
};

export const getProjectById = (id: number): NFTProject | undefined => {
  return allNFTProjects.find(project => project.id === id);
};

export const searchProjects = (query: string): NFTProject[] => {
  const lowerQuery = query.toLowerCase();
  return allNFTProjects.filter(project =>
    project.name.toLowerCase().includes(lowerQuery) ||
    project.location.toLowerCase().includes(lowerQuery) ||
    project.category.toLowerCase().includes(lowerQuery)
  );
};

export const filterProjects = (
  category?: NFTProject['category'],
  minPrice?: number,
  maxPrice?: number
): NFTProject[] => {
  return allNFTProjects.filter(project => {
    if (category && project.category !== category) return false;
    if (minPrice !== undefined && project.price < minPrice) return false;
    if (maxPrice !== undefined && project.price > maxPrice) return false;
    return true;
  });
};

// Format data cho HomePage
export const getProjectCategoriesForHome = () => {
  return {
    forest: getProjectsByCategory('forest').slice(0, 2).map(p => ({
      id: p.id,
      title: p.title,
      location: p.location,
      image: p.image,
      credits: p.credits,
      price: p.priceDisplay,
      impact: p.impact
    })),
    ocean: getProjectsByCategory('ocean').slice(0, 2).map(p => ({
      id: p.id,
      title: p.title,
      location: p.location,
      image: p.image,
      credits: p.credits,
      price: p.priceDisplay,
      impact: p.impact
    })),
    renewable: getProjectsByCategory('renewable').slice(0, 2).map(p => ({
      id: p.id,
      title: p.title,
      location: p.location,
      image: p.image,
      credits: p.credits,
      price: p.priceDisplay,
      impact: p.impact
    }))
  };
};

// Format data cho Trading page
export const getTradingAssets = () => {
  return allNFTProjects.map(project => ({
    id: project.id,
    name: project.name,
    location: project.location,
    credits: project.credits,
    price: project.price,
    change: project.change || 0,
    image: project.image,
    category: project.category
  }));
};

// Market statistics
export const getMarketStats = () => {
  const totalVolume = allNFTProjects.reduce((sum, p) => sum + (p.price * p.credits), 0);
  const avgPrice = allNFTProjects.reduce((sum, p) => sum + p.price, 0) / allNFTProjects.length;
  const avgChange = allNFTProjects
    .filter(p => p.change !== undefined)
    .reduce((sum, p) => sum + (p.change || 0), 0) / allNFTProjects.length;

  return {
    totalVolume: totalVolume.toFixed(1),
    change24h: parseFloat(avgChange.toFixed(1)),
    activeTrades: allNFTProjects.length,
    avgPrice: avgPrice.toFixed(3)
  };
};

// For NFT Details page - convert NFTProject to MintedNFT format
export interface MintedNFT {
  id: string;
  tokenId: string;
  name: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  price?: number;
  credits?: number;
  description?: string;
  location?: string;
  impact?: string;
  category?: string;
}

export const getNFTById = (id: string): MintedNFT | undefined => {
  const project = allNFTProjects.find(p => p.id.toString() === id);

  if (!project) return undefined;

  return {
    id: project.id.toString(),
    tokenId: `0x${project.id.toString().padStart(64, '0')}`,
    name: project.name,
    image: project.image,
    price: project.price,
    credits: project.credits,
    description: project.description,
    location: project.location,
    impact: project.impact,
    category: project.category,
    attributes: [
      {
        trait_type: 'Category',
        value: project.category
      },
      {
        trait_type: 'Location',
        value: project.location
      },
      {
        trait_type: 'Credits',
        value: project.credits
      },
      {
        trait_type: 'Annual Impact',
        value: project.impact
      },
      {
        trait_type: 'Price',
        value: `${project.price} ETH`
      },
      {
        trait_type: '24h Change',
        value: project.change ? `${project.change > 0 ? '+' : ''}${project.change}%` : 'N/A'
      }
    ]
  };
};

export const defaultNFT: MintedNFT = {
  id: '0',
  tokenId: '0x0000000000000000000000000000000000000000000000000000000000000000',
  name: 'Carbon Credit NFT',
  image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=400&q=80',
  attributes: [
    { trait_type: 'Category', value: 'Unknown' },
    { trait_type: 'Location', value: 'Unknown' },
    { trait_type: 'Credits', value: 0 },
    { trait_type: 'Annual Impact', value: '0 tons CO₂/year' },
    { trait_type: 'Price', value: '0 ETH' },
    { trait_type: '24h Change', value: 'N/A' }
  ],
  price: 0,
  credits: 0,
  description: 'Carbon credit NFT for verified environmental projects',
  category: 'Unknown'
};