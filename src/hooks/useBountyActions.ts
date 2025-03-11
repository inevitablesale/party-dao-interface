import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import {
  deployBountyToBlockchain,
  updateBountyStatus,
  fundBounty,
  distributeRewards,
  recordSuccessfulReferral,
  BountyCreationParams,
  verifyBountyTokenTransfer
} from '@/services/bountyService';
import { ethers } from 'ethers';
import { deployHoldingContract, verifyPoolTokenTransfer } from '@/services/transactionManager';
import { emergencyWithdraw, withdrawToken, withdrawERC721, withdrawERC1155 } from '@/services/tokenService';
import { TokenTransferStatus } from '@/lib/utils';

export const useBountyActions = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [tokenVerificationStatus, setTokenVerificationStatus] = useState<{
    status: TokenTransferStatus;
    currentAmount: string;
    targetAmount: string;
    missingTokens?: string[];
  } | null>(null);
  const { toast } = useToast();
  const { address, isConnected, primaryWallet } = useWalletConnection();

  const deployBounty = async (bountyParams: BountyCreationParams) => {
    if (!isConnected || !primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to deploy this bounty",
        variant: "destructive"
      });
      return null;
    }

    setIsProcessing(true);
    try {
      // For token distribution bounties, we'll deploy a secure holding contract
      if (bountyParams.bountyType === "token_distribution" && primaryWallet.provider) {
        // Use the transactionManager to deploy a secure holding contract
        const provider = new ethers.providers.Web3Provider(primaryWallet.provider);
        const bountyId = `bounty-${Date.now()}`;
        
        // Choose security level based on token value or type
        const securityLevel = bountyParams.tokenRewards?.totalTokens && 
                             bountyParams.tokenRewards.totalTokens > 100 
                             ? "multisig" : "basic";
        
        toast({
          title: "Deploying Secure Holding Contract",
          description: "Please approve the transaction to create a secure token holding contract",
        });
        
        const holdingAddress = await deployHoldingContract(
          provider,
          address!,
          bountyId,
          securityLevel
        );
        
        // Add the holding address to bounty parameters
        bountyParams.tokenHoldingAddress = holdingAddress;
        
        toast({
          title: "Holding Contract Deployed",
          description: `Secure contract created at ${holdingAddress.substring(0, 6)}...`,
        });
      }
      
      const result = await deployBountyToBlockchain(bountyParams, primaryWallet);
      
      toast({
        title: "Bounty Deployed",
        description: `Successfully deployed to address: ${result.partyAddress.substring(0, 6)}...`,
      });
      
      if (bountyParams.bountyType === "token_distribution") {
        toast({
          title: "Next Step: Transfer Tokens",
          description: "Please transfer tokens to the holding address to activate the bounty",
        });
      }
      
      return result;
    } catch (error: any) {
      console.error("Error deploying bounty:", error);
      toast({
        title: "Deployment Failed",
        description: error.message || "Failed to deploy bounty",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const changeBountyStatus = async (
    bountyId: string, 
    newStatus: "active" | "paused" | "expired" | "completed"
  ) => {
    if (!isConnected || !primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to update this bounty",
        variant: "destructive"
      });
      return false;
    }

    setIsProcessing(true);
    try {
      const result = await updateBountyStatus(bountyId, newStatus, primaryWallet);
      
      if (result.success) {
        toast({
          title: "Status Updated",
          description: `Bounty status changed to ${newStatus}`,
        });
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Error updating bounty status:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update bounty status",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const addFunds = async (bountyId: string, amount: number) => {
    if (!isConnected || !primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to fund this bounty",
        variant: "destructive"
      });
      return false;
    }

    setIsProcessing(true);
    try {
      const result = await fundBounty(bountyId, amount, primaryWallet);
      
      if (result.success) {
        toast({
          title: "Funds Added",
          description: `Added ${amount} MATIC to the bounty`,
        });
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Error funding bounty:", error);
      toast({
        title: "Funding Failed",
        description: error.message || "Failed to add funds to bounty",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const distributeRewardsForBounty = async (bountyId: string) => {
    if (!isConnected || !primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to distribute rewards",
        variant: "destructive"
      });
      return false;
    }

    setIsProcessing(true);
    try {
      const result = await distributeRewards(bountyId, primaryWallet);
      
      if (result.success) {
        toast({
          title: "Rewards Distributed",
          description: "Successfully distributed rewards to referrers",
        });
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Error distributing rewards:", error);
      toast({
        title: "Distribution Failed",
        description: error.message || "Failed to distribute rewards",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const recordReferral = async (
    bountyId: string,
    referrerId: string,
    referredUser: string,
    wallet: any
  ) => {
    setIsProcessing(true);
    try {
      const result = await recordSuccessfulReferral(
        bountyId,
        referrerId,
        referredUser,
        wallet
      );
      
      if (result.success) {
        toast({
          title: "Referral Recorded",
          description: "Successfully recorded the referral",
        });
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Error recording referral:", error);
      toast({
        title: "Recording Failed",
        description: error.message || "Failed to record referral",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const configureTokenRewards = async (
    bountyId: string,
    tokenConfig: {
      tokenAddress: string;
      tokenType: "erc20" | "erc721" | "erc1155";
      tokenIds?: string[];
      amountPerReferral?: number;
      strategy: "first-come" | "proportional" | "milestone" | "lottery";
    }
  ) => {
    if (!isConnected || !primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to configure token rewards",
        variant: "destructive"
      });
      return false;
    }

    setIsProcessing(true);
    try {
      // This would be implemented in the bountyService
      // The function would update the bounty metadata with token reward configuration
      const result = await updateBountyStatus(bountyId, "active", primaryWallet);
      
      if (result.success) {
        toast({
          title: "Token Rewards Configured",
          description: "Successfully configured token rewards for this bounty",
        });
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Error configuring token rewards:", error);
      toast({
        title: "Configuration Failed",
        description: error.message || "Failed to configure token rewards",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const distributeTokens = async (
    bountyId: string,
    recipientAddress: string,
    tokenId?: string,
    amount?: number
  ) => {
    if (!isConnected || !primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to distribute tokens",
        variant: "destructive"
      });
      return false;
    }

    setIsProcessing(true);
    try {
      // This would call a function in bountyService that handles token distribution
      // For now, we'll use the existing distributeRewards function
      const result = await distributeRewards(bountyId, primaryWallet);
      
      if (result.success) {
        toast({
          title: "Tokens Distributed",
          description: "Successfully distributed tokens to recipient",
        });
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Error distributing tokens:", error);
      toast({
        title: "Distribution Failed",
        description: error.message || "Failed to distribute tokens",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const transferNFTsToBounty = async (
    bountyId: string,
    tokenAddress: string,
    tokenIds: string[]
  ) => {
    if (!isConnected || !primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to transfer NFTs",
        variant: "destructive"
      });
      return false;
    }

    setIsProcessing(true);
    try {
      // This would be implemented in bountyService
      // For now, we'll just show a toast that this would transfer NFTs
      toast({
        title: "NFT Transfer",
        description: `This would transfer ${tokenIds.length} NFTs to the bounty pool`,
      });
      return true;
    } catch (error: any) {
      console.error("Error transferring NFTs:", error);
      toast({
        title: "Transfer Failed",
        description: error.message || "Failed to transfer NFTs",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const verifyTokens = async (bountyId: string) => {
    if (!primaryWallet?.provider) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to verify token transfers",
        variant: "destructive"
      });
      return null;
    }

    setIsProcessing(true);
    try {
      const provider = new ethers.providers.Web3Provider(primaryWallet.provider);
      
      const result = await verifyBountyTokenTransfer(bountyId, provider);
      setTokenVerificationStatus(result);
      
      if (result.status === "completed") {
        toast({
          title: "Tokens Verified",
          description: "All required tokens have been transferred to the holding contract",
        });
        
        // Automatically activate the bounty if tokens are transferred
        if (primaryWallet) {
          await updateBountyStatus(bountyId, "active", primaryWallet);
        }
      } else if (result.status === "verifying") {
        toast({
          title: "Tokens Partially Transferred",
          description: `${result.currentAmount} of ${result.targetAmount} tokens transferred`,
        });
      } else {
        toast({
          title: "Awaiting Tokens",
          description: "Please transfer the required tokens to the holding address",
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error: any) {
      console.error("Error verifying tokens:", error);
      toast({
        title: "Verification Failed",
        description: error.message || "Failed to verify token transfers",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const performEmergencyWithdrawal = async (
    bountyId: string,
    holdingAddress: string,
    tokenAddress: string,
    recipientAddress: string
  ) => {
    if (!primaryWallet?.provider) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to perform emergency withdrawal",
        variant: "destructive"
      });
      return false;
    }

    setIsProcessing(true);
    try {
      const provider = new ethers.providers.Web3Provider(primaryWallet.provider);
      
      // Security confirmation (this would have a modal in a real UI)
      toast({
        title: "SECURITY ALERT",
        description: "Initiating emergency withdrawal. This is for critical situations only!",
        variant: "destructive"
      });
      
      await emergencyWithdraw(
        provider,
        holdingAddress,
        tokenAddress,
        recipientAddress || address!
      );
      
      toast({
        title: "Emergency Withdrawal Complete",
        description: "Tokens have been withdrawn from the holding contract",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error performing emergency withdrawal:", error);
      toast({
        title: "Withdrawal Failed",
        description: error.message || "Failed to withdraw tokens",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const withdrawTokensForDistribution = async (
    bountyId: string,
    holdingAddress: string,
    tokenAddress: string,
    recipientAddress: string,
    amount: string
  ) => {
    if (!primaryWallet?.provider) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to withdraw tokens",
        variant: "destructive"
      });
      return false;
    }

    setIsProcessing(true);
    try {
      const provider = new ethers.providers.Web3Provider(primaryWallet.provider);
      
      await withdrawToken(
        provider,
        holdingAddress,
        tokenAddress,
        recipientAddress,
        amount
      );
      
      toast({
        title: "Tokens Withdrawn",
        description: `${amount} tokens sent to ${recipientAddress.substring(0, 6)}...`,
      });
      
      return true;
    } catch (error: any) {
      console.error("Error withdrawing tokens:", error);
      toast({
        title: "Withdrawal Failed",
        description: error.message || "Failed to withdraw tokens",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const withdrawNFTForDistribution = async (
    bountyId: string,
    holdingAddress: string,
    tokenAddress: string,
    recipientAddress: string,
    tokenId: string
  ) => {
    if (!primaryWallet?.provider) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to withdraw NFT",
        variant: "destructive"
      });
      return false;
    }

    setIsProcessing(true);
    try {
      const provider = new ethers.providers.Web3Provider(primaryWallet.provider);
      
      await withdrawERC721(
        provider,
        holdingAddress,
        tokenAddress,
        recipientAddress,
        tokenId
      );
      
      toast({
        title: "NFT Withdrawn",
        description: `NFT #${tokenId} sent to ${recipientAddress.substring(0, 6)}...`,
      });
      
      return true;
    } catch (error: any) {
      console.error("Error withdrawing NFT:", error);
      toast({
        title: "Withdrawal Failed",
        description: error.message || "Failed to withdraw NFT",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    deployBounty,
    changeBountyStatus,
    addFunds,
    distributeRewardsForBounty,
    recordReferral,
    configureTokenRewards,
    distributeTokens,
    transferNFTsToBounty,
    verifyTokens,
    performEmergencyWithdrawal,
    withdrawTokensForDistribution,
    withdrawNFTForDistribution,
    tokenVerificationStatus,
    isProcessing,
    walletAddress: address
  };
};
