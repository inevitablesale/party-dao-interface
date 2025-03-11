
import { Badge } from "@/components/ui/badge";
import { ShieldX, Award, Star, Coins, Shield } from "lucide-react";
import { ToxicBadge } from "@/components/ui/toxic-badge";

interface NFTDisplayProps {
  balance: number;
  className?: string;
  legacy?: boolean;
  stakingStatus?: 'active' | 'inactive' | 'locked';
  stakingRewards?: string;
}

export const NFTDisplay = ({ 
  balance, 
  className = "", 
  legacy = false,
  stakingStatus,
  stakingRewards 
}: NFTDisplayProps) => {
  if (!balance) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between bg-black/40 p-3 rounded border border-apocalypse-red/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-apocalypse-red/20 flex items-center justify-center">
            <ShieldX className="w-5 h-5 text-apocalypse-red" />
          </div>
          <span className="text-white">Mutant Bounty Tokens</span>
        </div>
        <ToxicBadge variant="danger" className="animate-toxic-pulse">
          {balance}x Captured
        </ToxicBadge>
      </div>
      
      {legacy && (
        <div className="flex items-center justify-between bg-black/40 p-3 rounded border border-purple-500/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-white">Legacy Founder Status</span>
          </div>
          <ToxicBadge variant="marketplace" className="bg-purple-900/60 text-purple-300 border-purple-500/70">
            ACTIVE
          </ToxicBadge>
        </div>
      )}
      
      {stakingStatus === 'active' && stakingRewards && (
        <div className="flex items-center justify-between bg-black/40 p-3 rounded border border-amber-500/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Coins className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-white">Staking Rewards</span>
          </div>
          <div className="flex flex-col items-end">
            <ToxicBadge variant="marketplace" className="bg-amber-900/60 text-amber-300 border-amber-500/70 mb-1">
              ACTIVE
            </ToxicBadge>
            <span className="text-xs text-toxic-neon">{stakingRewards} RD/day</span>
          </div>
        </div>
      )}
      
      {stakingStatus === 'locked' && (
        <div className="flex items-center justify-between bg-black/40 p-3 rounded border border-blue-500/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-white">Staking Status</span>
          </div>
          <ToxicBadge variant="marketplace" className="bg-blue-900/60 text-blue-300 border-blue-500/70">
            LOCKED 30d
          </ToxicBadge>
        </div>
      )}
    </div>
  );
};
