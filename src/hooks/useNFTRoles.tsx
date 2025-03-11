
import { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useToast } from '@/hooks/use-toast';
import { 
  checkNFTOwnership, 
  fetchNFTsForAddress, 
  getPrimaryRole,
  getAllRoles,
  NFTClass, 
  ResistanceNFT 
} from '@/services/alchemyService';

interface NFTRolesState {
  isLoading: boolean;
  error: Error | null;
  primaryRole: NFTClass;
  isSentinel: boolean;
  isSurvivor: boolean;
  isBountyHunter: boolean;
  nfts: ResistanceNFT[];
  nftsByRole: {
    sentinel: ResistanceNFT[];
    survivor: ResistanceNFT[];
    bountyHunter: ResistanceNFT[];
  };
  refetch: () => Promise<void>;
  hasMultipleRoles: boolean;
}

export const useNFTRoles = (): NFTRolesState => {
  const { primaryWallet } = useDynamicContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [primaryRole, setPrimaryRole] = useState<NFTClass>('Unknown');
  const [nfts, setNfts] = useState<ResistanceNFT[]>([]);
  const [isSentinel, setIsSentinel] = useState(false);
  const [isSurvivor, setIsSurvivor] = useState(false);
  const [isBountyHunter, setIsBountyHunter] = useState(false);
  const [nftsByRole, setNftsByRole] = useState<{
    sentinel: ResistanceNFT[];
    survivor: ResistanceNFT[];
    bountyHunter: ResistanceNFT[];
  }>({
    sentinel: [],
    survivor: [],
    bountyHunter: []
  });
  
  const fetchData = async () => {
    if (!primaryWallet?.address) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch all NFTs
      const fetchedNfts = await fetchNFTsForAddress(primaryWallet.address);
      setNfts(fetchedNfts);
      
      // Sort NFTs by role
      const sentinelNfts = fetchedNfts.filter(nft => nft.class === 'Sentinel');
      const survivorNfts = fetchedNfts.filter(nft => nft.class === 'Survivor');
      const bountyHunterNfts = fetchedNfts.filter(nft => nft.class === 'Bounty Hunter');
      
      setNftsByRole({
        sentinel: sentinelNfts,
        survivor: survivorNfts,
        bountyHunter: bountyHunterNfts
      });
      
      // Get role flags
      const roles = await getAllRoles(primaryWallet.address);
      setIsSentinel(roles.isSentinel);
      setIsSurvivor(roles.isSurvivor);
      setIsBountyHunter(roles.isBountyHunter);
      
      // Determine primary role
      const role = await getPrimaryRole(primaryWallet.address);
      setPrimaryRole(role);
    } catch (err) {
      console.error("Error fetching NFT roles:", err);
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      toast({
        title: "Error fetching NFTs",
        description: "Failed to load your NFT data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [primaryWallet?.address]);

  // Determine if user has multiple roles
  const hasMultipleRoles = 
    (isSentinel ? 1 : 0) + 
    (isSurvivor ? 1 : 0) + 
    (isBountyHunter ? 1 : 0) > 1;

  return {
    isLoading,
    error,
    primaryRole,
    isSentinel,
    isSurvivor,
    isBountyHunter,
    nfts,
    nftsByRole,
    refetch: fetchData,
    hasMultipleRoles
  };
};
