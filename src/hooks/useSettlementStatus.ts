
import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useWalletProvider } from './useWalletProvider';

interface SettlementStatus {
  isActive: boolean;
  isFunded: boolean;
  isFailed: boolean;
  currentFunding: string; // in ETH
  percentageFunded: number;
  totalContributors: number;
  deadline?: Date;
}

export const useSettlementStatus = (settlementAddress?: string) => {
  const { getProvider } = useWalletProvider();
  
  return useQuery({
    queryKey: ['settlementStatus', settlementAddress],
    queryFn: async (): Promise<SettlementStatus> => {
      if (!settlementAddress) {
        throw new Error('Settlement address is required');
      }
      
      try {
        // This would connect to the actual Party Protocol crowdfund contract
        // For now, we're returning mock data
        console.log(`Fetching status for settlement: ${settlementAddress}`);
        
        // Generate predictable but different values based on the settlement address
        const addressSum = settlementAddress
          .toLowerCase()
          .split('')
          .reduce((sum, char) => sum + char.charCodeAt(0), 0);
        
        const mockFundingPercent = (addressSum % 100) + 1; // 1-100
        const mockEthAmount = (addressSum % 500) / 10; // 0-50 ETH with decimal
        const mockContributors = (addressSum % 50) + 1; // 1-50
        
        // Determine status based on funding percentage
        const isActive = mockFundingPercent < 100;
        const isFunded = mockFundingPercent >= 100;
        const isFailed = !isActive && !isFunded;
        
        // Set deadline to 7 days from now for active settlements
        const deadline = isActive ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : undefined;
        
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        
        return {
          isActive,
          isFunded,
          isFailed,
          currentFunding: mockEthAmount.toFixed(2),
          percentageFunded: mockFundingPercent,
          totalContributors: mockContributors,
          deadline
        };
      } catch (error) {
        console.error("Error fetching settlement status:", error);
        throw error;
      }
    },
    enabled: !!settlementAddress,
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // 5 minutes
  });
};
