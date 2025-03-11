
import { useQuery } from '@tanstack/react-query';

interface ProposalStats {
  totalHolders: number;
  activeProposals: number;
  successRate: number;
  totalLockedValue: number;
}

export const useProposalStats = (settlementId?: string) => {
  return useQuery({
    queryKey: ['proposalStats', settlementId],
    queryFn: async (): Promise<ProposalStats> => {
      // In a real implementation, this would fetch data from a blockchain or API
      // For now, we'll return mock data that varies slightly based on the settlement ID
      
      // Use settlement ID to create deterministic but different values
      const idHash = settlementId ? 
        settlementId.split('').reduce((a, b) => a + b.charCodeAt(0), 0) : 0;
      
      const baseHolders = 25;
      const baseProposals = 4;
      const baseSuccessRate = 75;
      const baseTotalValue = 150000;
      
      // Add some variation based on the ID hash
      const totalHolders = baseHolders + (idHash % 20);
      const activeProposals = baseProposals + (idHash % 5);
      const successRate = Math.min(100, baseSuccessRate + (idHash % 20));
      const totalLockedValue = baseTotalValue + (idHash * 1000);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        totalHolders,
        activeProposals,
        successRate,
        totalLockedValue
      };
    },
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // 5 minutes
  });
};
