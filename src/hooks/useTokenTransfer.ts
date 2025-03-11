
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { TokenTransferStatus } from '@/lib/utils';
import { verifyBountyTokenTransfer } from '@/services/bountyService';
import { useWalletProvider } from '@/hooks/useWalletProvider';
import { useToast } from '@/hooks/use-toast';

interface TokenTransferState {
  status: TokenTransferStatus;
  currentAmount: string;
  targetAmount: string;
  missingTokens: string[];
  progress: number;
  isVerifying: boolean;
}

export function useTokenTransfer(bountyId: string, autoVerifyInterval = 15000) {
  const [state, setState] = useState<TokenTransferState>({
    status: 'awaiting_tokens',
    currentAmount: '0',
    targetAmount: '0',
    missingTokens: [],
    progress: 0,
    isVerifying: false
  });
  
  const { getProvider } = useWalletProvider();
  const { toast } = useToast();
  
  // Calculate progress percentage
  const calculateProgress = (current: string, target: string): number => {
    if (!target || parseFloat(target) <= 0) return 0;
    const percentage = (parseFloat(current) / parseFloat(target)) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };
  
  // Verify token transfer
  const verifyTransfer = async (): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isVerifying: true }));
      
      const { provider } = await getProvider();
      const result = await verifyBountyTokenTransfer(bountyId, provider);
      
      const progress = calculateProgress(result.currentAmount, result.targetAmount);
      
      setState({
        status: result.status,
        currentAmount: result.currentAmount,
        targetAmount: result.targetAmount,
        missingTokens: result.missingTokens || [],
        progress,
        isVerifying: false
      });
      
      return result.status === 'completed';
    } catch (error) {
      console.error("Error verifying token transfer:", error);
      setState(prev => ({ 
        ...prev, 
        status: 'failed',
        isVerifying: false 
      }));
      
      toast({
        title: "Verification Error",
        description: error instanceof Error ? error.message : "Failed to verify token transfer",
        variant: "destructive"
      });
      
      return false;
    }
  };
  
  // Set up auto-verification if enabled
  useEffect(() => {
    // Only auto-verify if we're waiting for tokens or verifying
    if (
      autoVerifyInterval > 0 && 
      (state.status === 'awaiting_tokens' || state.status === 'verifying')
    ) {
      const intervalId = setInterval(async () => {
        const isComplete = await verifyTransfer();
        
        // If verification is complete, clear the interval
        if (isComplete) {
          clearInterval(intervalId);
        }
      }, autoVerifyInterval);
      
      return () => clearInterval(intervalId);
    }
  }, [bountyId, state.status, autoVerifyInterval]);
  
  return {
    ...state,
    verifyTransfer,
    isComplete: state.status === 'completed'
  };
}
