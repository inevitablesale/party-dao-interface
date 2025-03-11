
import React from 'react';
import { ToxicCard } from "@/components/ui/toxic-card";
import { ToxicProgress } from "@/components/ui/toxic-progress";
import { CircleDollarSign, Users, Biohazard, Radiation, ShoppingBag, Target, Activity } from "lucide-react";

interface MarketplaceStats {
  tradingVolume: number;
  activeListings: number;
  registeredSurvivors: number;
  averageRadiationLevel: number;
  successfulTrades: number;
  bountyHunterRatio: number;
}

interface MarketplaceStatusPanelProps {
  stats: MarketplaceStats;
  isLoading?: boolean;
  className?: string;
}

export function MarketplaceStatusPanel({ stats, isLoading = false, className }: MarketplaceStatusPanelProps) {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format number with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };

  return (
    <div className={className}>
      <div className="grid md:grid-cols-3 gap-4">
        <ToxicCard className="relative bg-black/70 border-toxic-neon/30">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-toxic-neon/10">
              <CircleDollarSign className="w-6 h-6 text-toxic-neon" />
            </div>
            <div>
              <div className="text-toxic-neon/70 text-sm">Trading Volume</div>
              <div className="text-2xl font-semibold text-white">
                {isLoading ? (
                  <span className="animate-pulse">Calculating...</span>
                ) : (
                  formatCurrency(stats.tradingVolume)
                )}
              </div>
            </div>
          </div>
        </ToxicCard>

        <ToxicCard className="relative bg-black/70 border-toxic-neon/30">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-toxic-neon/10">
              <ShoppingBag className="w-6 h-6 text-toxic-neon" />
            </div>
            <div>
              <div className="text-toxic-neon/70 text-sm">Active Listings</div>
              <div className="text-2xl font-semibold text-white">
                {isLoading ? (
                  <span className="animate-pulse">Scanning...</span>
                ) : (
                  formatNumber(stats.activeListings)
                )}
              </div>
            </div>
          </div>
        </ToxicCard>

        <ToxicCard className="relative bg-black/70 border-toxic-neon/30">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-toxic-neon/10">
              <Users className="w-6 h-6 text-toxic-neon" />
            </div>
            <div>
              <div className="text-toxic-neon/70 text-sm">Registered Survivors</div>
              <div className="text-2xl font-semibold text-white">
                {isLoading ? (
                  <span className="animate-pulse">Counting...</span>
                ) : (
                  formatNumber(stats.registeredSurvivors)
                )}
              </div>
            </div>
          </div>
        </ToxicCard>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <ToxicCard className="relative bg-black/70 border-toxic-neon/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Radiation className="w-5 h-5 text-toxic-neon" />
            <h4 className="text-sm font-medium text-toxic-neon">Radiation Level</h4>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/70 text-xs">Network Average</span>
            <span className="text-toxic-neon font-mono">
              {isLoading ? "SCANNING..." : `${stats.averageRadiationLevel}%`}
            </span>
          </div>
          <ToxicProgress value={isLoading ? 30 : stats.averageRadiationLevel} className="h-2" />
          <div className="flex justify-between text-xs mt-1">
            <span className="text-toxic-neon/50">SAFE</span>
            <span className="text-toxic-neon/50">CAUTION</span>
            <span className={stats.averageRadiationLevel > 70 ? "text-apocalypse-red" : "text-toxic-neon/50"}>CRITICAL</span>
          </div>
        </ToxicCard>

        <ToxicCard className="relative bg-black/70 border-toxic-neon/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-toxic-neon" />
            <h4 className="text-sm font-medium text-toxic-neon">Marketplace Health</h4>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-toxic-neon/70" />
              <span className="text-white/70 text-xs">Success Rate</span>
            </div>
            <span className="text-toxic-neon font-mono">
              {isLoading ? "ANALYZING..." : `${stats.successfulTrades} trades`}
            </span>
          </div>
          <ToxicProgress value={isLoading ? 60 : (stats.successfulTrades / 100) * 100} className="h-2 mb-3" />
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Biohazard className="w-4 h-4 text-toxic-neon/70" />
              <span className="text-white/70 text-xs">Bounty Hunter Ratio</span>
            </div>
            <span className="text-toxic-neon font-mono">
              {isLoading ? "CALCULATING..." : `${stats.bountyHunterRatio}%`}
            </span>
          </div>
          <ToxicProgress value={isLoading ? 40 : stats.bountyHunterRatio} className="h-2" />
        </ToxicCard>
      </div>
    </div>
  );
}
