
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useWalletProvider } from "@/hooks/useWalletProvider";
import { useToast } from "@/hooks/use-toast";

interface PartyData {
  id: string;
  name: string;
  description: string;
  totalContributions: string;
  targetAmount: string;
  memberCount: number;
  remainingTime: string;
  creator: string;
  status: "active" | "completed" | "failed";
  memberVotingPower?: string;
  userIsHost: boolean;
  treasury: {
    ethBalance: string;
    tokens: Array<{
      symbol: string;
      address: string;
      balance: string;
    }>;
  };
}

const PARTY_ABI = [
  "function name() external view returns (string)",
  "function crowdfund() external view returns (address)",
  "function getVotingPowerAt(address user, uint40 timestamp) external view returns (uint256)",
  "function getProposalStatus(uint256 proposalId) external view returns (uint8)",
  "function getProposalStateInfo(uint256 proposalId) external view returns (tuple(uint256 values, uint256 proposedBy, uint40 executedAt, bytes data))",
  "function hosts(address) external view returns (bool)",
  "function getVotingPowerOf(address) external view returns (uint256)"
];

const ETH_CROWDFUND_ABI = [
  "function party() external view returns (address)",
  "function totalContributions() external view returns (uint256)",
  "function maxTotalContributions() external view returns (uint256)",
  "function totalMembers() external view returns (uint256)",
  "function expiry() external view returns (uint40)",
  "function creator() external view returns (address)"
];

export const usePartyData = (partyAddress?: string) => {
  const [partyData, setPartyData] = useState<PartyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { primaryWallet } = useDynamicContext();
  const { getProvider } = useWalletProvider();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!partyAddress || !primaryWallet) {
      return;
    }
    
    const fetchPartyData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const walletProvider = await getProvider();
        const provider = walletProvider.provider;
        const userAddress = await provider.getSigner().getAddress();
        
        // Create Party contract instance
        const partyContract = new ethers.Contract(
          partyAddress,
          PARTY_ABI,
          provider
        );
        
        // Get party name
        const name = await partyContract.name();
        
        // Get crowdfund address
        const crowdfundAddress = await partyContract.crowdfund();
        
        // Create Crowdfund contract instance
        const crowdfundContract = new ethers.Contract(
          crowdfundAddress,
          ETH_CROWDFUND_ABI,
          provider
        );
        
        // Get crowdfund data
        const totalContributions = ethers.utils.formatEther(await crowdfundContract.totalContributions());
        const targetAmount = ethers.utils.formatEther(await crowdfundContract.maxTotalContributions());
        const memberCount = (await crowdfundContract.totalMembers()).toNumber();
        const expiry = (await crowdfundContract.expiry()).toNumber();
        const creator = await crowdfundContract.creator();
        
        // Calculate remaining time
        const currentTime = Math.floor(Date.now() / 1000);
        const timeRemaining = expiry > currentTime ? expiry - currentTime : 0;
        const daysRemaining = Math.ceil(timeRemaining / (24 * 60 * 60));
        
        // Check if user is a host
        const isHost = await partyContract.hosts(userAddress);
        
        // Get user's voting power
        let votingPower = "0";
        try {
          const votingPowerBN = await partyContract.getVotingPowerOf(userAddress);
          votingPower = ethers.utils.formatEther(votingPowerBN);
        } catch (err) {
          console.error("Error fetching voting power:", err);
        }
        
        // Determine status
        let status: "active" | "completed" | "failed" = "active";
        if (parseFloat(totalContributions) >= parseFloat(targetAmount)) {
          status = "completed";
        } else if (expiry < currentTime) {
          status = "failed";
        }
        
        // Get ETH balance of party
        const ethBalance = ethers.utils.formatEther(
          await provider.getBalance(partyAddress)
        );
        
        setPartyData({
          id: partyAddress,
          name,
          description: "Settlement managed by Party Protocol",  // Placeholder
          totalContributions,
          targetAmount,
          memberCount,
          remainingTime: `${daysRemaining} days`,
          creator,
          status,
          memberVotingPower: votingPower,
          userIsHost: isHost,
          treasury: {
            ethBalance,
            tokens: []  // Placeholder for token balances
          }
        });
      } catch (err: any) {
        console.error("Error fetching party data:", err);
        setError(err.message || "Failed to fetch party data");
        toast({
          title: "Error Loading Party",
          description: "Could not load party details. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPartyData();
  }, [partyAddress, primaryWallet, getProvider, toast]);
  
  return { data: partyData, loading, error, refresh: () => setLoading(true) };
};
