
import { useState, useEffect, useCallback } from 'react';
import { useCustomWallet } from './useCustomWallet';
import { 
  getReferralsByReferrer, 
  createReferral, 
  getSavedReferrerAddress,
  updateReferralWithPurchase,
  ReferralInfo
} from '@/services/referralService';

export function useReferrals() {
  const { address, isConnected } = useCustomWallet();
  const [referrals, setReferrals] = useState<ReferralInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get all referrals for the current user
  const fetchReferrals = useCallback(async () => {
    if (!isConnected || !address) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const userReferrals = await getReferralsByReferrer(address);
      setReferrals(userReferrals);
    } catch (err) {
      console.error('Error fetching referrals:', err);
      setError('Failed to load referrals');
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected]);
  
  // Create a new referral
  const addReferral = useCallback(async (referredAddress: string) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }
    
    try {
      await createReferral(address, referredAddress);
      // Refresh the list
      fetchReferrals();
      return true;
    } catch (err) {
      console.error('Error creating referral:', err);
      throw err;
    }
  }, [address, isConnected, fetchReferrals]);
  
  // Update a referral when NFT is purchased
  const completeReferral = useCallback(async (referredAddress: string) => {
    try {
      const success = await updateReferralWithPurchase(referredAddress);
      if (success) {
        fetchReferrals();
      }
      return success;
    } catch (err) {
      console.error('Error completing referral:', err);
      return false;
    }
  }, [fetchReferrals]);
  
  // Check if a user has a saved referrer
  const getSavedReferrer = useCallback(() => {
    return getSavedReferrerAddress();
  }, []);
  
  // Initial fetch when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      fetchReferrals();
    }
  }, [address, isConnected, fetchReferrals]);
  
  return {
    referrals,
    isLoading,
    error,
    fetchReferrals,
    addReferral,
    completeReferral,
    getSavedReferrer
  };
}
