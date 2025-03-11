
import { useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useWalletProvider } from "@/hooks/useWalletProvider";
import { useToast } from "@/hooks/use-toast";
import {
  sentinelContributeToParty,
  createParty,
  createEthCrowdfund,
  verifySurvivorOwnership,
  updateSurvivorMetadata,
  getVotingPower,
  getPartyDetails,
  PartyOptions,
  CrowdfundOptions
} from "@/services/partyProtocolService";
import { ethers } from "ethers";

export const usePartyTransactions = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { primaryWallet } = useDynamicContext();
  const { getProvider } = useWalletProvider();
  const { toast } = useToast();
  
  const contribute = async (
    partyAddress: string,
    amount: string,
    referrer?: string
  ) => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to contribute",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      setIsProcessing(true);
      toast({
        title: "Processing Contribution...",
        description: "Please approve the transaction in your wallet",
      });
      
      const transaction = await sentinelContributeToParty(
        primaryWallet,
        partyAddress,
        amount,
        referrer,
        `Contributing ${amount} ETH to settlement`
      );
      
      toast({
        title: "Contribution Successful",
        description: `You've successfully contributed ${amount} ETH to the settlement`,
      });
      
      return transaction;
    } catch (error: any) {
      console.error("Error contributing to party:", error);
      toast({
        title: "Contribution Failed",
        description: error.message || "Failed to process your contribution",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };
  
  const createSettlement = async (
    partyOptions: PartyOptions,
    crowdfundOptions: CrowdfundOptions,
    metadata: any,
    survivorTokenId?: string
  ) => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to create a settlement",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      setIsProcessing(true);
      toast({
        title: "Creating Settlement...",
        description: "Please approve the transaction to create your settlement",
      });
      
      // Step 1: Create Party
      const partyAddress = await createParty(primaryWallet, partyOptions);
      
      toast({
        title: "Party Created",
        description: "Now setting up the funding mechanism...",
      });
      
      // Step 2: Create Crowdfund
      const crowdfundAddress = await createEthCrowdfund(
        primaryWallet,
        partyAddress,
        crowdfundOptions,
        metadata
      );
      
      // Step 3: Update Survivor NFT metadata if token ID is provided
      if (survivorTokenId) {
        toast({
          title: "Updating NFT Metadata...",
          description: "Linking your Survivor NFT with the new settlement...",
        });
        
        await updateSurvivorMetadata(
          primaryWallet,
          survivorTokenId,
          partyAddress,
          crowdfundAddress,
          metadata
        );
      }
      
      toast({
        title: "Settlement Created",
        description: "Your settlement has been successfully created!",
      });
      
      return { partyAddress, crowdfundAddress };
    } catch (error: any) {
      console.error("Error creating settlement:", error);
      toast({
        title: "Settlement Creation Failed",
        description: error.message || "Failed to create settlement",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };
  
  const checkSurvivorStatus = async (survivorNftAddress: string) => {
    if (!primaryWallet) {
      return { hasNFT: false };
    }
    
    try {
      return await verifySurvivorOwnership(primaryWallet, survivorNftAddress);
    } catch (error) {
      console.error("Error checking survivor status:", error);
      return { hasNFT: false };
    }
  };
  
  const getVotingPowerForUser = async (partyAddress: string, userAddress?: string) => {
    try {
      const { provider } = await getProvider();
      const signerAddress = userAddress || await provider.getSigner().getAddress();
      
      const votingPower = await getVotingPower(
        provider,
        partyAddress,
        signerAddress
      );
      
      return votingPower;
    } catch (error) {
      console.error("Error getting voting power:", error);
      return "0";
    }
  };
  
  const getPartyInfo = async (partyAddress: string) => {
    try {
      const { provider } = await getProvider();
      return await getPartyDetails(provider, partyAddress);
    } catch (error) {
      console.error("Error getting party details:", error);
      return null;
    }
  };
  
  return {
    contribute,
    createSettlement,
    checkSurvivorStatus,
    getVotingPowerForUser,
    getPartyInfo,
    isProcessing
  };
};
