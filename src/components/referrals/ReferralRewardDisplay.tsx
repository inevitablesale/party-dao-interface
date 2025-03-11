
import React from 'react';
import { Coins, ChevronRight, AlertTriangle, CreditCard, Wallet, RefreshCw } from 'lucide-react';
import { ToxicButton } from '@/components/ui/toxic-button';
import { ToxicBadge } from '@/components/ui/toxic-badge';
import { useToast } from '@/hooks/use-toast';

interface ReferralRewardDisplayProps {
  completedReferrals: number;
  pendingPayouts: number;
  totalEarnings: number;
}

const ReferralRewardDisplay: React.FC<ReferralRewardDisplayProps> = ({
  completedReferrals,
  pendingPayouts,
  totalEarnings
}) => {
  const { toast } = useToast();
  
  const handleClaimRewards = () => {
    if (pendingPayouts <= 0) return;
    
    toast({
      title: "Processing Claim",
      description: "Your reward claim is being processed. This may take a few minutes.",
    });
    
    // This would be replaced with actual claim functionality in production
    setTimeout(() => {
      toast({
        title: "Rewards Claimed!",
        description: `$${pendingPayouts} has been sent to your wallet.`,
      });
    }, 2000);
  };

  return (
    <div className="bg-black/30 p-3 rounded-lg border border-amber-500/20">
      <h3 className="text-amber-400 font-mono flex items-center mb-3">
        <Coins className="h-4 w-4 mr-2" />
        Earnings & Rewards
      </h3>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center py-1">
          <span className="text-white/70">Total Earned</span>
          <span className="text-toxic-neon font-mono">${totalEarnings}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-white/70">Pending Rewards</span>
          <span className="text-amber-400 font-mono">${pendingPayouts}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-white/70">Successful Referrals</span>
          <span className="text-toxic-neon font-mono">{completedReferrals}</span>
        </div>
        
        <div className="border-t border-toxic-neon/20 pt-3 mt-3">
          {pendingPayouts > 0 ? (
            <ToxicButton 
              className="w-full justify-between mt-2"
              onClick={handleClaimRewards}
            >
              <span className="flex items-center">
                <Wallet className="h-4 w-4 mr-2" />
                Claim ${pendingPayouts}
              </span>
              <ChevronRight className="h-4 w-4" />
            </ToxicButton>
          ) : completedReferrals > 0 ? (
            <div className="bg-green-900/20 p-2 rounded border border-green-700/30 text-white/80 text-xs flex items-start gap-2">
              <RefreshCw className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <p className="font-semibold text-green-400 mb-1">All rewards claimed!</p>
                <p>Your earnings have been successfully processed and sent to your wallet.</p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900/20 p-2 rounded border border-gray-700/30 text-white/80 text-xs flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-400 mb-1">No earnings yet</p>
                <p>Share your referral link to start earning rewards when people purchase NFTs.</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="text-xs text-white/50 mt-3">
          <div className="flex items-center gap-1 mb-1">
            <CreditCard className="h-3 w-3" />
            <span>Payment Methods</span>
          </div>
          <div className="flex gap-2">
            <ToxicBadge variant="outline" className="bg-black/30 px-2 py-0.5">Polygon</ToxicBadge>
            <ToxicBadge variant="outline" className="bg-black/30 px-2 py-0.5">USDC</ToxicBadge>
            <ToxicBadge variant="outline" className="bg-black/30 px-2 py-0.5">ETH</ToxicBadge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralRewardDisplay;
