
import React, { useState, useEffect } from 'react';
import { ToxicCard } from '@/components/ui/toxic-card';
import { ToxicButton } from '@/components/ui/toxic-button';
import { ToxicBadge } from '@/components/ui/toxic-badge';
import { Target, Copy, Share2, Check, ArrowUp, Coins, DollarSign, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useCustomWallet } from '@/hooks/useCustomWallet';
import { useToast } from '@/hooks/use-toast';
import { getReferralsByReferrer, ReferralInfo } from '@/services/referralService';
import { ethers } from "ethers";
import { subscribeToPurchaseEvents, ADMIN_WALLET_ADDRESS } from "@/services/nftPurchaseEvents";

interface ReferralSystemProps {
  earnings?: number;
  totalReferrals?: number;
  className?: string;
}

export function ReferralSystem({ earnings = 0, totalReferrals = 0, className = "" }: ReferralSystemProps) {
  const { address, isConnected, getReferrer } = useCustomWallet();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: totalReferrals || 0,
    pendingReferrals: 0,
    completedReferrals: 0,
    earnings: earnings || 0,
    pendingPayouts: 0
  });
  const [loading, setLoading] = useState(false);
  
  // Generate referral link based on connected wallet
  const referralLink = isConnected && address 
    ? `${window.location.origin}/r/${address}` 
    : 'Connect wallet to generate your referral link';
  
  // Check if this user was referred by someone
  useEffect(() => {
    const referrer = getReferrer();
    if (referrer && isConnected) {
      console.log("This user was referred by:", referrer);
    }
  }, [getReferrer, isConnected]);
  
  // Define the fetchReferralData function
  const fetchReferralData = async () => {
    if (!isConnected || !address) return;
    
    setLoading(true);
    try {
      // Get referral data using the service
      const referrals = await getReferralsByReferrer(address);
        
      if (referrals && referrals.length > 0) {
        // Count total, pending, and completed referrals
        const pending = referrals.filter(r => !r.nftPurchased).length;
        const completed = referrals.filter(r => r.nftPurchased).length;
        
        // Calculate earnings ($25 per completed referral)
        const totalEarnings = completed * 25;
        
        // Count pending payouts
        const pendingPayouts = referrals.filter(r => r.nftPurchased && !r.paymentProcessed).length * 25;
        
        setReferralStats({
          totalReferrals: referrals.length,
          pendingReferrals: pending,
          completedReferrals: completed,
          earnings: totalEarnings,
          pendingPayouts: pendingPayouts
        });
      }
    } catch (error) {
      console.error("Error fetching referral data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Use the fetchReferralData in useEffect
  useEffect(() => {
    if (!isConnected || !address) return;
    fetchReferralData();
  }, [address, isConnected]);

  // Add event subscription when connected
  useEffect(() => {
    if (!isConnected || !address) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    
    const unsubscribe = subscribeToPurchaseEvents(provider, (event) => {
      // Only refresh data for non-airdrop purchases
      if (!event.isAirdrop) {
        console.log("NFT purchase detected (not an airdrop) - refreshing referral data");
        fetchReferralData();
        
        toast({
          title: "New NFT Purchase!",
          description: "A referred user has made a purchase. Your reward will be processed soon.",
        });
      } else {
        console.log("Airdrop detected - not refreshing referral data");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isConnected, address]);
  
  const copyToClipboard = () => {
    if (!isConnected) return;
    
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    
    toast({
      title: "Referral Link Copied!",
      description: "Your unique referral link has been copied to clipboard.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const shareReferral = () => {
    if (!isConnected) return;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join the Wasteland Resistance',
        text: 'Claim your free NFT and help rebuild civilization in the Wasteland!',
        url: referralLink,
      });
    } else {
      copyToClipboard();
    }
  };

  // Calculate percentage of tier progress
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
    <ToxicCard className={`bg-black/80 border-toxic-neon/30 p-5 ${className}`}>
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
        <>
          <div className="bg-black/40 rounded-lg p-3 mb-4 border border-toxic-neon/20">
            <div className="grid grid-cols-2 gap-4 mb-2">
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
            </div>
            
            <div className="mt-3">
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
          
          <div className="mb-4">
            <label className="text-white/70 text-sm mb-2 block">Your Referral Link</label>
            <div className="relative">
              <Input 
                value={referralLink}
                readOnly
                className="bg-black/50 border-toxic-neon/30 text-toxic-neon pr-10"
              />
              <button 
                className="absolute right-2 top-1/2 -translate-y-1/2 text-toxic-neon/60 hover:text-toxic-neon"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            <ToxicButton 
              variant="outline"
              onClick={copyToClipboard}
              className="border-toxic-neon/30"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </ToxicButton>
            <ToxicButton 
              variant="outline"
              onClick={shareReferral}
              className="border-toxic-neon/30"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Link
            </ToxicButton>
          </div>
          
          <div className="bg-black/30 p-3 rounded-lg border border-amber-500/20">
            <h3 className="text-amber-400 font-mono flex items-center mb-2">
              <Coins className="h-4 w-4 mr-2" />
              Earnings Breakdown
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
              {referralStats.pendingPayouts > 0 && (
                <div className="flex justify-between pt-2 border-t border-toxic-neon/20">
                  <span className="text-amber-400">Pending Payouts</span>
                  <span className="text-amber-400">${referralStats.pendingPayouts}</span>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 bg-black/30 rounded-lg border border-toxic-neon/20 mb-4">
          <Target className="h-12 w-12 text-toxic-neon/30 mx-auto mb-3" />
          <p className="text-white/70 mb-4">Connect your wallet to generate your unique referral link and start earning</p>
          <ToxicButton variant="primary">
            Connect Wallet
          </ToxicButton>
        </div>
      )}
      
      <div className="mt-4">
        <ToxicBadge variant="outline" className="w-full flex justify-between items-center py-2 bg-black/40 border-toxic-neon/30">
          <span className="flex items-center text-white/70">
            <ArrowUp className="h-3 w-3 mr-1 text-toxic-neon" /> Refer Friends
          </span>
          <span className="text-toxic-neon">Lower Radiation</span>
        </ToxicBadge>
      </div>
    </ToxicCard>
  );
}
