
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { ProposalError } from "@/services/errorHandlingService";
import { useWalletProvider } from "./useWalletProvider";

export interface WalletState {
  isConnected: boolean;
  isEthereumWallet: boolean;
  address: string | undefined;
  chainId: number | undefined;
}

export const useDynamicUtils = () => {
  const { primaryWallet, setShowAuthFlow } = useDynamicContext();
  const { toast } = useToast();
  const [isInitializing, setIsInitializing] = useState(true);
  const [isDynamicReady, setIsDynamicReady] = useState(false);
  const { getProvider, validateNetwork } = useWalletProvider();

  const waitForWalletClient = async (attempts = 0, maxAttempts = 3) => {
    if (!primaryWallet) return null;
    
    try {
      console.log(`Attempting to get wallet client (attempt ${attempts + 1}/${maxAttempts})`);
      const walletClient = await primaryWallet.getWalletClient();
      if (walletClient) {
        console.log('Wallet client retrieved successfully');
        return walletClient;
      }
    } catch (error) {
      console.error('Error getting wallet client:', error);
    }

    if (attempts < maxAttempts - 1) {
      console.log('Waiting before next attempt...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      return waitForWalletClient(attempts + 1, maxAttempts);
    }

    return null;
  };

  useEffect(() => {
    const checkInitialization = async () => {
      if (!primaryWallet) {
        setIsInitializing(false);
        setIsDynamicReady(false);
        return;
      }

      try {
        console.log('Checking Dynamic initialization status...');
        const isConnected = await primaryWallet.isConnected();
        
        if (!isConnected) {
          setIsInitializing(false);
          setIsDynamicReady(false);
          return;
        }

        const walletClient = await waitForWalletClient();
        if (!walletClient) {
          console.log('Wallet client not available after retries');
          setIsInitializing(false);
          setIsDynamicReady(false);
          return;
        }

        console.log('Dynamic initialization complete');
        setIsDynamicReady(true);
        setIsInitializing(false);
      } catch (error) {
        console.error('Initialization check failed:', error);
        setIsInitializing(false);
        setIsDynamicReady(false);
      }
    };

    checkInitialization();
  }, [primaryWallet]);

  const getChainId = async (): Promise<number> => {
    if (!isDynamicReady) {
      throw new ProposalError({
        category: 'initialization',
        message: 'Dynamic SDK not ready',
        recoverySteps: ['Please wait for wallet initialization to complete']
      });
    }

    if (!primaryWallet) {
      throw new ProposalError({
        category: 'wallet',
        message: 'No wallet connected',
        recoverySteps: ['Please connect your wallet to continue']
      });
    }

    const { provider } = await getProvider();
    const network = await provider.getNetwork();
    return network.chainId;
  };

  const getWalletState = async (): Promise<WalletState> => {
    if (!primaryWallet) {
      return {
        isConnected: false,
        isEthereumWallet: false,
        address: undefined,
        chainId: undefined
      };
    }

    const connected = await primaryWallet.isConnected();
    const chainId = await getChainId();
    
    return {
      isConnected: connected,
      isEthereumWallet: true,
      address: primaryWallet.address,
      chainId
    };
  };

  const connectWallet = async () => {
    try {
      setIsInitializing(true);
      setShowAuthFlow?.(true);
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  return {
    getWalletState,
    getProvider,
    connectWallet,
    validateNetwork,
    isInitializing,
    isDynamicReady,
    getChainId
  };
};
