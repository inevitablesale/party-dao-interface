
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Biohazard, Radiation, Shield, Target, User } from 'lucide-react';
import { ToxicBadge } from '@/components/ui/toxic-badge';
import { ToxicCard, ToxicCardContent, ToxicCardFooter } from '@/components/ui/toxic-card';
import { ModelPreview } from '@/components/marketplace/ModelPreview';

export type MarketplaceListingType = 'bounty-hunter' | 'survivor' | 'equipment' | 'settlement' | 'sentinel';

export interface MarketplaceListing {
  id: number;
  type: MarketplaceListingType;
  name: string;
  tokenId: number;
  price: string;
  seller: string;
  radiation: {
    level: string;
    value: number;
  };
  status: 'active' | 'sold' | 'expired';
  attributes?: Array<{
    trait: string;
    value: string | number;
  }>;
  description?: string;
  modelUrl?: string;
  role?: string;
  rank?: string;
}

interface MarketplaceListingGridProps {
  listings: MarketplaceListing[];
  isLoading?: boolean;
  title?: string;
  className?: string;
  onListingClick?: (listing: MarketplaceListing) => void;
  currentRadiationLevel?: number;
}

const getTypeIcon = (type: MarketplaceListingType) => {
  switch(type) {
    case 'survivor':
      return <Shield className="h-5 w-5 text-toxic-neon" />;
    case 'bounty-hunter':
      return <Target className="h-5 w-5 text-apocalypse-red" />;
    case 'equipment':
      return <Radiation className="h-5 w-5 text-toxic-neon" />;
    case 'settlement':
      return <User className="h-5 w-5 text-toxic-muted" />;
    case 'sentinel':
      return <Shield className="h-5 w-5 text-purple-500" />;
    default:
      return <Biohazard className="h-5 w-5 text-toxic-neon" />;
  }
};

const getRadiationColor = (value: number) => {
  if (value >= 80) return "text-apocalypse-red";
  if (value >= 50) return "text-yellow-400";
  return "text-toxic-neon";
};

export const MarketplaceListingGrid: React.FC<MarketplaceListingGridProps> = ({ 
  listings, 
  isLoading = false,
  title,
  className = "",
  onListingClick,
  currentRadiationLevel
}) => {
  const navigate = useNavigate();
  
  const handleItemClick = (listing: MarketplaceListing) => {
    if (onListingClick) {
      onListingClick(listing);
    } else {
      navigate(`/marketplace/${listing.id}`);
    }
  };
  
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {[...Array(8)].map((_, index) => (
          <ToxicCard key={index} className="bg-black/40 border-toxic-neon/20 animate-pulse">
            <ToxicCardContent className="p-0">
              <div className="h-48 bg-black/40"></div>
              <div className="p-4">
                <div className="h-4 w-3/4 bg-toxic-neon/20 rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-toxic-neon/10 rounded"></div>
              </div>
            </ToxicCardContent>
          </ToxicCard>
        ))}
      </div>
    );
  }
  
  return (
    <div className={className}>
      {title && <h2 className="text-2xl font-mono text-toxic-neon mb-4">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map(listing => (
          <ToxicCard 
            key={listing.id} 
            className="bg-black/70 border-toxic-neon/30 hover:border-toxic-neon/60 transition-all cursor-pointer"
            onClick={() => handleItemClick(listing)}
          >
            <ToxicCardContent className="p-0">
              <div className="h-48 bg-gradient-to-b from-toxic-neon/20 to-black/60 rounded-t-lg relative overflow-hidden">
                {listing.modelUrl ? (
                  <ModelPreview 
                    modelUrl={listing.modelUrl} 
                    height="100%"
                    width="100%"
                    autoRotate={false}
                    radiationLevel={listing.radiation.value}
                    useRadiationCloud={true}
                    radiationCloudUrl="bafybeiayvmbutisgus45sujbr65sqnpeqcd3vtu6tjxwbmwadf35frszp4"
                    revealValue={20} // Show just a hint of the character
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Biohazard className="h-12 w-12 text-toxic-neon/30" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60">
                  <div className="flex items-center justify-between">
                    <ToxicBadge variant="outline" className="flex items-center gap-1 text-xs">
                      {getTypeIcon(listing.type)}
                      <span>#{listing.tokenId}</span>
                    </ToxicBadge>
                    <span className="text-toxic-neon text-xs font-mono">{listing.price}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-toxic-neon font-mono text-lg truncate mb-2">{listing.name}</h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">{listing.type.replace('-', ' ')}</span>
                  <span className={`${getRadiationColor(listing.radiation.value)}`}>
                    RAD {listing.radiation.value}%
                  </span>
                </div>
                {listing.role && (
                  <div className="text-xs text-white/70 mt-1">
                    Role: <span className="text-toxic-neon">{listing.role}</span>
                    {listing.rank && <span> • Rank: <span className="text-toxic-neon">{listing.rank}</span></span>}
                  </div>
                )}
                {listing.status !== 'active' && (
                  <div className="mt-2 text-xs uppercase font-mono text-apocalypse-red">
                    {listing.status}
                  </div>
                )}
              </div>
            </ToxicCardContent>
          </ToxicCard>
        ))}
      </div>
    </div>
  );
};
