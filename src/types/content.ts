
export interface IPFSContent {
  contentSchema: string;
  contentType: string;
  title: string;
  content: string;
  metadata: {
    author?: string;
    publishedAt?: number;
    version?: number;
    language?: string;
    tags?: string[];
    coverImage?: string;
    attachments?: string[];
    [key: string]: any;
  };
  [key: string]: any;
}

// Define bounty hunter tiers and performance levels
export type HunterTierLevel = "bronze" | "silver" | "gold" | "platinum";

export interface HunterTier {
  level: HunterTierLevel;
  requiredReferrals: number;
  requiredSuccessRate: number;  // As a percentage (e.g., 80%)
  rewardMultiplier: number;     // e.g., 1.0 for standard, 1.2 for bronze, etc.
  description: string;
  benefits: string[];
}

// Define reward multiplier structure for different performance metrics
export interface PerformanceMultipliers {
  successRate: {[threshold: number]: number};  // e.g., {80: 1.1, 90: 1.2}
  timeToComplete: {[hoursUnder: number]: number};  // e.g., {24: 1.1, 12: 1.2}
  totalCompleted: {[count: number]: number};  // e.g., {10: 1.05, 25: 1.1}
}

// Define Bounty metadata interface for IPFS storage
export interface BountyMetadata extends IPFSContent {
  bountyType: "nft_referral" | "token_referral" | "social_media" | "token_distribution";
  rewardAmount: number;
  totalBudget: number;
  allowPublicHunters: boolean;
  maxReferralsPerHunter: number;
  requireVerification: boolean;
  eligibleNFTs: string[];
  successCriteria: string;
  createdAt: number;
  expiresAt: number;
  crowdfundAddress?: string;
  status?: "active" | "paused" | "expired" | "completed";
  
  // Performance reward settings
  hunterTiers?: {
    enabled: boolean;
    tiers: HunterTier[];
    defaultTier: HunterTierLevel;
  };
  
  performanceMultipliers?: PerformanceMultipliers;
  
  // Leaderboard configuration
  leaderboard?: {
    enabled: boolean;
    displayTopCount: number;
    resetPeriod?: "never" | "weekly" | "monthly" | "quarterly";
    rewards?: {
      top3Multiplier: number;
      top10Multiplier: number;
    }
  };
  
  // New fields for token distribution
  tokenRewards?: {
    tokenAddress: string;
    tokenType: "erc20" | "erc721" | "erc1155";
    tokenIds?: string[];     // For NFTs
    amountPerReferral?: number; // For fungible tokens
    totalTokens?: number;    // Total tokens allocated to the bounty
    decimals?: number;       // For ERC20 tokens
    remainingTokens?: number;
    distributionStrategy?: "first-come" | "proportional" | "milestone" | "lottery";
  };
  
  // Project-specific fields
  projectInfo?: {
    name: string;
    website?: string;
    logoUrl?: string;
    socialLinks?: {
      twitter?: string;
      discord?: string;
      telegram?: string;
      [key: string]: string | undefined;
    };
    launchDate?: number;
    tokenomics?: string;
    whitepaper?: string;
  };
  
  // Tracking and analytics
  analytics?: {
    clicks?: number;
    conversions?: number;
    conversionRate?: number;
    topReferrers?: string[];
    referralsByRegion?: {[region: string]: number};
    [key: string]: any;
  };
  
  // Hunter performance tracking
  hunterPerformance?: {
    [address: string]: {
      totalReferrals: number;
      successfulReferrals: number;
      failedReferrals: number;
      successRate: number;
      totalEarned: number;
      averageCompletionTime: number;
      currentTier: HunterTierLevel;
      tierProgress: number;  // Progress to next tier (0-100%)
      rewardMultiplier: number;
      lastUpdated: number;
    }
  };
}

// Define common status types for referrals
export type ReferralStatus = 'active' | 'claimed' | 'expired' | 'completed' | 'pending' | 'rejected' | 'paid';

// Define governance proposal status types to match Party Protocol
export type ProposalStatus = 'active' | 'passed' | 'ready' | 'executed' | 'cancelled' | 'defeated' | 'expired';

// Token Distribution Types
export interface TokenDistributionConfig {
  tokenAddress: string;
  tokenType: "erc20" | "erc721" | "erc1155";
  tokenIds?: string[];
  amountPerReferral?: number;
  strategy: "first-come" | "proportional" | "milestone" | "lottery";
  requireVerification: boolean;
  verificationMethod?: "manual" | "automatic" | "social" | "onchain";
}

export interface ReferralToken {
  id: string;
  bountyId: string;
  tokenAddress: string;
  tokenId?: string;
  tokenType: "erc20" | "erc721" | "erc1155";
  amount?: number;
  status: "available" | "reserved" | "claimed";
  claimedBy?: string;
  claimedAt?: number;
  transactionHash?: string;
}
