import { useState } from "react";
import { ThumbsUp, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { ethers } from "ethers";
import { FACTORY_ADDRESS, FACTORY_ABI, RD_TOKEN_ADDRESS } from "@/lib/constants";
import { useWalletProvider } from "@/hooks/useWalletProvider";

interface VotingSectionProps {
  tokenId: string;
  owner: string;
}

export const VotingSection = ({ tokenId, owner }: VotingSectionProps) => {
  const { toast } = useToast();
  const { isConnected, connect } = useWalletConnection();
  const { getProvider } = useWalletProvider();
  const [pledgeAmount, setPledgeAmount] = useState("");
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async () => {
    if (!isConnected) {
      connect();
      return;
    }

    if (!pledgeAmount) {
      toast({
        title: "Enter Commitment Amount",
        description: "Please enter how much RD you want to commit to this proposal",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsVoting(true);
      console.log('Starting commitment recording process...');

      const walletProvider = await getProvider();
      console.log('Got wallet provider');

      const signer = walletProvider.provider.getSigner();
      const userAddress = await signer.getAddress();

      // Initialize contracts
      const rdToken = new ethers.Contract(
        RD_TOKEN_ADDRESS,
        ["function balanceOf(address) view returns (uint256)", "function approve(address spender, uint256 amount) returns (bool)"],
        signer
      );
      const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);

      // Get voting fee
      const votingFee = await factory.VOTING_FEE();
      console.log('Voting fee:', ethers.utils.formatEther(votingFee));

      // Check user's RD balance
      const balance = await rdToken.balanceOf(userAddress);
      if (balance.lt(votingFee)) {
        toast({
          title: "Insufficient RD Balance",
          description: "You need 10 RD to cover the voting fee to record your soft commitment",
          variant: "destructive",
        });
        return;
      }

      // Only approve the voting fee amount
      console.log('Approving voting fee:', ethers.utils.formatEther(votingFee), 'RD');
      const approveTx = await rdToken.approve(FACTORY_ADDRESS, votingFee);
      await approveTx.wait();
      console.log('Voting fee approved');

      // Submit vote with pledge amount (not transferred, just recorded)
      console.log('Recording soft commitment amount:', pledgeAmount, 'RD');
      const voteTx = await factory.vote(tokenId, ethers.utils.parseEther(pledgeAmount), {
        gasLimit: 500000
      });
      
      const receipt = await voteTx.wait();
      console.log('Soft commitment confirmed in block:', receipt.blockNumber);

      toast({
        title: "Soft Commitment Recorded",
        description: `Recorded ${pledgeAmount} RD commitment. Paid 10 RD voting fee.`,
      });

      setPledgeAmount("");
    } catch (error: any) {
      console.error('Error recording commitment:', error);
      
      let errorMessage = "Failed to record your soft commitment. Please try again.";
      if (error.message.includes("Voting fee transfer failed")) {
        errorMessage = "Failed to transfer voting fee. Please ensure you have 10 RD available.";
      }

      toast({
        title: "Error Recording Commitment",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <>
      <div className="text-sm text-gray-400 space-y-1 bg-black/20 rounded-lg p-3 border border-white/5">
        <div>Token ID: {tokenId}</div>
        <div className="truncate">
          Owner: {owner.slice(0, 6)}...{owner.slice(-4)}
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pledgeAmount" className="text-white/60">
            Commitment Amount (RD)
          </Label>
          <Input
            id="pledgeAmount"
            type="number"
            min="0"
            step="0.1"
            value={pledgeAmount}
            onChange={(e) => setPledgeAmount(e.target.value)}
            placeholder="Enter RD amount you want to commit"
            className="bg-black/40 border-white/10 text-white"
          />
          <div className="space-y-1">
            <p className="text-sm text-white/60 flex items-center gap-2">
              <Info className="w-4 h-4" />
              10 RD voting fee will be charged to record your soft commitment
            </p>
            <p className="text-sm text-white/60 flex items-center gap-2 pl-6">
              Your committed amount is a soft commitment and will not be transferred
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-2 bg-teal-900/40 border-teal-500/40 hover:bg-teal-500/20 hover:border-teal-500/40 transition-all duration-300 text-white"
            onClick={handleVote}
            disabled={isVoting}
          >
            <ThumbsUp className="w-5 h-5" />
            {isVoting ? "Recording..." : "Record Commitment"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-2 bg-purple-900/40 border-purple-500/40 hover:bg-purple-500/20 hover:border-purple-500/40 transition-all duration-300 text-white"
            onClick={() => window.location.href = `/marketplace/${tokenId}`}
          >
            <ChevronRight className="w-5 h-5" />
            Learn More
          </Button>
        </div>
      </div>
    </>
  );
};
