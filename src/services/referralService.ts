import { ReferralStatus } from '@/types/content';

export interface ReferralInfo {
  id: string;
  referrerAddress: string;
  referredAddress: string;
  referralDate: string;
  nftPurchased: boolean;
  purchaseDate?: string;
  paymentProcessed: boolean;
  paymentDate?: string;
  paymentAmount?: number;
  paymentTxHash?: string;
  status: ReferralStatus;
}

// Generate a unique ID for new referrals
const generateId = (): string => {
  return `ref-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

// Store a new referral relationship
export const createReferral = async (referrerAddress: string, referredAddress: string): Promise<ReferralInfo> => {
  try {
    // Check if referral already exists to prevent duplicates
    const existingReferrals = await getReferralsByReferrer(referrerAddress);
    const alreadyExists = existingReferrals.some(ref => ref.referredAddress === referredAddress);
    
    if (alreadyExists) {
      throw new Error('This wallet has already been referred by you');
    }
    
    const currentDate = new Date().toISOString();
    const newReferral: ReferralInfo = {
      id: generateId(),
      referrerAddress,
      referredAddress,
      referralDate: currentDate,
      nftPurchased: false,
      paymentProcessed: false,
      status: 'active'
    };
    
    // Get existing referrals for this referrer
    const storedReferrals = localStorage.getItem(`referrals_${referrerAddress}`);
    const referrals: ReferralInfo[] = storedReferrals ? JSON.parse(storedReferrals) : [];
    
    // Add the new referral and save back to localStorage
    referrals.push(newReferral);
    localStorage.setItem(`referrals_${referrerAddress}`, JSON.stringify(referrals));
    
    console.log("Created new referral:", newReferral);
    return newReferral;
  } catch (error) {
    console.error("Error creating referral:", error);
    throw error;
  }
};

// Get all referrals for a specific referrer
export const getReferralsByReferrer = async (referrerAddress: string): Promise<ReferralInfo[]> => {
  try {
    const storedReferrals = localStorage.getItem(`referrals_${referrerAddress}`);
    return storedReferrals ? JSON.parse(storedReferrals) : [];
  } catch (error) {
    console.error("Error fetching referrals:", error);
    return [];
  }
};

// Get all referrals for a specific referred address
export const getReferralsByReferred = async (referredAddress: string): Promise<ReferralInfo[]> => {
  try {
    // This is inefficient in localStorage but works for demo purposes
    // We'd need to iterate through all referrer keys to find matches
    const allReferrals: ReferralInfo[] = [];
    
    // Get all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('referrals_')) {
        const referrerReferrals: ReferralInfo[] = JSON.parse(localStorage.getItem(key) || '[]');
        const matchingReferrals = referrerReferrals.filter(ref => ref.referredAddress === referredAddress);
        allReferrals.push(...matchingReferrals);
      }
    }
    
    return allReferrals;
  } catch (error) {
    console.error("Error fetching referrals for referred:", error);
    return [];
  }
};

// Update referral when NFT is purchased
export const updateReferralWithPurchase = async (referredAddress: string): Promise<boolean> => {
  try {
    const referrals = await getReferralsByReferred(referredAddress);
    
    if (referrals.length === 0) {
      console.log("No referral found for this address");
      return false;
    }
    
    // Update the first valid referral found
    const referral = referrals[0];
    const currentDate = new Date().toISOString();
    
    referral.nftPurchased = true;
    referral.purchaseDate = currentDate;
    referral.status = 'claimed';
    referral.paymentAmount = 20; // Update to $20 reward
    
    // Update the referral in localStorage
    const referrerKey = `referrals_${referral.referrerAddress}`;
    const referrerReferrals: ReferralInfo[] = JSON.parse(localStorage.getItem(referrerKey) || '[]');
    
    const updatedReferrals = referrerReferrals.map(ref => 
      ref.id === referral.id ? referral : ref
    );
    
    localStorage.setItem(referrerKey, JSON.stringify(updatedReferrals));
    
    console.log("Updated referral with purchase:", referral);
    return true;
  } catch (error) {
    console.error("Error updating referral with purchase:", error);
    return false;
  }
};

// Update referral when payment is processed
export const updateReferralWithPayment = async (
  referralId: string, 
  paymentAmount: number, 
  paymentTxHash: string
): Promise<boolean> => {
  try {
    // Search through all referrer's referrals to find the matching ID
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('referrals_')) {
        const referrerReferrals: ReferralInfo[] = JSON.parse(localStorage.getItem(key) || '[]');
        const referralIndex = referrerReferrals.findIndex(ref => ref.id === referralId);
        
        if (referralIndex !== -1) {
          const currentDate = new Date().toISOString();
          referrerReferrals[referralIndex].paymentProcessed = true;
          referrerReferrals[referralIndex].paymentDate = currentDate;
          referrerReferrals[referralIndex].paymentAmount = paymentAmount;
          referrerReferrals[referralIndex].paymentTxHash = paymentTxHash;
          referrerReferrals[referralIndex].status = 'completed';
          
          localStorage.setItem(key, JSON.stringify(referrerReferrals));
          return true;
        }
      }
    }
    
    console.log("No referral found with ID:", referralId);
    return false;
  } catch (error) {
    console.error("Error updating referral with payment:", error);
    return false;
  }
};

// Get active referral for a referred address
export const getActiveReferral = async (referredAddress: string): Promise<ReferralInfo | null> => {
  try {
    const referrals = await getReferralsByReferred(referredAddress);
    
    // Return the most recent active or claimed referral
    const validReferrals = referrals.filter(
      ref => ref.status === 'active' || ref.status === 'claimed'
    );
    
    if (validReferrals.length === 0) {
      return null;
    }
    
    // Sort by date (most recent first) and return the first one
    validReferrals.sort((a, b) => 
      new Date(b.referralDate).getTime() - new Date(a.referralDate).getTime()
    );
    
    return validReferrals[0];
  } catch (error) {
    console.error("Error getting active referral:", error);
    return null;
  }
};

// Check if a referral has expired (optional feature for future)
export const checkIfReferralExpired = async (referralId: string): Promise<boolean> => {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('referrals_')) {
        const referrerReferrals: ReferralInfo[] = JSON.parse(localStorage.getItem(key) || '[]');
        const referral = referrerReferrals.find(ref => ref.id === referralId);
        
        if (referral) {
          // Example: Check if referral is older than 30 days
          const referralDate = new Date(referral.referralDate);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - referralDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays > 30 && referral.status === 'active') {
            // Update the referral status to expired
            referral.status = 'expired';
            
            // Save the updated referral
            const updatedReferrals = referrerReferrals.map(ref => 
              ref.id === referralId ? referral : ref
            );
            
            localStorage.setItem(key, JSON.stringify(updatedReferrals));
            return true;
          }
          
          return referral.status === 'expired';
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error checking if referral expired:", error);
    return false;
  }
};

// Helper function: store referrer address for non-connected users
export const storeReferrerAddress = (referrerAddress: string): void => {
  if (referrerAddress && referrerAddress.length > 0) {
    localStorage.setItem("referrer_address", referrerAddress);
    console.log("Stored referrer address:", referrerAddress);
  }
};

// Helper function: get the saved referrer address for a user
export const getSavedReferrerAddress = (): string | null => {
  return localStorage.getItem("referrer_address");
};

// Helper function: clear referrer association
export const clearReferrerAddress = (): void => {
  localStorage.removeItem("referrer_address");
};
