
import React from 'react';
import { ToxicCard } from '@/components/ui/toxic-card';
import { ToxicButton } from '@/components/ui/toxic-button';
import { ShieldCheck, AlertTriangle, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

interface ReferralStatusCardProps {
  isLoadingNFT: boolean;
  isBountyHunter: boolean;
}

const ReferralStatusCard: React.FC<ReferralStatusCardProps> = ({ 
  isLoadingNFT, 
  isBountyHunter 
}) => {
  const navigate = useNavigate();
  
  const handleGetNFT = () => {
    navigate('/mint-nft');
  };

  if (isLoadingNFT) {
    return (
      <ToxicCard className="bg-black/60 border-toxic-neon/30 p-5">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-toxic-neon/20 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-toxic-neon/20 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-toxic-neon/10 rounded"></div>
              <div className="h-4 bg-toxic-neon/10 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </ToxicCard>
    );
  }

  return (
    <ToxicCard className="bg-black/60 border-toxic-neon/30 p-5">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full ${isBountyHunter ? 'bg-green-900/30' : 'bg-amber-900/30'}`}>
          {isBountyHunter ? (
            <ShieldCheck className="h-8 w-8 text-green-500" />
          ) : (
            <AlertTriangle className="h-8 w-8 text-amber-500" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className={`text-xl font-mono ${isBountyHunter ? 'text-green-500' : 'text-amber-500'}`}>
            {isBountyHunter ? 'Bounty Hunter Verified' : 'Bounty Hunter NFT Required'}
          </h3>
          
          <p className="text-white/70 mt-1 mb-3">
            {isBountyHunter 
              ? 'Your wallet is verified as a Bounty Hunter. You can earn referral rewards.' 
              : 'You need a Bounty Hunter NFT to participate in the referral program.'}
          </p>
          
          {!isBountyHunter && (
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <Progress value={0} className="h-2 w-full md:w-1/2" />
              <ToxicButton 
                variant="primary"
                onClick={handleGetNFT}
                className="w-full md:w-auto"
              >
                Get Bounty Hunter NFT
                <ArrowRight className="h-4 w-4 ml-2" />
              </ToxicButton>
            </div>
          )}
        </div>
      </div>
    </ToxicCard>
  );
};

export default ReferralStatusCard;
