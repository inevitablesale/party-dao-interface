
import React from 'react';
import { SettlementsNavBar } from '@/components/settlements/SettlementsNavBar';
import { ReferralSystem } from '@/components/radiation/ReferralSystem';
import { ToxicCard } from '@/components/ui/toxic-card';
import { Users, Link, Gift, ArrowUpRight } from 'lucide-react';

const Referrals = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <SettlementsNavBar />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ToxicCard className="bg-black/80 border-toxic-neon/30 p-6 mb-6">
            <h2 className="text-2xl font-mono text-toxic-neon mb-4">Sentinel Referral Program</h2>
            <p className="text-white/70 mb-4">
              Help rebuild civilization by bringing more survivors into the Resistance. 
              For each new Sentinel or Survivor who joins through your referral link and 
              purchases an NFT, you'll earn a $25 reward.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-black/40 p-4 rounded-lg border border-toxic-neon/20">
                <div className="p-2 rounded-full bg-toxic-neon/10 w-10 h-10 flex items-center justify-center mb-2">
                  <Link className="h-5 w-5 text-toxic-neon" />
                </div>
                <h3 className="text-toxic-neon mb-1">Share Your Link</h3>
                <p className="text-white/60 text-sm">Generate your unique referral link and share it with your network</p>
              </div>
              
              <div className="bg-black/40 p-4 rounded-lg border border-toxic-neon/20">
                <div className="p-2 rounded-full bg-toxic-neon/10 w-10 h-10 flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-toxic-neon" />
                </div>
                <h3 className="text-toxic-neon mb-1">Friends Join</h3>
                <p className="text-white/60 text-sm">Your friends register and purchase an NFT using your referral link</p>
              </div>
              
              <div className="bg-black/40 p-4 rounded-lg border border-toxic-neon/20">
                <div className="p-2 rounded-full bg-toxic-neon/10 w-10 h-10 flex items-center justify-center mb-2">
                  <Gift className="h-5 w-5 text-toxic-neon" />
                </div>
                <h3 className="text-toxic-neon mb-1">Earn Rewards</h3>
                <p className="text-white/60 text-sm">Receive $25 for each successful referral that results in an NFT purchase</p>
              </div>
            </div>
            
            <div className="bg-black/40 p-4 rounded-lg border border-amber-500/20">
              <h3 className="text-amber-400 flex items-center gap-2 mb-2">
                <ArrowUpRight className="h-5 w-5" />
                Tier Rewards Coming Soon
              </h3>
              <p className="text-white/70 text-sm">
                We're working on additional rewards for our top referrers. Reach higher tiers to unlock
                exclusive benefits, increased rewards, and special access to community events.
              </p>
            </div>
          </ToxicCard>
          
          <ToxicCard className="bg-black/80 border-toxic-neon/30 p-6">
            <h2 className="text-2xl font-mono text-toxic-neon mb-4">FAQ</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-toxic-neon mb-1">How do referrals work?</h3>
                <p className="text-white/70 text-sm">
                  When someone clicks your referral link, we track their visit using a cookie. If they connect
                  their wallet and purchase an NFT within 30 days, you receive credit for the referral.
                </p>
              </div>
              
              <div>
                <h3 className="text-toxic-neon mb-1">When do I get paid?</h3>
                <p className="text-white/70 text-sm">
                  Referral rewards are processed weekly. You'll need to submit payment details through the 
                  dashboard once you have accumulated at least one successful referral.
                </p>
              </div>
              
              <div>
                <h3 className="text-toxic-neon mb-1">What counts as a successful referral?</h3>
                <p className="text-white/70 text-sm">
                  A successful referral is when someone uses your link, creates an account, and purchases either a 
                  Sentinel or Survivor NFT. Free mints do not qualify for referral rewards.
                </p>
              </div>
              
              <div>
                <h3 className="text-toxic-neon mb-1">Can I refer myself?</h3>
                <p className="text-white/70 text-sm">
                  No, self-referrals are not allowed. Our system detects if the same person is using multiple 
                  wallets for self-referral, which could result in disqualification from the program.
                </p>
              </div>
            </div>
          </ToxicCard>
        </div>
        
        <div>
          <ReferralSystem className="h-full" />
        </div>
      </div>
    </div>
  );
};

export default Referrals;
