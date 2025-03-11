import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Award, DollarSign, BarChart3, Clock, Target, UserPlus, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToxicButton } from "@/components/ui/toxic-button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getBounties, Bounty, BountyCreationParams } from "@/services/bountyService";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { ResistanceWalletWidget } from "@/components/wallet/ResistanceWalletWidget";
import { useBountyActions } from "@/hooks/useBountyActions";

export default function BountyManagement() {
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [activeBounties, setActiveBounties] = useState<Bounty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { address, primaryWallet, isConnected } = useWalletConnection();
  const { deployBounty, isProcessing } = useBountyActions();

  useEffect(() => {
    const loadBounties = async () => {
      try {
        const allBounties = await getBounties();
        setBounties(allBounties);
        setActiveBounties(allBounties.filter(b => b.status === "active"));
      } catch (error) {
        console.error("Error loading bounties:", error);
        toast({
          title: "Failed to load bounties",
          description: "There was an error loading your bounties. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBounties();
  }, [toast]);

  const handleCreateBounty = () => {
    navigate("/bounty/create");
  };

  const handleViewBounty = (id: string) => {
    navigate(`/bounty/${id}`);
  };

  const handleDeployBounty = async (bounty: Bounty) => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to deploy a bounty",
        variant: "destructive"
      });
      return;
    }
    
    const bountyParams: BountyCreationParams = {
      name: bounty.name,
      description: bounty.description,
      rewardType: "fixed",
      rewardAmount: bounty.rewardAmount,
      totalBudget: bounty.totalBudget,
      duration: Math.floor((bounty.expiresAt - Math.floor(Date.now() / 1000)) / (60 * 60 * 24)),
      maxReferralsPerHunter: bounty.maxReferralsPerHunter,
      allowPublicHunters: bounty.allowPublicHunters,
      requireVerification: bounty.requireVerification,
      eligibleNFTs: bounty.eligibleNFTs,
      successCriteria: "Successful referral completion",
      bountyType: bounty.bountyType
    };

    try {
      const deployResult = await deployBounty(bountyParams);
      
      if (deployResult) {
        const updatedBounties = await getBounties();
        setBounties(updatedBounties);
        setActiveBounties(updatedBounties.filter(b => b.status === "active"));
      }
    } catch (error) {
      console.error("Error deploying bounty:", error);
      toast({
        title: "Deployment Failed",
        description: error instanceof Error ? error.message : "Failed to deploy bounty to blockchain",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-20 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-8 flex-col md:flex-row gap-4">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-toxic-neon/10 text-toxic-neon text-sm mb-3">
                <Target className="w-4 h-4 mr-2" />
                <span>Bounty Command Center</span>
              </div>
              <h1 className="text-4xl font-bold text-white">Manage Bounties</h1>
              <p className="mt-2 text-zinc-400 max-w-xl">
                Create, track, and deploy bounties to incentivize network growth and reward referrers.
              </p>
            </div>
            <ToxicButton variant="primary" onClick={handleCreateBounty}>
              <Plus className="w-5 h-5 mr-2" />
              Create Bounty
            </ToxicButton>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card className="bg-toxic-dark/40 border border-toxic-neon/20 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-toxic-neon/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-toxic-neon" />
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Active Bounties</p>
                  <h3 className="text-2xl font-bold text-white">{activeBounties.length}</h3>
                </div>
              </div>
            </Card>
            <Card className="bg-toxic-dark/40 border border-toxic-neon/20 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-toxic-neon/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-toxic-neon" />
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Total Budget</p>
                  <h3 className="text-2xl font-bold text-white">
                    {bounties.reduce((total, bounty) => total + bounty.totalBudget, 0)} MATIC
                  </h3>
                </div>
              </div>
            </Card>
            <Card className="bg-toxic-dark/40 border border-toxic-neon/20 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-toxic-neon/10 flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-toxic-neon" />
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Total Referrals</p>
                  <h3 className="text-2xl font-bold text-white">
                    {bounties.reduce((total, bounty) => total + bounty.successCount, 0)}
                  </h3>
                </div>
              </div>
            </Card>
          </div>

          {/* Bounties List */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-6">Your Bounties</h2>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-toxic-neon"></div>
              </div>
            ) : bounties.length === 0 ? (
              <Card className="bg-toxic-dark/40 border border-zinc-800 p-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-toxic-neon/10 flex items-center justify-center">
                    <Target className="w-8 h-8 text-toxic-neon/60" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-white">No Bounties Yet</h3>
                    <p className="text-zinc-400 max-w-md mx-auto mt-2">
                      Create your first bounty to start incentivizing referrals and growing your network.
                    </p>
                    <Button 
                      className="mt-4 bg-toxic-neon/20 hover:bg-toxic-neon/30 text-toxic-neon border border-toxic-neon/40"
                      onClick={handleCreateBounty}
                    >
                      <Plus className="w-4 h-4 mr-2" /> Create Your First Bounty
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bounties.map((bounty) => (
                  <Card 
                    key={bounty.id} 
                    className="bg-toxic-dark/40 border border-toxic-neon/20 hover:border-toxic-neon/40 transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-6 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            bounty.status === 'active' ? 'bg-toxic-neon' :
                            bounty.status === 'paused' ? 'bg-orange-400' :
                            bounty.status === 'expired' ? 'bg-red-500' : 'bg-gray-500'
                          }`}></div>
                          <span className="text-xs uppercase text-zinc-400">{bounty.status}</span>
                        </div>
                        <div className="px-2 py-1 text-xs bg-toxic-neon/10 rounded text-toxic-neon font-medium">
                          {bounty.rewardAmount} MATIC/referral
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-2">{bounty.name}</h3>
                      <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{bounty.description}</p>
                      
                      <div className="mt-auto space-y-4">
                        <div className="flex justify-between text-xs text-zinc-400 mb-1">
                          <span>Budget Usage</span>
                          <span>{bounty.usedBudget} / {bounty.totalBudget} MATIC</span>
                        </div>
                        <div className="w-full bg-zinc-800 rounded h-1.5">
                          <div 
                            className="h-full bg-toxic-neon rounded"
                            style={{ width: `${(bounty.usedBudget / bounty.totalBudget) * 100}%` }}
                          ></div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-xs text-zinc-400">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>
                              {new Date(bounty.expiresAt * 1000).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 justify-end">
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>{bounty.successCount} referrals</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 pt-4">
                          <Button
                            variant="outline"
                            className="flex-1 h-10 border-zinc-700 hover:bg-zinc-800 hover:text-white"
                            onClick={() => handleViewBounty(bounty.id)}
                          >
                            View Details
                          </Button>
                          
                          {!bounty.partyAddress && (
                            <ToxicButton
                              variant="primary"
                              className="flex-1 h-10"
                              onClick={() => handleDeployBounty(bounty)}
                              disabled={isProcessing}
                            >
                              {isProcessing ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
                                  Deploying...
                                </>
                              ) : (
                                <>
                                  <Shield className="w-4 h-4 mr-2" />
                                  Deploy
                                </>
                              )}
                            </ToxicButton>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <ResistanceWalletWidget />
    </div>
  );
}
