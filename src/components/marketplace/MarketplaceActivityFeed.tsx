
import React from 'react';
import { ToxicCard } from "@/components/ui/toxic-card";
import { ToxicBadge } from "@/components/ui/toxic-badge";
import { RefreshCw, Radiation, Target, ShoppingBag, CircleDollarSign, Shield } from "lucide-react";
import { ToxicButton } from "@/components/ui/toxic-button";

export type ActivityType = 'listing' | 'purchase' | 'offer' | 'trade' | 'mint';

export interface MarketplaceActivity {
  id: string;
  type: ActivityType;
  title: string;
  timestamp: string;
  amount?: string;
  itemId?: string;
  address?: string;
}

interface MarketplaceActivityFeedProps {
  activities: MarketplaceActivity[];
  isLoading?: boolean;
  className?: string;
  onRefresh?: () => void;
}

export function MarketplaceActivityFeed({ 
  activities, 
  isLoading = false, 
  className,
  onRefresh 
}: MarketplaceActivityFeedProps) {
  
  const getActivityIcon = (type: ActivityType) => {
    switch(type) {
      case 'listing':
        return <ShoppingBag className="h-4 w-4 text-toxic-neon" />;
      case 'purchase':
        return <CircleDollarSign className="h-4 w-4 text-toxic-neon" />;
      case 'offer':
        return <Target className="h-4 w-4 text-apocalypse-red" />;
      case 'trade':
        return <Shield className="h-4 w-4 text-toxic-neon" />;
      case 'mint':
        return <Radiation className="h-4 w-4 text-toxic-neon" />;
      default:
        return <Radiation className="h-4 w-4 text-toxic-neon" />;
    }
  };
  
  const getActivityBadge = (type: ActivityType) => {
    switch(type) {
      case 'listing':
        return (
          <ToxicBadge variant="secondary" className="text-toxic-neon">NEW LISTING</ToxicBadge>
        );
      case 'purchase':
        return (
          <ToxicBadge variant="marketplace" className="text-toxic-neon">PURCHASE</ToxicBadge>
        );
      case 'offer':
        return (
          <ToxicBadge variant="danger" className="text-red-400">OFFER</ToxicBadge>
        );
      case 'trade':
        return (
          <ToxicBadge variant="default" className="text-toxic-neon">TRADE</ToxicBadge>
        );
      case 'mint':
        return (
          <ToxicBadge variant="rating" className="text-toxic-neon">MINT</ToxicBadge>
        );
      default:
        return (
          <ToxicBadge variant="secondary" className="text-toxic-muted">ACTIVITY</ToxicBadge>
        );
    }
  };

  return (
    <ToxicCard className={`relative bg-black/70 border-toxic-neon/30 p-4 ${className}`}>
      <div className="scanline"></div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-mono text-toxic-neon flex items-center">
          <Radiation className="h-5 w-5 mr-2" /> Wasteland Activity
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-toxic-neon/70">
            <div className="w-2 h-2 bg-toxic-neon rounded-full animate-pulse" />
            LIVE FEED
          </div>
          <ToxicButton 
            variant="ghost" 
            size="sm" 
            onClick={onRefresh}
            className="text-toxic-neon hover:bg-toxic-dark/20"
          >
            <RefreshCw className="h-4 w-4" />
          </ToxicButton>
        </div>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-toxic-neon/5 rounded"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-center justify-between py-3 px-2 border-b border-toxic-neon/10 last:border-0 hover:bg-toxic-neon/5 rounded transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-toxic-dark border border-toxic-neon/30">
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <div className="text-white/90 text-sm">{activity.title}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {getActivityBadge(activity.type)}
                    <span className="text-xs text-white/50">{activity.timestamp}</span>
                  </div>
                </div>
              </div>
              
              {activity.amount && (
                <div className="font-mono text-toxic-neon">{activity.amount}</div>
              )}
              
              {activity.itemId && !activity.amount && (
                <div className="font-mono text-toxic-neon/70">#{activity.itemId}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </ToxicCard>
  );
}
