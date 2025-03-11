
export interface BountyMetadata {
  contentSchema: string;
  contentType: string;
  title: string;
  content: string;
  metadata: {
    author: string;
    publishedAt: number;
    version: number;
  };
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
  status?: "active" | "paused" | "expired" | "completed" | "awaiting_tokens";
  crowdfundAddress?: string;
  metadataURI?: string;
  holdingAddress?: string;
  tokenTransferStatus?: "not_started" | "awaiting_tokens" | "verifying" | "completed" | "failed";
  
  // Token reward details
  tokenRewards?: TokenDistributionConfig;
  
  // Project information
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
  };
  
  // Hunter performance and tiers
  hunterPerformance?: {
    [hunterAddress: string]: {
      successCount: number;
      failureCount: number;
      averageCompletionTime?: number;
      totalEarnings: number;
      lastActivity: number;
    };
  };
  
  hunterTiers?: {
    enabled: boolean;
    levels: {
      [tier: string]: {
        minSuccessCount: number;
        rewardMultiplier: number;
      };
    };
  };
  
  performanceMultipliers?: {
    baseMultiplier: number;
    tiersEnabled: boolean;
    successCountBonus: number;
    completionTimeBonus: number;
    maxMultiplier: number;
  };
}

export interface TokenDistributionConfig {
  tokenAddress: string;
  tokenType: "erc20" | "erc721" | "erc1155";
  tokenIds?: string[];
  amountPerReferral?: number;
  totalTokens?: number;
  remainingTokens?: number;
  distributionStrategy?: "first-come" | "proportional" | "milestone" | "lottery";
}
