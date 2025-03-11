import { Bounty, getBounty } from './bountyService';

export const processBountyReferral = async (
  bountyId: string,
  referrerId: string,
  targetAddress: string
): Promise<{ success: boolean, error?: string }> => {
  try {
    const bounty = await getBounty(bountyId);
    
    if (!bounty) {
      return { success: false, error: "Bounty not found" };
    }
    
    // Check if bounty has enough budget
    const remainingBudgetValue = bounty.remainingBudget !== undefined ? 
      bounty.remainingBudget : 
      (bounty.totalBudget - bounty.usedBudget);
    
    if (remainingBudgetValue < bounty.rewardAmount) {
      return { success: false, error: "Bounty budget depleted" };
    }
    
    // Check if bounty is active
    if (bounty.status !== "active") {
      return { success: false, error: `Bounty is not active (current status: ${bounty.status})` };
    }
    
    // Check if bounty has expired
    const now = Math.floor(Date.now() / 1000);
    if (bounty.expiresAt < now) {
      return { success: false, error: "Bounty has expired" };
    }
    
    // In a real implementation, this would:
    // 1. Record the referral in the database
    // 2. Potentially trigger a smart contract call
    // 3. Update the bounty's used budget and success count
    
    // For now, we'll just simulate success
    console.log(`Processed referral for bounty ${bountyId}: ${referrerId} referred ${targetAddress}`);
    
    return { success: true };
  } catch (error) {
    console.error("Error processing bounty referral:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error processing referral"
    };
  }
};

// Mock data for referrals
const REFERRALS_DATA = [
  {
    id: "ref1",
    bountyId: "b1",
    referrerId: "0xabc123",
    referredAddress: "0xdef456",
    timestamp: Date.now() - 86400000 * 2, // 2 days ago
    status: "completed",
    rewardPaid: true,
    rewardAmount: 5
  },
  {
    id: "ref2",
    bountyId: "b1",
    referrerId: "0xabc123",
    referredAddress: "0xghi789",
    timestamp: Date.now() - 86400000, // 1 day ago
    status: "pending",
    rewardPaid: false,
    rewardAmount: 5
  },
  {
    id: "ref3",
    bountyId: "b2",
    referrerId: "0xjkl012",
    referredAddress: "0xmno345",
    timestamp: Date.now() - 86400000 * 3, // 3 days ago
    status: "completed",
    rewardPaid: true,
    rewardAmount: 10
  }
];

export interface Referral {
  id: string;
  bountyId: string;
  referrerId: string;
  referredAddress: string;
  timestamp: number;
  status: "pending" | "completed" | "rejected";
  rewardPaid: boolean;
  rewardAmount: number;
}

export const getReferralsByBounty = async (bountyId: string): Promise<Referral[]> => {
  // In a real app, this would fetch from an API or blockchain
  return new Promise(resolve => {
    setTimeout(() => {
      const referrals = REFERRALS_DATA.filter(r => r.bountyId === bountyId) as Referral[];
      resolve(referrals);
    }, 500);
  });
};

export const getReferralsByReferrer = async (referrerId: string): Promise<Referral[]> => {
  // In a real app, this would fetch from an API or blockchain
  return new Promise(resolve => {
    setTimeout(() => {
      const referrals = REFERRALS_DATA.filter(r => r.referrerId === referrerId) as Referral[];
      resolve(referrals);
    }, 500);
  });
};

export const getReferral = async (referralId: string): Promise<Referral | null> => {
  // In a real app, this would fetch from an API or blockchain
  return new Promise(resolve => {
    setTimeout(() => {
      const referral = REFERRALS_DATA.find(r => r.id === referralId) as Referral | undefined;
      resolve(referral || null);
    }, 300);
  });
};

export const createReferral = async (
  bountyId: string,
  referrerId: string,
  referredAddress: string
): Promise<{ success: boolean, referralId?: string, error?: string }> => {
  try {
    // Check if the bounty exists and has enough budget
    const result = await processBountyReferral(bountyId, referrerId, referredAddress);
    
    if (!result.success) {
      return result;
    }
    
    // In a real app, this would create a record in the database
    // For now, we'll just create a mock referral
    const newReferral: Referral = {
      id: `ref${Math.floor(Math.random() * 10000)}`,
      bountyId,
      referrerId,
      referredAddress,
      timestamp: Date.now(),
      status: "pending",
      rewardPaid: false,
      rewardAmount: 0 // This would be set based on the bounty
    };
    
    // Add to our mock data
    REFERRALS_DATA.push(newReferral as any);
    
    return { success: true, referralId: newReferral.id };
  } catch (error) {
    console.error("Error creating referral:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error creating referral"
    };
  }
};

export const updateReferralStatus = async (
  referralId: string,
  newStatus: "pending" | "completed" | "rejected"
): Promise<{ success: boolean, error?: string }> => {
  try {
    // In a real app, this would update a record in the database
    const referralIndex = REFERRALS_DATA.findIndex(r => r.id === referralId);
    
    if (referralIndex === -1) {
      return { success: false, error: "Referral not found" };
    }
    
    REFERRALS_DATA[referralIndex].status = newStatus;
    
    // If completed, mark reward as paid
    if (newStatus === "completed") {
      REFERRALS_DATA[referralIndex].rewardPaid = true;
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error updating referral status:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error updating referral status"
    };
  }
};

export const getReferralStats = async (referrerId: string): Promise<{
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
}> => {
  try {
    const referrals = await getReferralsByReferrer(referrerId);
    
    const totalReferrals = referrals.length;
    const completedReferrals = referrals.filter(r => r.status === "completed").length;
    const pendingReferrals = referrals.filter(r => r.status === "pending").length;
    
    const totalEarnings = referrals
      .filter(r => r.status === "completed" && r.rewardPaid)
      .reduce((sum, r) => sum + r.rewardAmount, 0);
    
    const pendingEarnings = referrals
      .filter(r => r.status === "pending")
      .reduce((sum, r) => sum + r.rewardAmount, 0);
    
    return {
      totalReferrals,
      completedReferrals,
      pendingReferrals,
      totalEarnings,
      pendingEarnings
    };
  } catch (error) {
    console.error("Error getting referral stats:", error);
    return {
      totalReferrals: 0,
      completedReferrals: 0,
      pendingReferrals: 0,
      totalEarnings: 0,
      pendingEarnings: 0
    };
  }
};

export const validateReferralCode = async (
  code: string
): Promise<{ valid: boolean, referrerId?: string, bountyId?: string }> => {
  // In a real app, this would validate against a database or blockchain
  // For now, we'll just simulate validation
  
  // Check if the code matches our expected format
  if (!code || typeof code !== 'string') {
    return { valid: false };
  }
  
  // Simple validation - in a real app this would be more robust
  if (code.startsWith("0x") && code.length === 42) {
    // This is just a referrer address
    return { valid: true, referrerId: code };
  }
  
  // Check if it's a bounty-specific referral code
  const parts = code.split('-');
  if (parts.length === 2 && parts[0].startsWith("b") && parts[1].startsWith("0x")) {
    return { valid: true, bountyId: parts[0], referrerId: parts[1] };
  }
  
  return { valid: false };
};
