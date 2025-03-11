
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Star } from "lucide-react";

export type HunterTierLevel = "bronze" | "silver" | "gold" | "platinum" | "diamond";

export interface HunterTierBadgeProps {
  tier: HunterTierLevel;
  className?: string;
  multiplier?: number; // Made optional with ?
}

export function HunterTierBadge({ 
  tier, 
  className,
  multiplier = 1 // Default value provided
}: HunterTierBadgeProps) {
  const tierConfig = {
    bronze: {
      icon: Trophy,
      color: "bg-amber-700/20 text-amber-700 border-amber-700/40",
    },
    silver: {
      icon: Trophy,
      color: "bg-slate-400/20 text-slate-400 border-slate-400/40",
    },
    gold: {
      icon: Award,
      color: "bg-yellow-500/20 text-yellow-500 border-yellow-500/40",
    },
    platinum: {
      icon: Award,
      color: "bg-blue-400/20 text-blue-400 border-blue-400/40",
    },
    diamond: {
      icon: Star,
      color: "bg-purple-500/20 text-purple-500 border-purple-500/40",
    },
  };

  const TierIcon = tierConfig[tier].icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "flex items-center gap-1 py-1 capitalize",
        tierConfig[tier].color,
        className
      )}
    >
      <TierIcon className="h-3 w-3" />
      <span>{tier}</span>
      {multiplier > 1 && <span className="text-xs">×{multiplier}</span>}
    </Badge>
  );
}
