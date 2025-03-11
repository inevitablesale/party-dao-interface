
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { executeTransaction } from "@/services/transactionManager";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FACTORY_ADDRESS } from "@/lib/constants";
import { useWalletProvider } from "@/hooks/useWalletProvider";

interface ContractApprovalStatusProps {
  tokenAddress: string;
  spenderAddress: string;
  amount: string;
  onApprovalComplete?: () => void;
}

export const ContractApprovalStatus = ({
  tokenAddress,
  spenderAddress,
  amount,
  onApprovalComplete
}: ContractApprovalStatusProps) => {
  const [isApproving, setIsApproving] = useState(false);
  const { toast } = useToast();
  const { getProvider } = useWalletProvider();

  const handleApprove = async () => {
    try {
      setIsApproving(true);
      const walletProvider = await getProvider();
      
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ["function approve(address spender, uint256 amount) external returns (bool)"],
        walletProvider.provider.getSigner()
      );

      await executeTransaction(
        () => tokenContract.approve(spenderAddress, amount),
        {
          type: 'erc20_approval',
          description: "Token approval for contract interaction",
          timeout: 60000,
          maxRetries: 2,
          backoffMs: 5000,
          tokenConfig: {
            tokenAddress: tokenAddress,
            spenderAddress: spenderAddress,
            amount: amount,
            isApproval: true
          }
        }
      );

      toast({
        title: "Success",
        description: "Token approval successful",
      });

      onApprovalComplete?.();
    } catch (error: any) {
      console.error("Approval error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to approve token",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleApprove}
        disabled={isApproving}
        className="w-full"
        variant="outline"
      >
        {isApproving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Approving...
          </>
        ) : (
          "Approve Token"
        )}
      </Button>
    </div>
  );
};
