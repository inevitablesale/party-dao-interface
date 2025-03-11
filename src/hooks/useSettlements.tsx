
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWalletProvider } from '@/hooks/useWalletProvider';
import { getPartyDetails } from '@/services/partyProtocolService';
import { toast } from '@/hooks/use-toast';
import { uploadToIPFS, getFromIPFS } from '@/services/ipfsService';
import { PARTY_PROTOCOL } from '@/lib/constants';
import { Settlement } from '@/utils/settlementConversion';

export interface SettlementMetrics {
  activeSettlements: number;
  totalInvestors: number;
  totalRaised: string;
  fundingRate: number;
  statusDistribution: {
    active: number;
    funding: number;
    completed: number;
    failed: number;
  };
}

export const useSettlements = () => {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [metrics, setMetrics] = useState<SettlementMetrics>({
    activeSettlements: 0,
    totalInvestors: 0,
    totalRaised: '0',
    fundingRate: 0,
    statusDistribution: {
      active: 0,
      funding: 0,
      completed: 0,
      failed: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getProvider } = useWalletProvider();

  const fetchSettlements = async () => {
    setLoading(true);
    setError(null);
    try {
      const walletProvider = await getProvider();
      const provider = walletProvider.provider;
      
      // For now, we'll use a mock set of settlement addresses
      // In a real implementation, you would fetch these from an event log or registry
      const mockSettlementAddresses = [
        "0x123456789abcdef123456789abcdef123456789a",
        "0x987654321fedcba987654321fedcba987654321f",
        "0xabcdef123456789abcdef123456789abcdef1234"
      ];
      
      const fetchedSettlements: Settlement[] = [];
      let totalPledged = ethers.BigNumber.from(0);
      let uniqueBackers = new Set<string>();
      
      // Fetch details for each settlement
      for (const address of mockSettlementAddresses) {
        try {
          const details = await getPartyDetails(provider, address);
          
          // In a real implementation, you would fetch metadata from IPFS using the URI from the contract
          // For now, we'll use mock data
          const status: 'active' | 'funding' | 'completed' | 'failed' = Math.random() > 0.5 ? 'active' : 'funding';
          const pledgedAmount = ethers.utils.parseEther((Math.random() * 10).toFixed(2));
          const backers = Math.floor(Math.random() * 50) + 1;
          
          totalPledged = totalPledged.add(pledgedAmount);
          
          // Add mock unique backers
          for (let i = 0; i < backers; i++) {
            uniqueBackers.add(`backer-${address}-${i}`);
          }
          
          fetchedSettlements.push({
            id: address,
            name: details.name || 'Unnamed Settlement',
            description: 'A settlement in the wasteland',
            createdAt: new Date().toISOString(),
            creator: 'unknown',
            partyAddress: address,
            crowdfundAddress: `0x${Math.random().toString(16).substring(2, 42)}`,
            status,
            totalPledged: ethers.utils.formatEther(pledgedAmount),
            pledgedAmount: ethers.utils.formatEther(pledgedAmount),
            targetCapital: ethers.utils.formatEther(ethers.utils.parseEther('20')),
            backers,
            backerCount: backers,
            category: Math.random() > 0.5 ? 'Expansion' : 'Infrastructure'
          });
        } catch (err) {
          console.error(`Error fetching settlement ${address}:`, err);
        }
      }
      
      setSettlements(fetchedSettlements);
      
      // Calculate metrics
      const statusCounts = {
        active: fetchedSettlements.filter(s => s.status === 'active').length,
        funding: fetchedSettlements.filter(s => s.status === 'funding').length,
        completed: fetchedSettlements.filter(s => s.status === 'completed').length,
        failed: fetchedSettlements.filter(s => s.status === 'failed').length
      };
      
      setMetrics({
        activeSettlements: fetchedSettlements.length,
        totalInvestors: uniqueBackers.size,
        totalRaised: ethers.utils.formatEther(totalPledged),
        fundingRate: fetchedSettlements.length > 0 ? statusCounts.funding / fetchedSettlements.length * 100 : 0,
        statusDistribution: statusCounts
      });
      
    } catch (err) {
      console.error("Error fetching settlements:", err);
      setError("Failed to fetch settlements data");
      toast({
        title: "Error",
        description: "Failed to fetch settlements data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettlements();
  }, []);

  return { settlements, metrics, loading, error, refetch: fetchSettlements };
};
