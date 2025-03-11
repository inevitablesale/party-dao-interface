
import React from "react";
import { HunterTierLevel } from "@/types/content";
import { 
  Shield, Award, Trophy, Crown, 
  CheckCircle, XCircle, Clock, Percent 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface HunterStats {
  totalReferrals: number;
  successfulReferrals: number;
  successRate: number;
  averageCompletionTime?: number;
}

interface TierRequirement {
  label: string;
  value: string | number;
  target: number;
  icon: React.ReactNode;
  isMet: boolean;
}

interface HunterTierDetailsProps {
  currentTier: {
    level: HunterTierLevel;
    requiredReferrals: number;
    requiredSuccessRate: number;
    rewardMultiplier: number;
    description: string;
    benefits: string[];
  };
  nextTier?: {
    level: HunterTierLevel;
    requiredReferrals: number;
    requiredSuccessRate: number;
    rewardMultiplier: number;
  } | null;
  stats: HunterStats;
  progress: number;
  className?: string;
}

const tierIcons = {
  bronze: Shield,
  silver: Award,
  gold: Trophy,
  platinum: Crown
};

const tierColors = {
  bronze: {
    color: "text-amber-700",
    bgColor: "bg-amber-700/10",
    borderColor: "border-amber-700/20",
    progressColor: "bg-amber-700"
  },
  silver: {
    color: "text-slate-400",
    bgColor: "bg-slate-400/10",
    borderColor: "border-slate-400/20",
    progressColor: "bg-slate-400"
  },
  gold: {
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    progressColor: "bg-yellow-500"
  },
  platinum: {
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    borderColor: "border-cyan-400/20",
    progressColor: "bg-cyan-400"
  }
};

export const HunterTierDetails: React.FC<HunterTierDetailsProps> = ({
  currentTier,
  nextTier,
  stats,
  progress,
  className
}) => {
  const CurrentTierIcon = tierIcons[currentTier.level];
  const currentColors = tierColors[currentTier.level];
  const NextTierIcon = nextTier ? tierIcons[nextTier.level] : null;
  
  // Calculate requirements and whether they are met
  const requirements: TierRequirement[] = [];
  
  if (nextTier) {
    requirements.push({
      label: "Successful Referrals",
      value: stats.successfulReferrals,
      target: nextTier.requiredReferrals,
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      isMet: stats.successfulReferrals >= nextTier.requiredReferrals
    });
    
    requirements.push({
      label: "Success Rate",
      value: `${Math.round(stats.successRate)}%`,
      target: nextTier.requiredSuccessRate,
      icon: <Percent className="h-4 w-4 text-blue-500" />,
      isMet: stats.successRate >= nextTier.requiredSuccessRate
    });
  }
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className={cn("h-2", currentColors.progressColor)} />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("p-1.5 rounded-md", currentColors.bgColor)}>
              <CurrentTierIcon className={cn("h-5 w-5", currentColors.color)} />
            </div>
            <CardTitle className={currentColors.color}>
              {currentTier.level.charAt(0).toUpperCase() + currentTier.level.slice(1)} Tier
            </CardTitle>
          </div>
          <div className={cn("px-2 py-1 rounded-md text-sm font-medium", currentColors.bgColor, currentColors.color)}>
            {currentTier.rewardMultiplier.toFixed(1)}x Rewards
          </div>
        </div>
        <CardDescription>{currentTier.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Benefits */}
          <div>
            <h4 className="text-sm font-medium mb-2">Benefits</h4>
            <ul className="space-y-1">
              {currentTier.benefits.map((benefit, i) => (
                <li key={i} className="flex items-center text-sm">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-200">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Performance Stats */}
          <div>
            <h4 className="text-sm font-medium mb-2">Your Performance</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-black/20 rounded p-2 text-center">
                <p className="text-xs text-gray-400">Total</p>
                <p className="text-lg font-medium">{stats.totalReferrals}</p>
              </div>
              <div className="bg-black/20 rounded p-2 text-center">
                <p className="text-xs text-gray-400">Successful</p>
                <p className="text-lg font-medium text-green-500">{stats.successfulReferrals}</p>
              </div>
              <div className="bg-black/20 rounded p-2 text-center">
                <p className="text-xs text-gray-400">Success Rate</p>
                <p className="text-lg font-medium text-blue-500">{Math.round(stats.successRate)}%</p>
              </div>
            </div>
          </div>
          
          {/* Next Tier Progress */}
          {nextTier && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Next Tier Progress</h4>
                <div className="flex items-center text-xs text-gray-400">
                  <NextTierIcon className="h-3.5 w-3.5 mr-1" />
                  {nextTier.level.charAt(0).toUpperCase() + nextTier.level.slice(1)}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Overall Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress 
                    value={progress} 
                    className="h-2" 
                  />
                </div>
                
                {requirements.map((req, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      {req.icon}
                      <span className="ml-2">{req.label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={req.isMet ? "text-green-500" : "text-gray-300"}>
                        {req.value}
                      </span>
                      <span className="text-gray-500">/ {req.target}</span>
                      {req.isMet ? (
                        <CheckCircle className="h-3.5 w-3.5 text-green-500 ml-1" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-gray-500 ml-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HunterTierDetails;
