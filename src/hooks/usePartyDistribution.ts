import { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWalletConnection } from './useWalletConnection';
import { PARTY_GOVERNANCE_ABI } from '../constants/abis';

interface Distribution {
  id: number;
  token: string;
  amount: ethers.BigNumber;
  claimed: boolean;
}

export function usePartyDistribution(partyAddress: string) {
  const { provider, address } = useWalletConnection();
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!provider || !address || !partyAddress) return;

    const loadDistributions = async () => {
      try {
        setLoading(true);
        const contract = new ethers.Contract(partyAddress, PARTY_GOVERNANCE_ABI, provider);
        
        // Get distribution created events
        const filter = contract.filters.DistributionCreated();
        const events = await contract.queryFilter(filter);
        
        const distributionsData = await Promise.all(
          events.map(async (event) => {
            const { distributionId, token, amount } = event.args!;
            const claimed = await contract.hasClaimedDistribution(distributionId, address);
            
            return {
              id: distributionId.toNumber(),
              token,
              amount,
              claimed
            };
          })
        );

        setDistributions(distributionsData);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load distributions');
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    loadDistributions();
  }, [provider, address, partyAddress]);

  const createDistribution = useCallback(async (
    token: string,
    amount: ethers.BigNumber,
    merkleRoot: string,
    distributionData: string
  ) => {
    if (!provider) throw new Error('Provider not available');
    setLoading(true);
    setError(null);

    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(partyAddress, PARTY_GOVERNANCE_ABI, signer);

      const tx = await contract.createDistribution(token, amount, merkleRoot, distributionData);
      const receipt = await tx.wait();

      const event = receipt.events?.find(e => e.event === 'DistributionCreated');
      if (!event) throw new Error('Distribution creation failed');

      return event.args?.distributionId;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create distribution');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [provider, partyAddress]);

  const claimDistribution = useCallback(async (
    distributionId: number,
    amount: ethers.BigNumber,
    merkleProof: string[]
  ) => {
    if (!provider) throw new Error('Provider not available');
    setLoading(true);
    setError(null);

    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(partyAddress, PARTY_GOVERNANCE_ABI, signer);

      const tx = await contract.claim(distributionId, amount, merkleProof);
      await tx.wait();

      // Update local state
      setDistributions(prev => 
        prev.map(dist => 
          dist.id === distributionId ? { ...dist, claimed: true } : dist
        )
      );
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to claim distribution');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [provider, partyAddress]);

  return {
    distributions,
    createDistribution,
    claimDistribution,
    loading,
    error
  };
} 