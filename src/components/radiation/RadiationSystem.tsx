
import React from 'react';
import { ToxicCard } from '@/components/ui/toxic-card';
import { ToxicBadge } from '@/components/ui/toxic-badge';
import { ToxicProgress } from '@/components/ui/toxic-progress';
import { ToxicButton } from '@/components/ui/toxic-button';
import { Radiation, Biohazard, Lock, Unlock, AlertTriangle, Target, Coins, Users, Building2, Globe } from 'lucide-react';

interface FeatureUnlock {
  radiationLevel: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
}

interface RadiationSystemProps {
  currentRadiation: number;
  totalNFTsClaimed: number;
  className?: string;
}

export function RadiationSystem({ currentRadiation, totalNFTsClaimed, className = "" }: RadiationSystemProps) {
  // Feature unlocks based on radiation levels
  const featureUnlocks: FeatureUnlock[] = [
    {
      radiationLevel: 100,
      name: "Referral System",
      description: "Generate referral links and earn 50% of each NFT purchase",
      icon: <Target className="h-4 w-4 text-toxic-neon" />,
      unlocked: currentRadiation <= 100
    },
    {
      radiationLevel: 90,
      name: "Job Board",
      description: "Bounty Hunters can post jobs for Survivors",
      icon: <Coins className="h-4 w-4 text-amber-400" />,
      unlocked: currentRadiation <= 90
    },
    {
      radiationLevel: 75,
      name: "Settlement Fundraising",
      description: "Fund new settlements and basic trading",
      icon: <Building2 className="h-4 w-4 text-purple-400" />,
      unlocked: currentRadiation <= 75
    },
    {
      radiationLevel: 50,
      name: "Full Marketplace",
      description: "Complete marketplace opens with all features",
      icon: <Users className="h-4 w-4 text-toxic-neon" />,
      unlocked: currentRadiation <= 50
    },
    {
      radiationLevel: 25,
      name: "Trade Routes",
      description: "Establish trade routes between settlements",
      icon: <Globe className="h-4 w-4 text-blue-400" />,
      unlocked: currentRadiation <= 25
    }
  ];

  // Find the next feature to unlock
  const nextFeature = featureUnlocks.find(feature => !feature.unlocked);
  
  // Calculate radiation reduction
  const radiationReduction = totalNFTsClaimed * 0.1;
  
  // Get radiation status label
  const getRadiationStatusLabel = (level: number) => {
    if (level > 90) return "Critical Danger";
    if (level > 75) return "High Risk";
    if (level > 50) return "Settlement Formation";
    if (level > 25) return "Economic Stability";
    if (level > 0) return "Flourishing Economy";
    return "Civilization Rebuilt";
  };

  return (
    <ToxicCard className={`bg-black/80 border-toxic-neon/30 p-5 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-toxic-neon/10">
          <Radiation className="h-6 w-6 text-toxic-neon" />
        </div>
        <div>
          <h2 className="text-xl font-mono text-toxic-neon">Global Radiation Level</h2>
          <p className="text-white/60 text-sm">Status: {getRadiationStatusLabel(currentRadiation)}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-white/70">Current Level</span>
          <span className="text-toxic-neon font-mono">{currentRadiation}%</span>
        </div>
        <ToxicProgress 
          value={100 - currentRadiation} 
          variant="radiation" 
          className="h-3 mb-1" 
        />
        <div className="flex justify-between text-xs mt-1">
          <span className={currentRadiation > 75 ? "text-apocalypse-red" : "text-white/50"}>CRITICAL</span>
          <span className={currentRadiation <= 75 && currentRadiation > 25 ? "text-amber-400" : "text-white/50"}>UNSTABLE</span>
          <span className={currentRadiation <= 25 ? "text-toxic-neon" : "text-white/50"}>SAFE</span>
        </div>
      </div>
      
      <div className="bg-black/40 rounded-lg p-3 mb-4 border border-toxic-neon/20">
        <div className="flex justify-between mb-1">
          <span className="text-white/70">NFTs Claimed</span>
          <span className="text-toxic-neon font-mono">{totalNFTsClaimed}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-white/70">Radiation Reduction</span>
          <span className="text-toxic-neon font-mono">-{radiationReduction.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/70">Each NFT Reduces</span>
          <span className="text-toxic-neon font-mono">-0.1%</span>
        </div>
      </div>
      
      <h3 className="text-lg font-mono text-toxic-neon mb-3">Feature Unlocks</h3>
      
      <div className="space-y-2 mb-4">
        {featureUnlocks.map((feature) => (
          <div 
            key={feature.radiationLevel}
            className={`flex items-center justify-between p-2 rounded-md border ${
              feature.unlocked 
                ? "border-toxic-neon/30 bg-toxic-neon/10" 
                : "border-white/10 bg-black/40"
            }`}
          >
            <div className="flex items-center gap-2">
              {feature.icon}
              <span className={feature.unlocked ? "text-toxic-neon" : "text-white/50"}>
                {feature.name}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-white/50 mr-2">{feature.radiationLevel}%</span>
              {feature.unlocked ? (
                <Unlock className="h-4 w-4 text-toxic-neon" />
              ) : (
                <Lock className="h-4 w-4 text-white/30" />
              )}
            </div>
          </div>
        ))}
      </div>
      
      {nextFeature && (
        <div className="bg-black/50 border border-amber-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <h4 className="text-amber-400 font-mono">Next Unlock</h4>
          </div>
          <p className="text-white/70 text-sm mb-2">
            {nextFeature.description}
          </p>
          <div className="flex justify-between text-xs">
            <span className="text-white/50">Requires Radiation Level</span>
            <span className="text-amber-400 font-mono">{nextFeature.radiationLevel}%</span>
          </div>
        </div>
      )}
      
      <div className="mt-4">
        <ToxicButton 
          variant="default" 
          className="w-full"
          onClick={() => window.open("/referral", "_blank")}
        >
          <Target className="h-4 w-4 mr-2" />
          Generate Referral Link
        </ToxicButton>
      </div>
    </ToxicCard>
  );
}
