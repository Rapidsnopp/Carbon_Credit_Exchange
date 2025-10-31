export type CarbonCreditType = {
  mint: string;
  owner: string;

  projectName: string;
  location: {
    country: string;
    region?: string;
    coordinates?: {
      latitude?: number;
      longitude?: number;
    };
  };

  vintageYear: number;
  carbonAmount: number;
  verificationStandard: 'VCS' | 'Gold Standard' | 'CDM' | 'CAR' | 'Other';

  metadata?: {
    name?: string;
    symbol?: string;
    uri?: string;
    description?: string;
    image?: string;
    attributes?: { trait_type: string; value: string }[];
  };

  projectType?:
  | 'Renewable Energy'
  | 'Forestry'
  | 'Agriculture'
  | 'Waste Management'
  | 'Industrial'
  | 'Other';
  projectDescription?: string;
  projectDocuments?: {
    name?: string;
    url?: string;
    type?: 'Certificate' | 'Verification Report' | 'Project Document' | 'Other';
    uploadedAt?: Date;
  }[];

  verificationDetails?: {
    verifier?: string;
    verificationDate?: Date;
    certificateNumber?: string;
    expiryDate?: Date;
    status?: 'Pending' | 'Verified' | 'Expired' | 'Rejected';
  };

  isListed?: boolean;
  listingPrice?: number;

  isRetired?: boolean;
  retirementDetails?: {
    retiredBy?: string;
    retiredAt?: Date;
    beneficiary?: string;
    reason?: string;
  };

  views?: number;
  favorites?: number;
  status?: 'Active' | 'Listed' | 'Retired' | 'Archived';
};
