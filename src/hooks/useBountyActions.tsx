
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  deployBountyToBlockchain,
  updateBountyStatus,
  distributeRewards,
  fundBounty
} from "@/services/bountyService";
import { useWalletConnection } from "@/hooks/useWalletConnection";

export function useBountyActions() {
  const [isDeploying, setIsDeploying] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
  const [isDistributing, setIsDistributing] = useState<string | null>(null);
  const [isFunding, setIsFunding] = useState<string | null>(null);
  const { toast } = useToast();
  const { address, isConnected } = useWalletConnection();
  
  // Get the wallet object from the window object if it exists
  const getWallet = () => {
    // This is a simplified approach - in a real app, you'd use a proper wallet provider
    return (window as any).ethereum ? { address, getWalletClient: () => (window as any).ethereum } : null;
  };

  const deployBounty = async (bountyId: string) => {
    const wallet = getWallet();
    
    if (!isConnected || !wallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to deploy a bounty",
        variant: "destructive"
      });
      return null;
    }

    setIsDeploying(bountyId);
    try {
      const result = await deployBountyToBlockchain(bountyId, wallet);
      
      toast({
        title: "Bounty Deployed!",
        description: `Successfully deployed bounty to address: ${result.partyAddress.substring(0, 6)}...${result.partyAddress.substring(38)}`
      });
      
      return result;
    } catch (error) {
      console.error("Error deploying bounty:", error);
      toast({
        title: "Deployment Failed",
        description: error instanceof Error ? error.message : "Failed to deploy bounty to blockchain",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsDeploying(null);
    }
  };

  const changeBountyStatus = async (
    bountyId: string, 
    newStatus: "active" | "paused" | "expired" | "completed"
  ) => {
    const wallet = getWallet();
    
    if (!isConnected || !wallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to update bounty status",
        variant: "destructive"
      });
      return false;
    }

    setIsUpdatingStatus(bountyId);
    try {
      const result = await updateBountyStatus(bountyId, newStatus, wallet);
      
      if (result.success) {
        toast({
          title: "Status Updated",
          description: `Bounty status changed to ${newStatus}`
        });
      } else {
        toast({
          title: "Update Failed",
          description: result.error || "Failed to update bounty status",
          variant: "destructive"
        });
      }
      
      return result.success;
    } catch (error) {
      console.error("Error updating bounty status:", error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update bounty status",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const distributeRewardsForBounty = async (bountyId: string) => {
    const wallet = getWallet();
    
    if (!isConnected || !wallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to distribute rewards",
        variant: "destructive"
      });
      return false;
    }

    setIsDistributing(bountyId);
    try {
      const result = await distributeRewards(bountyId, wallet);
      
      if (result.success) {
        toast({
          title: "Rewards Distributed",
          description: "Successfully distributed rewards to referrers"
        });
      } else {
        toast({
          title: "Distribution Failed",
          description: result.error || "Failed to distribute rewards",
          variant: "destructive"
        });
      }
      
      return result.success;
    } catch (error) {
      console.error("Error distributing rewards:", error);
      toast({
        title: "Distribution Failed",
        description: error instanceof Error ? error.message : "Failed to distribute rewards",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsDistributing(null);
    }
  };

  const addFundsToBounty = async (bountyId: string, amount: number) => {
    const wallet = getWallet();
    
    if (!isConnected || !wallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to add funds",
        variant: "destructive"
      });
      return false;
    }

    setIsFunding(bountyId);
    try {
      const result = await fundBounty(bountyId, amount, wallet);
      
      if (result.success) {
        toast({
          title: "Funds Added",
          description: `Successfully added ${amount} MATIC to the bounty`
        });
      } else {
        toast({
          title: "Funding Failed",
          description: result.error || "Failed to add funds to bounty",
          variant: "destructive"
        });
      }
      
      return result.success;
    } catch (error) {
      console.error("Error adding funds to bounty:", error);
      toast({
        title: "Funding Failed",
        description: error instanceof Error ? error.message : "Failed to add funds to bounty",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsFunding(null);
    }
  };

  return {
    deployBounty,
    changeBountyStatus,
    distributeRewardsForBounty,
    addFundsToBounty,
    isDeploying,
    isUpdatingStatus,
    isDistributing,
    isFunding
  };
}
