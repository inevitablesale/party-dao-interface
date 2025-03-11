
import { useQuery } from "@tanstack/react-query";
import { fetchNFTsForAddress, RESISTANCE_NFT_ADDRESS } from "@/services/alchemyService";
import { markTokenAsAirdrop, isTokenAirdrop } from "@/services/nftPurchaseEvents";
import { useToast } from "@/hooks/use-toast";

export interface NFTBalanceResult {
  balance: number;
  nfts: any[];
  purchasedCount?: number;
  airdropCount?: number;
}

export const useNFTBalance = (address?: string) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['nftBalance', address],
    queryFn: async () => {
      if (!address) return { balance: 0, nfts: [] };
      
      try {
        console.log(`Fetching NFTs for address: ${address}`);
        
        // Get NFTs with a single API call
        const nfts = await fetchNFTsForAddress(address);
        
        // Filter for only Resistance NFTs
        const resistanceNfts = nfts.filter(nft => 
          // Additional filtering logic could be added here if needed
          true
        );
        
        // Check which NFTs are airdrops vs purchases
        const categorizedNfts = resistanceNfts.map(nft => ({
          ...nft,
          isAirdrop: isTokenAirdrop(nft.tokenId)
        }));
        
        const purchasedCount = categorizedNfts.filter(nft => !nft.isAirdrop).length;
        const airdropCount = categorizedNfts.filter(nft => nft.isAirdrop).length;
        
        return { 
          balance: categorizedNfts.length, 
          nfts: categorizedNfts,
          purchasedCount,
          airdropCount
        };
      } catch (error) {
        console.error("Error fetching NFT balance:", error);
        toast({
          title: "Error",
          description: "Failed to load NFT data. Please try again.",
          variant: "destructive"
        });
        return { balance: 0, nfts: [] };
      }
    },
    enabled: !!address,
    staleTime: 60000, // Cache results for 1 minute to prevent excessive calls
    refetchOnWindowFocus: false, // Prevent refetching when window regains focus
  });
};

// Utility function to mark a token as an airdrop
export const markNFTAsAirdrop = (tokenId: string) => {
  if (!tokenId) return;
  
  markTokenAsAirdrop(tokenId);
  
  // Show a toast notification
  const { toast } = useToast();
  toast({
    title: "NFT Marked as Airdrop",
    description: `Token ID ${tokenId} has been marked as an airdrop and won't trigger referral rewards.`,
  });
};

// Utility function to check if a token is an airdrop
export const checkIfNFTIsAirdrop = (tokenId: string): boolean => {
  if (!tokenId) return false;
  return isTokenAirdrop(tokenId);
};
