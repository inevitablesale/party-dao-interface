
import { BountyMetadata, HunterTierLevel, PerformanceMultipliers } from "@/types/content";

/**
 * Calculate the reward multiplier for a hunter based on their performance
 * @param bountyMetadata The bounty metadata containing tier and multiplier settings
 * @param hunterAddress The address of the hunter to calculate multiplier for
 * @returns The reward multiplier to apply
 */
export function calculateRewardMultiplier(
  bountyMetadata: BountyMetadata,
  hunterAddress: string
): number {
  // Default multiplier is 1.0 (standard reward)
  let multiplier = 1.0;
  
  // Check if performance-based rewards are enabled
  const hunterTiers = bountyMetadata.hunterTiers;
  const performance = bountyMetadata.hunterPerformance?.[hunterAddress];
  const performanceMultipliers = bountyMetadata.performanceMultipliers;
  
  // If we don't have performance data or settings, return default multiplier
  if (!hunterTiers?.enabled || !performance) {
    return multiplier;
  }
  
  // Apply tier-based multiplier
  const tier = hunterTiers.tiers.find(t => t.level === performance.currentTier);
  if (tier) {
    multiplier *= tier.rewardMultiplier;
  }
  
  // Apply performance-based multipliers if configured
  if (performanceMultipliers) {
    // Success rate multiplier
    if (performanceMultipliers.successRate && performance.successRate) {
      // Find the highest threshold that the hunter meets
      const successThresholds = Object.keys(performanceMultipliers.successRate)
        .map(Number)
        .sort((a, b) => b - a); // Sort descending
      
      for (const threshold of successThresholds) {
        if (performance.successRate >= threshold) {
          multiplier *= performanceMultipliers.successRate[threshold];
          break;
        }
      }
    }
    
    // Total completed multiplier
    if (performanceMultipliers.totalCompleted && performance.successfulReferrals) {
      const completedThresholds = Object.keys(performanceMultipliers.totalCompleted)
        .map(Number)
        .sort((a, b) => b - a); // Sort descending
      
      for (const threshold of completedThresholds) {
        if (performance.successfulReferrals >= threshold) {
          multiplier *= performanceMultipliers.totalCompleted[threshold];
          break;
        }
      }
    }
    
    // Completion time multiplier can be added similar to above if tracking is implemented
  }
  
  return multiplier;
}

/**
 * Update a hunter's performance data after a successful or failed referral
 * @param bountyMetadata The current bounty metadata
 * @param hunterAddress The address of the hunter
 * @param successful Whether the referral was successful
 * @param completionTime Time taken to complete the referral (in seconds)
 * @param rewardAmount Amount of reward earned
 * @returns Updated bounty metadata
 */
export function updateHunterPerformance(
  bountyMetadata: BountyMetadata,
  hunterAddress: string,
  successful: boolean,
  completionTime?: number,
  rewardAmount?: number
): BountyMetadata {
  // Create a deep copy of the metadata to avoid mutation
  const updatedMetadata = JSON.parse(JSON.stringify(bountyMetadata)) as BountyMetadata;
  
  // Initialize hunterPerformance if it doesn't exist
  if (!updatedMetadata.hunterPerformance) {
    updatedMetadata.hunterPerformance = {};
  }
  
  // Initialize hunter record if it doesn't exist
  if (!updatedMetadata.hunterPerformance[hunterAddress]) {
    updatedMetadata.hunterPerformance[hunterAddress] = {
      totalReferrals: 0,
      successfulReferrals: 0,
      failedReferrals: 0,
      successRate: 0,
      totalEarned: 0,
      averageCompletionTime: 0,
      currentTier: "bronze" as HunterTierLevel,
      tierProgress: 0,
      rewardMultiplier: 1.0,
      lastUpdated: Math.floor(Date.now() / 1000)
    };
  }
  
  const hunter = updatedMetadata.hunterPerformance[hunterAddress];
  
  // Update hunter stats
  hunter.totalReferrals++;
  if (successful) {
    hunter.successfulReferrals++;
    if (rewardAmount) {
      hunter.totalEarned += rewardAmount;
    }
  } else {
    hunter.failedReferrals++;
  }
  
  // Recalculate success rate
  hunter.successRate = hunter.totalReferrals > 0 
    ? (hunter.successfulReferrals / hunter.totalReferrals) * 100 
    : 0;
  
  // Update completion time if provided
  if (completionTime && completionTime > 0) {
    const totalTime = hunter.averageCompletionTime * (hunter.successfulReferrals - 1);
    hunter.averageCompletionTime = (totalTime + completionTime) / hunter.successfulReferrals;
  }
  
  // Update tier if hunter tiers are enabled
  if (updatedMetadata.hunterTiers?.enabled) {
    const tiers = updatedMetadata.hunterTiers.tiers.sort(
      (a, b) => b.requiredReferrals - a.requiredReferrals
    );
    
    // Find the highest tier the hunter qualifies for
    for (const tier of tiers) {
      if (
        hunter.successfulReferrals >= tier.requiredReferrals &&
        hunter.successRate >= tier.requiredSuccessRate
      ) {
        hunter.currentTier = tier.level;
        break;
      }
    }
    
    // Calculate progress to next tier
    const currentTierIndex = tiers.findIndex(t => t.level === hunter.currentTier);
    if (currentTierIndex > 0) {
      const nextTier = tiers[currentTierIndex - 1];
      const currentTier = tiers[currentTierIndex];
      
      const referralProgress = Math.min(
        (hunter.successfulReferrals - currentTier.requiredReferrals) / 
        (nextTier.requiredReferrals - currentTier.requiredReferrals),
        1
      ) * 100;
      
      const rateProgress = Math.min(
        (hunter.successRate - currentTier.requiredSuccessRate) / 
        (nextTier.requiredSuccessRate - currentTier.requiredSuccessRate),
        1
      ) * 100;
      
      // Progress is the average of referral and rate progress
      hunter.tierProgress = (referralProgress + rateProgress) / 2;
    } else {
      // Already at highest tier
      hunter.tierProgress = 100;
    }
    
    // Update reward multiplier
    hunter.rewardMultiplier = calculateRewardMultiplier(updatedMetadata, hunterAddress);
  }
  
  // Update timestamp
  hunter.lastUpdated = Math.floor(Date.now() / 1000);
  
  return updatedMetadata;
}

