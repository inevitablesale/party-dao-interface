
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { PartyProposal } from "@/types/proposals";
import { ProposalStatus } from "@/types/content";
import { PARTY_PROTOCOL, PARTY_GOVERNANCE_ABI } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";
import { getFromIPFS } from "@/services/ipfsService";

export const useProposals = (partyAddress?: string) => {
  return useQuery({
    queryKey: ['proposals', partyAddress],
    queryFn: async (): Promise<PartyProposal[]> => {
      if (!partyAddress) return [];
      
      try {
        console.log("Fetching proposals for party:", partyAddress);
        
        // Check if window.ethereum is available (in browser with wallet)
        if (!window.ethereum) {
          throw new Error("No Ethereum provider available");
        }
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(partyAddress, PARTY_GOVERNANCE_ABI, provider);
        
        // Get the total proposal count from the contract
        let proposalCount;
        try {
          proposalCount = await contract.proposalCount();
          console.log(`Found ${proposalCount.toString()} proposals`);
        } catch (error) {
          console.error("Error fetching proposal count:", error);
          throw new Error("The party contract may not be a governance contract or may use a different ABI");
        }
        
        const proposals: PartyProposal[] = [];
        
        // Fetch each proposal's details
        for (let i = 0; i < proposalCount.toNumber(); i++) {
          try {
            const proposalId = await contract.proposals(i);
            console.log(`Fetching details for proposal ID: ${proposalId.toString()}`);
            
            // Get the proposal details
            const proposal = await contract.getProposal(proposalId);
            const proposalStatus = await contract.getProposalStatus(proposalId);
            const votes = await contract.getProposalVotes(proposalId);
            
            // Default proposal info
            let title = "Proposal " + proposalId.toString();
            let description = "";
            
            try {
              // Try to fetch metadata from IPFS if available
              if (proposal.proposalData && proposal.proposalData.metadataUri) {
                const metadataUri = proposal.proposalData.metadataUri;
                console.log("Metadata URI found:", metadataUri);
                
                if (metadataUri && metadataUri.startsWith("ipfs://")) {
                  const ipfsHash = metadataUri.replace("ipfs://", "");
                  console.log("Fetching metadata from IPFS hash:", ipfsHash);
                  
                  try {
                    const metadata = await getFromIPFS(ipfsHash, 'proposal');
                    console.log("IPFS metadata fetched:", metadata);
                    
                    if (metadata) {
                      title = metadata.title || title;
                      description = metadata.description || description;
                    }
                  } catch (ipfsError) {
                    console.error("Error fetching from IPFS:", ipfsError);
                    // Continue with default title and description
                  }
                }
              }
            } catch (metadataError) {
              console.error("Error processing proposal metadata:", metadataError);
              // Continue with default title and description
            }
            
            // Calculate time remaining if the proposal is active
            let timeRemaining = "0 days";
            if (proposal.proposalEndTime) {
              const endTime = proposal.proposalEndTime.toNumber();
              const currentTime = Math.floor(Date.now() / 1000);
              
              if (endTime > currentTime) {
                const remainingSeconds = endTime - currentTime;
                const remainingDays = Math.floor(remainingSeconds / 86400);
                timeRemaining = `${remainingDays} days`;
                if (remainingDays === 0) {
                  const remainingHours = Math.floor(remainingSeconds / 3600);
                  timeRemaining = `${remainingHours} hours`;
                  if (remainingHours === 0) {
                    const remainingMinutes = Math.floor(remainingSeconds / 60);
                    timeRemaining = `${remainingMinutes} minutes`;
                  }
                }
              }
            }
            
            // Get transactions associated with the proposal
            const transactions = [];
            
            if (proposal.proposalData && proposal.proposalData.actions) {
              for (const action of proposal.proposalData.actions) {
                transactions.push({
                  target: action.target,
                  value: ethers.utils.formatEther(action.value || 0),
                  calldata: action.data || "0x",
                  signature: action.signature || ""
                });
              }
            }
            
            const parsedProposal: PartyProposal = {
              id: proposalId.toString(),
              title: title,
              description: description,
              proposer: proposal.proposer || "",
              status: mapContractStatusToUIStatus(proposalStatus),
              votesFor: votes.votesFor ? parseInt(ethers.utils.formatUnits(votes.votesFor, 0)) : 0,
              votesAgainst: votes.votesAgainst ? parseInt(ethers.utils.formatUnits(votes.votesAgainst, 0)) : 0,
              createdAt: proposal.proposalTime ? proposal.proposalTime.toNumber() : Math.floor(Date.now() / 1000) - 86400,
              timeRemaining: timeRemaining,
              transactions: transactions.length > 0 ? transactions : [
                {
                  target: partyAddress,
                  value: "0",
                  calldata: "0x",
                  signature: ""
                }
              ]
            };
            
            proposals.push(parsedProposal);
          } catch (proposalError) {
            console.error(`Error fetching proposal ${i}:`, proposalError);
            toast({
              title: "Error fetching proposal",
              description: `Could not load proposal #${i+1}. Please try again later.`,
              variant: "destructive"
            });
          }
        }
        
        // If no proposals found through contract
        if (proposals.length === 0) {
          throw new Error("No proposals found");
        }
        
        return proposals;
      } catch (error) {
        console.error("Error fetching proposals:", error);
        toast({
          title: "Failed to fetch proposals",
          description: `Could not fetch proposals for party ${partyAddress}`,
          variant: "destructive"
        });
        throw error; // Propagate the error to be handled by react-query
      }
    },
    enabled: !!partyAddress,
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: 2
  });
};

// Map contract status codes to UI status
// These mappings are verified against Party Protocol status codes
// https://github.com/PartyDAO/party-protocol/blob/main/contracts/party/PartyGovernance.sol
function mapContractStatusToUIStatus(statusCode: number): ProposalStatus {
  switch (statusCode) {
    case 0: return "active";    // Voting is in progress
    case 1: return "passed";    // Passed but not yet executable
    case 2: return "ready";     // Ready to be executed
    case 3: return "executed";  // Successfully executed
    case 4: return "cancelled"; // Cancelled by proposer or another mechanism
    case 5: return "defeated";  // Failed to meet voting threshold
    case 6: return "expired";   // Passed but not executed within timeframe
    default: return "active";   // Default fallback
  }
}
