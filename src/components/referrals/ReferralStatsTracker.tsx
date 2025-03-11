
import React, { useState, useEffect } from 'react';
import { User, Users, ArrowUpRight, Clock, Award, Check, AlertTriangle } from 'lucide-react';
import { ToxicCard } from '@/components/ui/toxic-card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { getBounty, Bounty } from '@/services/bountyService';
import { useToast } from '@/hooks/use-toast';
import { useCustomWallet } from '@/hooks/useCustomWallet';

interface ReferralStatsTrackerProps {
  bountyId?: string;
  className?: string;
}

interface ReferralStats {
  pendingReferrals: number;
  completedReferrals: number;
  conversionRate: number;
  totalEarnings: number;
  topReferrals: {
    address: string;
    count: number;
  }[];
}

const ReferralStatsTracker: React.FC<ReferralStatsTrackerProps> = ({
  bountyId,
  className
}) => {
  const { toast } = useToast();
  const { address } = useCustomWallet();
  const [stats, setStats] = useState<ReferralStats>({
    pendingReferrals: 0,
    completedReferrals: 0,
    conversionRate: 0,
    totalEarnings: 0,
    topReferrals: []
  });
  const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBountyStats = async () => {
      setIsLoading(true);
      try {
        if (bountyId) {
          const bounty = await getBounty(bountyId);
          setSelectedBounty(bounty);
          
          // For now, we're using mock data
          // In a real implementation, this would fetch actual referral stats
          setStats({
            pendingReferrals: 3,
            completedReferrals: bounty?.successCount || 0,
            conversionRate: 67, // percentage
            totalEarnings: (bounty?.successCount || 0) * (bounty?.rewardAmount || 0),
            topReferrals: [
              { address: '0x1234...5678', count: 5 },
              { address: '0x8765...4321', count: 3 }
            ]
          });
        } else {
          // Load general referral stats if no bounty is selected
          setStats({
            pendingReferrals: 5,
            completedReferrals: 12,
            conversionRate: 70, // percentage
            totalEarnings: 240, // MATIC
            topReferrals: [
              { address: '0x1234...5678', count: 7 },
              { address: '0x8765...4321', count: 5 }
            ]
          });
        }
      } catch (error) {
        console.error("Error loading referral stats:", error);
        toast({
          title: "Failed to load stats",
          description: "Could not retrieve your referral statistics",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (address) {
      loadBountyStats();
    }
  }, [bountyId, address, toast]);

  if (isLoading) {
    return (
      <ToxicCard className={`p-4 ${className}`}>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-toxic-neon"></div>
        </div>
      </ToxicCard>
    );
  }

  if (!address) {
    return (
      <ToxicCard className={`p-4 ${className}`}>
        <div className="text-center py-8">
          <Users className="h-10 w-10 text-toxic-neon/50 mx-auto mb-4" />
          <h3 className="text-toxic-neon text-lg mb-2">No Wallet Connected</h3>
          <p className="text-white/70 text-sm">
            Connect your wallet to view your referral statistics
          </p>
        </div>
      </ToxicCard>
    );
  }

  const potentialEarnings = selectedBounty 
    ? (stats.pendingReferrals * selectedBounty.rewardAmount)
    : (stats.pendingReferrals * 20); // Default 20 MATIC per referral

  return (
    <ToxicCard className={`p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-toxic-neon font-mono flex items-center gap-2">
          <Users className="h-5 w-5" />
          Your Referral Stats
        </h3>
        {selectedBounty && (
          <div className="px-2 py-1 text-xs bg-toxic-neon/10 rounded text-toxic-neon">
            {selectedBounty.name}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-black/30 p-3 rounded border border-toxic-neon/20">
          <div className="flex justify-between items-center">
            <span className="text-white/70 text-sm">Completed</span>
            <span className="text-toxic-neon font-mono">{stats.completedReferrals}</span>
          </div>
          <div className="flex items-center mt-1">
            <Check className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-xs text-green-400">Verified</span>
          </div>
        </div>
        
        <div className="bg-black/30 p-3 rounded border border-toxic-neon/20">
          <div className="flex justify-between items-center">
            <span className="text-white/70 text-sm">Pending</span>
            <span className="text-amber-400 font-mono">{stats.pendingReferrals}</span>
          </div>
          <div className="flex items-center mt-1">
            <Clock className="h-4 w-4 text-amber-500 mr-1" />
            <span className="text-xs text-amber-400">Processing</span>
          </div>
        </div>
      </div>
      
      <div className="bg-black/30 p-3 rounded border border-toxic-neon/20 mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-white/70 text-sm">Conversion Rate</span>
          <span className="text-toxic-neon font-mono">{stats.conversionRate}%</span>
        </div>
        <Progress value={stats.conversionRate} className="h-1.5" />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-black/30 p-3 rounded border border-toxic-neon/20">
          <div className="flex justify-between items-center">
            <span className="text-white/70 text-sm">Earned</span>
            <span className="text-toxic-neon font-mono">{stats.totalEarnings} MATIC</span>
          </div>
          <div className="flex items-center mt-1">
            <Award className="h-4 w-4 text-toxic-neon mr-1" />
            <span className="text-xs text-toxic-neon/70">Total Rewards</span>
          </div>
        </div>
        
        <div className="bg-black/30 p-3 rounded border border-amber-500/20">
          <div className="flex justify-between items-center">
            <span className="text-white/70 text-sm">Potential</span>
            <span className="text-amber-400 font-mono">{potentialEarnings} MATIC</span>
          </div>
          <div className="flex items-center mt-1">
            <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
            <span className="text-xs text-amber-400">Pending Verification</span>
          </div>
        </div>
      </div>
      
      {stats.topReferrals.length > 0 && (
        <div className="bg-black/30 p-3 rounded border border-toxic-neon/20">
          <h4 className="text-white/90 text-sm mb-2">Top Referrers</h4>
          <div className="space-y-2">
            {stats.topReferrals.map((ref, index) => (
              <div key={index} className="flex justify-between items-center text-xs">
                <span className="text-white/70 font-mono">{ref.address}</span>
                <span className="text-toxic-neon">{ref.count} referrals</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToxicCard>
  );
};

export default ReferralStatsTracker;
