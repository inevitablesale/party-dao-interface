
export interface MarketplaceMetadata {
  name: string;
  description: string;
  image: string;
  imageUrl?: string; // Add optional imageUrl for HTTP version of IPFS image
  modelUrl?: string; // 3D model URL (GLB file)
  contentType: string;
  category: string;
  experiences: Array<{
    title: string;
    company: string;
    duration: string;
    location: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
  }>;
  skills: Array<string>;
}

export interface Publication {
  id: string;
  title: string;
  content: string;
  contentType: string;
  category: string;
  publisher: string;
  publishedAt: number;
  metadata?: MarketplaceMetadata;
}

export type MarketplaceListingType = 'survivor' | 'bounty-hunter' | 'equipment' | 'settlement';

export interface MarketplaceListing {
  id: number;
  type: MarketplaceListingType;
  name: string;
  description?: string;
  tokenId: number;
  price: string;
  seller: string;
  radiation: {
    level: string;
    value: number;
  };
  attributes: {
    trait: string;
    value: string;
  }[];
  status: 'active' | 'pending' | 'sold';
  imageUrl?: string;
  modelUrl?: string; // New field for 3D model URL
}
