
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar } from '@/components/ui/avatar';
import { HunterTierBadge } from './HunterTierBadge';
import { BountyMetadata } from '@/types/content';
import { shortenAddress } from '@/lib/utils';

interface HunterLeaderboardProps {
  bountyMetadata: BountyMetadata;
  limit?: number;
}

export function HunterLeaderboard({ bountyMetadata, limit = 10 }: HunterLeaderboardProps) {
  // Get hunter performance data from metadata
  const hunterPerformance = bountyMetadata.hunterPerformance || {};
  
  // Sort hunters by successful referrals and then success rate
  const sortedHunters = Object.entries(hunterPerformance)
    .map(([address, data]) => ({
      address,
      ...data
    }))
    .sort((a, b) => {
      // First sort by successful referrals (descending)
      if (b.successfulReferrals !== a.successfulReferrals) {
        return b.successfulReferrals - a.successfulReferrals;
      }
      // Then by success rate (descending)
      return b.successRate - a.successRate;
    })
    .slice(0, limit);
  
  if (sortedHunters.length === 0) {
    return (
      <Card className="bg-gray-900/60 border border-toxic-neon/20">
        <CardHeader>
          <CardTitle className="text-toxic-neon">Top Bounty Hunters</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-center py-4">No hunter data available yet</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-gray-900/60 border border-toxic-neon/20">
      <CardHeader>
        <CardTitle className="text-toxic-neon">Top Bounty Hunters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedHunters.map((hunter, index) => (
            <div key={hunter.address} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 text-center font-mono text-gray-400">
                  {index + 1}.
                </div>
                <Avatar className="h-8 w-8 border border-toxic-neon/30 bg-black">
                  <div className="font-mono text-xs">
                    {hunter.address.substring(2, 4)}
                  </div>
                </Avatar>
                <div>
                  <div className="text-sm font-medium text-white">
                    {shortenAddress(hunter.address)}
                  </div>
                  <HunterTierBadge tier={hunter.currentTier} className="mt-1" />
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-white">
                  {hunter.successfulReferrals} <span className="text-xs text-gray-400">refs</span>
                </div>
                <div className="text-xs text-gray-400">
                  {hunter.successRate.toFixed(0)}% success
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
