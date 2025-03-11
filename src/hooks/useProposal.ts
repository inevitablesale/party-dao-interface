
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { ProposalMetadata } from "@/types/proposals";
import { getFromIPFS } from "@/services/ipfsService";
import { FACTORY_ADDRESS, FACTORY_ABI } from "@/lib/constants";

export const useProposal = (tokenId?: string) => {
  return useQuery({
    queryKey: ['proposal', tokenId],
    queryFn: async () => {
      if (!tokenId) throw new Error('No token ID provided');
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
      
      console.log('Fetching proposal data for token ID:', tokenId);
      
      const data = await contract.proposals(tokenId);
      const uri = await contract.tokenURI(tokenId);
      
      if (!uri) throw new Error('No metadata URI found');
      console.log('Fetching metadata from URI:', uri);
      
      const metadata = await getFromIPFS<ProposalMetadata>(uri.replace('ipfs://', ''), 'proposal');

      // Format the totalPledged amount before returning
      return { 
        ...data,
        totalPledged: data.totalPledged ? ethers.utils.formatEther(data.totalPledged) : "0",
        metadata 
      };
    },
    enabled: !!tokenId,
    retry: 2
  });
};
