
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { useNFTBalance } from "@/hooks/useNFTBalance";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Shield, Check, ArrowRight, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { executeTransaction } from "@/services/transactionManager";
import { useWalletProvider } from "@/hooks/useWalletProvider";
import { ethers } from "ethers";

const BuyMembershipNFT: React.FC = () => {
  const { isConnected, address } = useCustomWallet();
  const { data: nftBalanceData, isLoading: isLoadingNFT } = useNFTBalance(address);
  const hasMembershipNFT = nftBalanceData && nftBalanceData.balance > 0;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getProvider } = useWalletProvider();
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handleBuyNFT = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to purchase a membership NFT",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsPurchasing(true);
      toast({
        title: "Purchase initiated",
        description: "Preparing your membership NFT transaction...",
      });
      
      const provider = await getProvider();
      const signer = provider.getSigner();
      
      const NFT_CONTRACT_ADDRESS = "0xd3F9cA9d44728611dA7128ec71E40D0314FCE89C";
      
      const mintInterface = ["function mint(address to) external payable"];
      
      const nftContract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        mintInterface,
        signer
      );
      
      const tx = await executeTransaction(
        () => nftContract.mint(address, { value: ethers.utils.parseEther("0") }),
        {
          type: 'erc721_mint',
          description: 'Minting Resistance DAO Membership NFT',
          timeout: 120000,
          maxRetries: 3,
          backoffMs: 5000,
          nftConfig: {
            tokenAddress: NFT_CONTRACT_ADDRESS,
            amount: 1,
            standard: "ERC721",
            name: "DAO Membership NFT"
          }
        },
        provider.provider
      );
      
      toast({
        title: "Purchase successful!",
        description: "Your membership NFT has been minted. Transaction: " + tx.hash.substring(0, 6) + "...",
        variant: "default" 
      });
      
    } catch (error) {
      console.error("NFT purchase error:", error);
      toast({
        title: "Purchase failed",
        description: error.message || "There was an error processing your purchase",
        variant: "destructive"
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const benefits = [
    "Voting rights in DAO governance",
    "Access to exclusive opportunities",
    "Share in platform revenue",
    "Priority access to new features",
    "Earn RD tokens through our referral program",
    "Sponsor projects as an organizer",
    "NFT holder rewards and airdrops"
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300 bg-clip-text text-transparent mb-4">
            Resistance DAO Membership
          </h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto">
            Join our community of innovators and gain exclusive access to governance, rewards, and more.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Card className="bg-black/40 border-blue-500/20 backdrop-blur-sm overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <CardHeader className="pt-6">
                <CardTitle className="text-2xl text-white">DAO Membership NFT</CardTitle>
                <CardDescription className="text-white/70">
                  Your key to the Resistance DAO ecosystem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-950/30 rounded-xl p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-white/70">Price</div>
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-green-400" />
                      <div className="text-2xl font-bold text-white">$50 USDC</div>
                    </div>
                  </div>
                  <div className="text-white/60 text-sm mb-2">
                    Pay with USDC on Polygon network
                  </div>
                  <div className="text-white/60 text-sm bg-blue-900/30 px-3 py-2 rounded-md mt-2 flex items-center">
                    <Check className="w-4 h-4 mr-2 text-blue-400" />
                    Limited supply: Only 10,000 membership NFTs will be minted
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <h3 className="text-white text-lg font-medium mb-2">Membership Benefits</h3>
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="text-green-500 w-5 h-5 mt-0.5 shrink-0" />
                      <span className="text-white/80">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t border-white/10 pt-4">
                {isLoadingNFT ? (
                  <Button disabled className="w-full">Loading...</Button>
                ) : hasMembershipNFT ? (
                  <div className="w-full">
                    <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
                      <Check className="w-5 h-5" />
                      <span>You already own this membership</span>
                    </div>
                    <Button 
                      onClick={() => navigate('/settings')}
                      variant="outline"
                      className="w-full border-green-500/30 text-green-400"
                    >
                      Back to Settings
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={handleBuyNFT}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isPurchasing}
                  >
                    {isPurchasing ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Purchase Membership NFT
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm p-6">
              <h3 className="text-xl font-bold text-white mb-4">Why Join Resistance DAO?</h3>
              <p className="text-white/70 mb-6">
                As a membership NFT holder, you become an integral part of the Resistance DAO ecosystem, 
                with the power to shape its future through governance and receive rewards from the DAO's activities.
                <span className="block mt-2 text-blue-400 font-medium">
                  Your membership includes the Project Creator pass, allowing you to submit fund proposals!
                </span>
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Exclusive Access</h4>
                    <p className="text-white/60 text-sm">Early access to new features and opportunities</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Active Participation</h4>
                    <p className="text-white/60 text-sm">Vote on proposals and help guide the platform's future</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-blue-950/80 to-purple-950/80 border-blue-500/20 backdrop-blur-sm p-6">
              <h3 className="text-xl font-bold text-white mb-2">DAO Treasury Sharing</h3>
              <p className="text-white/70">
                Membership NFT holders receive a proportional share of the DAO's revenue from platform fees, 
                distributed automatically through smart contracts.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyMembershipNFT;
