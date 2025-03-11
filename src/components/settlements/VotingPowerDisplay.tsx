
import { Shield, User, Crosshair } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tooltip } from "@/components/ui/tooltip";
import { useNFTRoles } from "@/hooks/useNFTRoles";
import { TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

interface VotingPowerDisplayProps {
  address?: string;
  showDetails?: boolean;
}

export const VotingPowerDisplay = ({ address, showDetails = true }: VotingPowerDisplayProps) => {
  const { primaryRole, isSentinel, isSurvivor, isBountyHunter, isLoading } = useNFTRoles();
  
  // Calculate voting power based on role
  const getVotingPower = () => {
    if (isSentinel) return 3;
    if (isSurvivor) return 2;
    if (isBountyHunter) return 1;
    return 0;
  };
  
  const votingPower = getVotingPower();
  const maxPower = 3; // Maximum possible voting power
  const votingPercent = (votingPower / maxPower) * 100;

  const getRoleIcon = () => {
    if (isSentinel) return <Shield className="w-5 h-5 text-toxic-neon" />;
    if (isSurvivor) return <User className="w-5 h-5 text-blue-400" />;
    if (isBountyHunter) return <Crosshair className="w-5 h-5 text-purple-400" />;
    return <User className="w-5 h-5 text-gray-400" />;
  };

  if (isLoading) {
    return (
      <div className="animate-pulse bg-white/5 rounded-lg p-4">
        <div className="h-4 bg-white/10 rounded w-1/3 mb-2"></div>
        <div className="h-2 bg-white/10 rounded w-full mb-4"></div>
        <div className="h-10 bg-white/10 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-black/30 border border-toxic-neon/20 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-white">Your Voting Power</h3>
        <div className="flex items-center gap-2">
          {getRoleIcon()}
          <span className="text-sm">{primaryRole}</span>
        </div>
      </div>
      
      <div className="mb-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full">
                <Progress value={votingPercent} className="h-3" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">Voting Power: {votingPower}/{maxPower}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {showDetails && (
        <div className="text-sm text-white/70">
          <p className="mb-2">Voting influence based on your NFT:</p>
          <ul className="space-y-1">
            <li className={`flex items-center gap-2 ${isSentinel ? 'text-toxic-neon' : 'text-white/40'}`}>
              <Shield className="w-4 h-4" /> Sentinel: 3x voting power
            </li>
            <li className={`flex items-center gap-2 ${isSurvivor ? 'text-blue-400' : 'text-white/40'}`}>
              <User className="w-4 h-4" /> Survivor: 2x voting power
            </li>
            <li className={`flex items-center gap-2 ${isBountyHunter ? 'text-purple-400' : 'text-white/40'}`}>
              <Crosshair className="w-4 h-4" /> Bounty Hunter: 1x voting power
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
