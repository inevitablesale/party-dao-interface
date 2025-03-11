
import React, { useState, useEffect } from 'react';
import { ToxicCard } from '@/components/ui/toxic-card';
import { ToxicButton } from '@/components/ui/toxic-button';
import { ToxicBadge } from '@/components/ui/toxic-badge';
import { Target, Copy, Share2, Check, ArrowUp, Coins, DollarSign, Users, Gift, Link, Clock, Award, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useCustomWallet } from '@/hooks/useCustomWallet';
import { useToast } from '@/hooks/use-toast';
import { useNFTRoles } from '@/hooks/useNFTRoles';
import { getReferralsByReferrer, ReferralInfo } from '@/services/referralService';
import { ethers } from "ethers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReferralLinkManager from './ReferralLinkManager';
import ReferralStatusCard from './ReferralStatusCard';
import ReferralRewardDisplay from './ReferralRewardDisplay';

export function NFTReferralDashboard() {
  const { address, isConnected } = useCustomWallet();
  const { toast } = useToast();
  const { isBountyHunter, isLoading: isLoadingNFT } = useNFTRoles();
  const [referrals, setReferrals] = useState<ReferralInfo[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    pendingReferrals: 0,
    completedReferrals: 0,
    earnings: 0,
    pendingPayouts: 0
  });
  
  // Fetch referral data when wallet is connected
  useEffect(() => {
    if (!isConnected || !address) return;
    
    const fetchReferralData = async () => {
      setLoading(true);
      try {
        const referralsData = await getReferralsByReferrer(address);
        
        if (referralsData && referralsData.length > 0) {
          setReferrals(referralsData);
          
          // Calculate statistics
          const pending = referralsData.filter(r => !r.nftPurchased).length;
          const completed = referralsData.filter(r => r.nftPurchased).length;
          const totalEarnings = completed * 25; // $25 per completed referral
          const pendingPayouts = referralsData.filter(r => 
            r.nftPurchased && !r.paymentProcessed
          ).length * 25;
          
          setReferralStats({
            totalReferrals: referralsData.length,
            pendingReferrals: pending,
            completedReferrals: completed,
            earnings: totalEarnings,
            pendingPayouts: pendingPayouts
          });
        }
      } catch (error) {
        console.error("Error fetching referral data:", error);
        toast({
          title: "Error",
          description: "Failed to load referral data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchReferralData();
  }, [address, isConnected]);

  // Calculate tier progress
  const tierThresholds = [5, 10, 25, 50, 100];
  const currentTier = tierThresholds.findIndex(t => referralStats.completedReferrals < t);
  const currentThreshold = currentTier > 0 ? tierThresholds[currentTier - 1] : 0;
  const nextThreshold = currentTier >= 0 ? tierThresholds[currentTier] : tierThresholds[0];
  const tierProgress = currentTier >= 0 
    ? ((referralStats.completedReferrals - currentThreshold) / (nextThreshold - currentThreshold)) * 100
    : 100;
  
  const getTierName = (completedReferrals: number) => {
    if (completedReferrals >= 100) return "Legendary Hunter";
    if (completedReferrals >= 50) return "Elite Hunter";
    if (completedReferrals >= 25) return "Veteran Hunter";
    if (completedReferrals >= 10) return "Expert Hunter";
    if (completedReferrals >= 5) return "Skilled Hunter";
    return "Novice Hunter";
  };

  return (
    <div className="space-y-6">
      {/* NFT Status Check */}
      {isConnected && (
        <ReferralStatusCard 
          isLoadingNFT={isLoadingNFT}
          isBountyHunter={isBountyHunter}
        />
      )}
      
      {/* Main Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Referral Stats */}
        <ToxicCard className="col-span-1 md:col-span-2 bg-black/80 border-toxic-neon/30 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-toxic-neon/10">
              <Target className="h-6 w-6 text-toxic-neon" />
            </div>
            <div>
              <h2 className="text-xl font-mono text-toxic-neon">Bounty Hunter Referrals</h2>
              <p className="text-white/60 text-sm">Earn $25 for every NFT purchase through your referral</p>
            </div>
          </div>
          
          {isConnected ? (
            <div className="space-y-4">
              <div className="bg-black/40 rounded-lg p-3 border border-toxic-neon/20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                  <div className="text-center">
                    <div className="text-white/70 text-sm">Total Earnings</div>
                    <div className="text-xl font-mono text-toxic-neon flex justify-center items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {referralStats.earnings}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-white/70 text-sm">Successful Referrals</div>
                    <div className="text-xl font-mono text-toxic-neon flex justify-center items-center gap-1">
                      <Users className="h-4 w-4" />
                      {referralStats.completedReferrals}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-white/70 text-sm">Pending Referrals</div>
                    <div className="text-xl font-mono text-white/80 flex justify-center items-center gap-1">
                      <Clock className="h-4 w-4 text-toxic-neon/70" />
                      {referralStats.pendingReferrals}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-white/70 text-sm">Pending Rewards</div>
                    <div className="text-xl font-mono text-amber-400 flex justify-center items-center gap-1">
                      <Coins className="h-4 w-4" />
                      ${referralStats.pendingPayouts}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/60">{getTierName(referralStats.completedReferrals)}</span>
                    {currentTier >= 0 && (
                      <span className="text-toxic-neon">
                        {referralStats.completedReferrals}/{nextThreshold} to {getTierName(nextThreshold)}
                      </span>
                    )}
                  </div>
                  <Progress 
                    value={tierProgress} 
                    className="h-2"
                    indicatorClassName={referralStats.completedReferrals >= 100 ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" : ""}
                  />
                </div>
              </div>
              
              {/* Referral Link Manager */}
              <ReferralLinkManager address={address} />
              
              {/* Referral Activity and History */}
              <Tabs defaultValue="active" className="mt-6">
                <TabsList className="bg-black/50 border border-toxic-neon/20">
                  <TabsTrigger value="active">Active Referrals</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="rewards">Rewards</TabsTrigger>
                </TabsList>
                
                <TabsContent value="active" className="mt-2">
                  <div className="bg-black/30 p-3 rounded-lg border border-toxic-neon/20">
                    <h3 className="text-toxic-neon font-mono text-sm mb-2 flex items-center">
                      <Link className="h-4 w-4 mr-2" />
                      Pending Conversions
                    </h3>
                    
                    {loading ? (
                      <div className="text-center py-4 text-white/60">Loading referrals...</div>
                    ) : referrals.filter(r => !r.nftPurchased).length === 0 ? (
                      <div className="text-center py-4 text-white/60">No pending referrals</div>
                    ) : (
                      <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
                        {referrals
                          .filter(r => !r.nftPurchased)
                          .map((referral, i) => (
                            <div key={i} className="flex justify-between items-center bg-black/20 p-2 rounded">
                              <span className="text-sm text-white/70 font-mono">
                                {referral.referredAddress.substring(0, 6)}...{referral.referredAddress.substring(38)}
                              </span>
                              <span className="text-xs text-toxic-neon/70">
                                {new Date(referral.referralDate).toLocaleDateString()}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="completed" className="mt-2">
                  <div className="bg-black/30 p-3 rounded-lg border border-toxic-neon/20">
                    <h3 className="text-toxic-neon font-mono text-sm mb-2 flex items-center">
                      <Check className="h-4 w-4 mr-2" />
                      Successful Referrals
                    </h3>
                    
                    {loading ? (
                      <div className="text-center py-4 text-white/60">Loading referrals...</div>
                    ) : referrals.filter(r => r.nftPurchased).length === 0 ? (
                      <div className="text-center py-4 text-white/60">No completed referrals yet</div>
                    ) : (
                      <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
                        {referrals
                          .filter(r => r.nftPurchased)
                          .map((referral, i) => (
                            <div key={i} className="flex justify-between items-center bg-black/20 p-2 rounded">
                              <div>
                                <span className="text-sm text-white/70 font-mono">
                                  {referral.referredAddress.substring(0, 6)}...{referral.referredAddress.substring(38)}
                                </span>
                                <ToxicBadge variant="outline" className="ml-2 bg-black/30 text-xs">
                                  ${referral.paymentAmount || 25}
                                </ToxicBadge>
                              </div>
                              <span className="text-xs text-amber-400/70">
                                {referral.purchaseDate ? new Date(referral.purchaseDate).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="rewards" className="mt-2">
                  <ReferralRewardDisplay 
                    completedReferrals={referralStats.completedReferrals}
                    pendingPayouts={referralStats.pendingPayouts}
                    totalEarnings={referralStats.earnings}
                  />
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="text-center py-8 bg-black/30 rounded-lg border border-toxic-neon/20 mb-4">
              <Target className="h-12 w-12 text-toxic-neon/30 mx-auto mb-3" />
              <p className="text-white/70 mb-4">Connect your wallet to generate your unique referral link and start earning</p>
              <ToxicButton variant="primary">
                Connect Wallet
              </ToxicButton>
            </div>
          )}
        </ToxicCard>
        
        {/* Referral Program Info */}
        <ToxicCard className="bg-black/80 border-toxic-neon/30 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-toxic-neon/10">
              <Gift className="h-6 w-6 text-toxic-neon" />
            </div>
            <div>
              <h2 className="text-xl font-mono text-toxic-neon">Rewards Program</h2>
              <p className="text-white/60 text-sm">How the Bounty Hunter referral system works</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-black/40 p-3 rounded-lg border border-toxic-neon/20">
              <h3 className="text-toxic-neon font-mono text-sm mb-3 flex items-center">
                <Award className="h-4 w-4 mr-2" />
                Tier Benefits
              </h3>
              
              <div className="space-y-3">
                {[
                  { tier: "Novice Hunter", count: "0-4", bonus: "Base rewards" },
                  { tier: "Skilled Hunter", count: "5-9", bonus: "+5% bonus" },
                  { tier: "Expert Hunter", count: "10-24", bonus: "+10% bonus" },
                  { tier: "Veteran Hunter", count: "25-49", bonus: "+15% bonus" },
                  { tier: "Elite Hunter", count: "50-99", bonus: "+20% bonus" },
                  { tier: "Legendary Hunter", count: "100+", bonus: "+25% bonus + special NFT" }
                ].map((level, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-white/80">{level.tier}</span>
                    <div className="flex gap-3">
                      <span className="text-toxic-neon/70">{level.count}</span>
                      <span className="text-amber-400">{level.bonus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-black/40 p-3 rounded-lg border border-toxic-neon/20">
              <h3 className="text-toxic-neon font-mono text-sm mb-3 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Reward Structure
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Sentinel Referral</span>
                  <span className="text-toxic-neon">$25</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Survivor Referral</span>
                  <span className="text-toxic-neon">$25</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Bounty Hunter</span>
                  <span className="text-toxic-neon">Free Claim</span>
                </div>
                <div className="pt-2 mt-2 border-t border-toxic-neon/20">
                  <p className="text-white/60 text-xs">Rewards are processed within 24-48 hours after a successful NFT purchase. Payments are made to your connected wallet.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-black/40 p-3 rounded-lg border border-toxic-neon/20">
              <h3 className="text-toxic-neon font-mono text-sm mb-3 flex items-center">
                <Info className="h-4 w-4 mr-2" />
                How It Works
              </h3>
              
              <ol className="space-y-2 text-sm text-white/70 list-decimal pl-5">
                <li>Share your unique referral link with friends</li>
                <li>They connect their wallet through your link</li>
                <li>When they purchase an NFT, you earn rewards</li>
                <li>Earnings are credited to your account</li>
                <li>Claim rewards to your wallet</li>
              </ol>
            </div>
          </div>
        </ToxicCard>
      </div>
    </div>
  );
}

