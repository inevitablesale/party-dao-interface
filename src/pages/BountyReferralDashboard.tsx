import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Target, Gift, Wallet, Users, Link, ArrowUpRight, Award, ChevronRight, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { ToxicCard } from '@/components/ui/toxic-card';
import { ToxicButton } from '@/components/ui/toxic-button';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResistanceWalletWidget } from '@/components/wallet/ResistanceWalletWidget';
import ReferralLinkManager from '@/components/referrals/ReferralLinkManager';
import ReferralStatsTracker from '@/components/referrals/ReferralStatsTracker';
import ReferralRewardDisplay from '@/components/referrals/ReferralRewardDisplay';
import { getBounty, Bounty } from '@/services/bountyService';
import { useCustomWallet } from '@/hooks/useCustomWallet';

export default function BountyReferralDashboard() {
  const { bountyId } = useParams<{ bountyId: string }>();
  const { toast } = useToast();
  const { address, isConnected } = useCustomWallet();
  const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentBountyId, setCurrentBountyId] = useState<string | undefined>(bountyId);
  
  const [completedReferrals, setCompletedReferrals] = useState(0);
  const [pendingPayouts, setPendingPayouts] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  
  useEffect(() => {
    const loadBounty = async () => {
      setIsLoading(true);
      try {
        if (currentBountyId) {
          const bounty = await getBounty(currentBountyId);
          setSelectedBounty(bounty);
          
          if (bounty) {
            const completed = Math.floor(Math.random() * 10);
            setCompletedReferrals(completed);
            setPendingPayouts(Math.floor(Math.random() * 100));
            setTotalEarnings(completed * bounty.rewardAmount);
          }
        }
      } catch (error) {
        console.error("Error loading bounty:", error);
        toast({
          title: "Failed to load bounty",
          description: "Could not retrieve the selected bounty",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBounty();
  }, [currentBountyId, toast]);
  
  const handleBountySelect = (bountyId: string) => {
    setCurrentBountyId(bountyId);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-20 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col">
          <div className="mb-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-toxic-neon/10 text-toxic-neon text-sm mb-3">
              <Target className="w-4 h-4 mr-2" />
              <span>Referral Dashboard</span>
            </div>
            <h1 className="text-4xl font-bold text-white">Bounty Hunters</h1>
            <p className="mt-2 text-zinc-400 max-w-xl">
              Share your unique referral links to earn rewards and contribute to the Wasteland ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ToxicCard className="p-6 border-toxic-neon/20">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Gift className="h-6 w-6 text-toxic-neon" /> 
                  Your Referral Tools
                </h2>
                
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-toxic-neon"></div>
                  </div>
                ) : !isConnected ? (
                  <Card className="bg-black/30 border-gray-800 p-6 text-center">
                    <Wallet className="h-12 w-12 text-toxic-neon/50 mx-auto mb-4" />
                    <h3 className="text-white text-xl mb-2">Connect Your Wallet</h3>
                    <p className="text-zinc-400 mb-4">
                      Connect your wallet to access your referral tools and start earning rewards.
                    </p>
                    <div className="flex justify-center">
                      <ToxicButton onClick={() => {}}>
                        Connect Wallet
                      </ToxicButton>
                    </div>
                  </Card>
                ) : (
                  <ReferralLinkManager 
                    address={address} 
                    showBountySelector={true}
                    onBountySelect={handleBountySelect}
                  />
                )}
                
                {selectedBounty && (
                  <div className="mt-6 bg-black/30 p-4 rounded-lg border border-toxic-neon/20">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-toxic-neon font-mono flex items-center gap-2">
                        <Award className="h-5 w-5" /> 
                        Selected Bounty Details
                      </h3>
                      <Badge variant="outline" className="bg-black/50 border-toxic-neon/30">
                        {selectedBounty.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                        <span className="text-zinc-400">Reward Per Referral</span>
                        <span className="text-toxic-neon font-mono">{selectedBounty.rewardAmount} MATIC</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                        <span className="text-zinc-400">Remaining Budget</span>
                        <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>
                            {selectedBounty.remainingBudget !== undefined ? 
                              selectedBounty.remainingBudget : (selectedBounty.totalBudget - selectedBounty.usedBudget)} MATIC remaining
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                        <span className="text-zinc-400">Expiration</span>
                        <span className="text-toxic-neon font-mono">
                          {new Date(selectedBounty.expiresAt * 1000).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400">Success Count</span>
                        <span className="text-toxic-neon font-mono">{selectedBounty.successCount} referrals</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-zinc-400">
                      <p>{selectedBounty.description}</p>
                    </div>
                  </div>
                )}
              </ToxicCard>
              
              <ReferralStatsTracker bountyId={currentBountyId} />
            </div>
            
            <div className="space-y-6">
              <ToxicCard className="p-6 border-toxic-neon/20">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Wallet className="h-6 w-6 text-toxic-neon" /> 
                  Rewards & Earnings
                </h2>
                
                {isConnected ? (
                  <ReferralRewardDisplay 
                    completedReferrals={completedReferrals} 
                    pendingPayouts={pendingPayouts}
                    totalEarnings={totalEarnings}
                  />
                ) : (
                  <div className="bg-black/30 p-4 rounded-lg border border-amber-500/20 text-center">
                    <Wallet className="h-8 w-8 text-amber-500/70 mx-auto mb-2" />
                    <h3 className="text-white text-lg mb-1">Wallet Required</h3>
                    <p className="text-zinc-400 text-sm mb-4">
                      Connect your wallet to view your rewards and earnings.
                    </p>
                  </div>
                )}
              </ToxicCard>
              
              <Card className="bg-black/40 border-gray-800 p-6">
                <h3 className="text-white text-lg mb-3">Referral Guidelines</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <div className="bg-toxic-neon/10 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-toxic-neon text-xs">1</span>
                    </div>
                    <p className="text-zinc-300">Share your unique referral link with potential participants</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-toxic-neon/10 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-toxic-neon text-xs">2</span>
                    </div>
                    <p className="text-zinc-300">When they complete the required actions, you earn rewards</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="bg-toxic-neon/10 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-toxic-neon text-xs">3</span>
                    </div>
                    <p className="text-zinc-300">Claim your rewards directly to your wallet</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <Button 
                    variant="outline" 
                    className="w-full justify-between border-gray-700 text-white"
                  >
                    <span className="flex items-center">
                      <Link className="h-4 w-4 mr-2 text-toxic-neon" />
                      View Full Guidelines
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
              
              <ToxicCard className="p-6 border-amber-600/20">
                <h3 className="text-amber-400 text-lg mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Become a Bounty Creator
                </h3>
                <p className="text-zinc-300 text-sm mb-4">
                  Create your own bounty programs to incentivize community growth and engagement.
                </p>
                <ToxicButton 
                  variant="marketplace" 
                  className="w-full justify-between"
                  onClick={() => window.location.href = "/bounty/create"}
                >
                  <span className="flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    Create a Bounty
                  </span>
                  <ArrowUpRight className="h-4 w-4" />
                </ToxicButton>
              </ToxicCard>
            </div>
          </div>
        </div>
      </div>
      <ResistanceWalletWidget />
    </div>
  );
}