/**
 * Get hunter tier information with progress details
 * @param bountyMetadata The bounty metadata
 * @param hunterAddress The address of the hunter
 * @returns Hunter tier information with progress details
 */
export function getHunterTierInfo(
  bountyMetadata: BountyMetadata,
  hunterAddress: string
) {
  if (!bountyMetadata.hunterTiers?.enabled) {
    return null;
  }
  
  const hunterPerformance = bountyMetadata.hunterPerformance?.[hunterAddress];
  if (!hunterPerformance) {
    // Return default tier if no performance data
    const defaultTier = bountyMetadata.hunterTiers.tiers.find(
      t => t.level === bountyMetadata.hunterTiers?.defaultTier
    );
    return {
      currentTier: defaultTier || bountyMetadata.hunterTiers.tiers[0],
      tierProgress: 0,
      nextTier: bountyMetadata.hunterTiers.tiers[1] || null,
      multiplier: 1.0,
      performance: {
        totalReferrals: 0,
        successfulReferrals: 0,
        successRate: 0
      }
    };
  }
  
  // Get current tier details
  const currentTier = bountyMetadata.hunterTiers.tiers.find(
    t => t.level === hunterPerformance.currentTier
  );
  
  // Find next tier if not at highest
  const tierIndex = bountyMetadata.hunterTiers.tiers.findIndex(
    t => t.level === hunterPerformance.currentTier
  );
  
  const nextTier = tierIndex > 0 
    ? bountyMetadata.hunterTiers.tiers[tierIndex - 1] 
    : null;
  
  return {
    currentTier,
    tierProgress: hunterPerformance.tierProgress,
    nextTier,
    multiplier: hunterPerformance.rewardMultiplier,
    performance: {
      totalReferrals: hunterPerformance.totalReferrals,
      successfulReferrals: hunterPerformance.successfulReferrals,
      successRate: hunterPerformance.successRate
    }
  };
}

/**
 * Initialize default hunter tiers for a new bounty
 * @returns Default hunter tier configuration
 */
export function getDefaultHunterTiers() {
  return {
    enabled: true,
    defaultTier: "bronze" as HunterTierLevel,
    tiers: [
      {
        level: "bronze" as HunterTierLevel,
        requiredReferrals: 0,
        requiredSuccessRate: 0,
        rewardMultiplier: 1.0,
        description: "Entry tier for all hunters",
        benefits: ["Standard rewards"]
      },
      {
        level: "silver" as HunterTierLevel,
        requiredReferrals: 5,
        requiredSuccessRate: 60,
        rewardMultiplier: 1.2,
        description: "Established hunters with proven track record",
        benefits: ["20% reward boost", "Priority access to bounties"]
      },
      {
        level: "gold" as HunterTierLevel,
        requiredReferrals: 15,
        requiredSuccessRate: 75,
        rewardMultiplier: 1.5,
        description: "Expert hunters with consistent performance",
        benefits: ["50% reward boost", "Exclusive bounty access", "Early access to new bounties"]
      },
      {
        level: "platinum" as HunterTierLevel,
        requiredReferrals: 30,
        requiredSuccessRate: 90,
        rewardMultiplier: 2.0,
        description: "Elite hunters with exceptional performance",
        benefits: ["Double rewards", "VIP access to all bounties", "Featured on leaderboard"]
      }
    ]
  };
}

/**
 * Initialize default performance multipliers for a new bounty
 * @returns Default performance multiplier configuration
 */
export function getDefaultPerformanceMultipliers(): PerformanceMultipliers {
  return {
    successRate: {
      75: 1.1,
      85: 1.2,
      95: 1.3
    },
    timeToComplete: {
      48: 1.05,
      24: 1.1,
      12: 1.2
    },
    totalCompleted: {
      10: 1.05,
      25: 1.1,
      50: 1.2
    }
  };
}
