
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToxicButton } from "@/components/ui/toxic-button";
import { Shield, Clock, Users, DollarSign, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getBounties, Bounty } from "@/services/bountyService";

export const SettlementsHistory = () => {
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBounties = async () => {
      try {
        const allBounties = await getBounties('active');
        setBounties(allBounties);
      } catch (error) {
        console.error("Error loading bounties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBounties();
  }, []);

  const handleViewBounty = (id: string) => {
    navigate(`/bounty/${id}`);
  };

  const handleManageBounties = () => {
    navigate('/bounty/management');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-toxic-neon"></div>
      </div>
    );
  }

  if (bounties.length === 0) {
    return (
      <Card className="bg-toxic-dark/40 border border-zinc-800 p-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-toxic-neon/10 flex items-center justify-center">
            <Shield className="w-8 h-8 text-toxic-neon/60" />
          </div>
          <div>
            <h3 className="text-xl font-medium text-white">No Active Bounties</h3>
            <p className="text-zinc-400 max-w-md mx-auto mt-2">
              No active bounties found. Create your first bounty to start growing your network.
            </p>
            <ToxicButton 
              variant="primary"
              className="mt-4"
              onClick={handleManageBounties}
            >
              Manage Bounties
            </ToxicButton>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-medium text-white">Active Bounties</div>
        <Button 
          variant="outline" 
          className="text-toxic-neon border-zinc-700 hover:bg-zinc-800"
          onClick={handleManageBounties}
        >
          Manage All Bounties
        </Button>
      </div>
      
      <div className="space-y-4">
        {bounties.map((bounty) => (
          <Card 
            key={bounty.id} 
            className="bg-toxic-dark/40 border border-toxic-neon/10 hover:border-toxic-neon/40 transition-all duration-300"
          >
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-toxic-neon/10 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-toxic-neon" />
                  </div>
                  <h3 className="text-lg font-medium text-white">{bounty.name}</h3>
                  <div className="ml-2 px-2 py-0.5 text-xs bg-toxic-neon/10 rounded text-toxic-neon">
                    {bounty.rewardAmount} MATIC/referral
                  </div>
                </div>
                
                <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{bounty.description}</p>
                
                <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Expires: {new Date(bounty.expiresAt * 1000).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{bounty.hunterCount} hunters</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{bounty.remainingBudget !== undefined ? bounty.remainingBudget : (bounty.totalBudget - bounty.usedBudget)} MATIC remaining</span>
                  </div>
                </div>
              </div>
              
              <ToxicButton
                variant="secondary"
                className="whitespace-nowrap"
                onClick={() => handleViewBounty(bounty.id)}
              >
                View Details
                <ChevronRight className="w-4 h-4" />
              </ToxicButton>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
