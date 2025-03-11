
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, Send, Info } from "lucide-react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useToast } from "@/hooks/use-toast";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { usePartyTransactions } from "@/hooks/usePartyTransactions";
import { 
  calculatePriceStructure, 
  formatEthAmount,
  PriceBreakdown,
  calculateContributionBreakdown
} from "@/utils/priceCalculator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";

interface ReferralInfo {
  referrerAddress: string;
  referredAddress: string;
  referralDate: string;
  nftPurchased: boolean;
  paymentProcessed: boolean;
}

interface ContributionPanelProps {
  settlementId: string;
  settlementName: string;
  onSuccess?: () => void;
}

export const ContributionPanel = ({ settlementId, settlementName, onSuccess }: ContributionPanelProps) => {
  const [contribution, setContribution] = useState("");
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null);
  const [votingPowerEstimate, setVotingPowerEstimate] = useState<number | null>(null);
  
  const { primaryWallet } = useDynamicContext();
  const { isConnected, connect } = useWalletConnection();
  const { address, getReferrer } = useCustomWallet();
  const { toast } = useToast();
  const { contribute, isProcessing } = usePartyTransactions();
  const [referrer, setReferrer] = useState<string | null>(null);

  // Check for referrer when component mounts
  useEffect(() => {
    if (isConnected && address) {
      const storedReferrer = getReferrer();
      if (storedReferrer) {
        setReferrer(storedReferrer);
        console.log("Contribution will be credited to referrer:", storedReferrer);
      }
    }
  }, [isConnected, address, getReferrer]);

  // Calculate price breakdown when contribution changes
  useEffect(() => {
    if (contribution && !isNaN(parseFloat(contribution))) {
      const contributionAmount = parseFloat(contribution);
      
      // Calculate price breakdown including Party DAO fees and referral rewards
      const breakdown = calculatePriceStructure(contributionAmount);
      setPriceBreakdown(breakdown);
      
      // Calculate voting power estimate
      const partyDetails = calculateContributionBreakdown(contributionAmount);
      setVotingPowerEstimate(partyDetails.estimatedVotingPower);
    } else {
      setPriceBreakdown(null);
      setVotingPowerEstimate(null);
    }
  }, [contribution]);

  const handleContribute = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to contribute to this settlement",
      });
      connect();
      return;
    }
    
    if (!primaryWallet || !contribution || !settlementId) {
      toast({
        title: "Invalid Contribution",
        description: "Please enter a valid contribution amount",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // If we have a price breakdown, use the gross amount for the transaction
      const contributionAmount = priceBreakdown 
        ? formatEthAmount(priceBreakdown.grossPrice) 
        : contribution;
      
      const tx = await contribute(settlementId, contributionAmount, referrer || undefined);
      
      if (tx) {
        // If this user was referred, record the purchase completion
        if (referrer) {
          console.log(`Referral purchase completed. Referrer: ${referrer}, Buyer: ${address}`);
          
          // Update the referral in localStorage to mark as purchased
          const storedReferrals = localStorage.getItem(`referrals_${referrer}`);
          if (storedReferrals) {
            const referrals: ReferralInfo[] = JSON.parse(storedReferrals);
            const updatedReferrals = referrals.map(ref => {
              if (ref.referredAddress === address) {
                return { ...ref, nftPurchased: true };
              }
              return ref;
            });
            
            localStorage.setItem(`referrals_${referrer}`, JSON.stringify(updatedReferrals));
          }
        }
        
        // Reset form and notify parent component
        setContribution("");
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      console.error("Error contributing:", error);
      // Error is already handled by the usePartyTransactions hook
    }
  };

  return (
    <Card className="bg-[#111] rounded-xl border border-toxic-neon/30 p-6 space-y-6 shadow-[0_0_15px_rgba(57,255,20,0.15)]">
      <CardContent className="p-0 space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-toxic-neon">
          <Shield className="w-5 h-5 text-toxic-neon" />
          Sentinel Contribution
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Contribution Amount (ETH)</label>
            <div className="flex mt-1">
              <Input
                type="number"
                placeholder="0.0"
                value={contribution}
                onChange={(e) => setContribution(e.target.value)}
                className="bg-black/50 border-toxic-neon/20 text-white focus:border-toxic-neon/50 focus:ring-toxic-neon/20"
                min="0"
                step="0.01"
              />
            </div>
            
            {priceBreakdown && (
              <div className="mt-2 text-xs space-y-1 bg-black/30 p-2 rounded border border-toxic-neon/10">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1 text-gray-400">
                          Party DAO Fee (2.5%)
                          <Info className="h-3 w-3 text-gray-500" />
                        </span>
                        <span className="text-red-400">-{formatEthAmount(priceBreakdown.partyDaoFee)} ETH</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-black border border-toxic-neon/30 text-xs">
                      <p>Party Protocol charges a 2.5% fee on all transactions</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {referrer && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Referral Reward</span>
                    <span className="text-amber-400">-{formatEthAmount(priceBreakdown.referralAmount)} ETH</span>
                  </div>
                )}
                
                <div className="flex justify-between pt-1 border-t border-toxic-neon/10">
                  <span className="font-medium text-toxic-neon">Final Settlement Amount</span>
                  <span className="font-medium">{formatEthAmount(priceBreakdown.finalRevenue)} ETH</span>
                </div>
                
                {votingPowerEstimate !== null && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex justify-between items-center mt-2 pt-1 border-t border-toxic-neon/10">
                          <span className="flex items-center gap-1 text-gray-400">
                            Estimated Voting Power
                            <Info className="h-3 w-3 text-gray-500" />
                          </span>
                          <span className="text-blue-400">{votingPowerEstimate.toFixed(0)}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-black border border-toxic-neon/30 text-xs">
                        <p>Voting power determines your influence on governance proposals</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            )}
          </div>
          
          <Button
            onClick={handleContribute}
            disabled={isProcessing || !contribution || parseFloat(contribution) <= 0}
            variant="default"
            className="w-full bg-toxic-neon hover:bg-toxic-neon/90 text-black"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Contribute to Settlement
              </>
            )}
          </Button>
          
          <div className="text-xs text-toxic-neon/70">
            By contributing, you'll receive governance rights in this settlement proportional to your contribution.
            {referrer && (
              <div className="mt-1 text-amber-400">
                Your purchase will credit your referrer with a $25 bounty reward.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
