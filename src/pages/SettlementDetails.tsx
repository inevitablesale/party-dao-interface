
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ResistanceWalletWidget } from "@/components/wallet/ResistanceWalletWidget";
import { ContributionPanel } from "@/components/settlements/ContributionPanel";
import { GovernancePanel } from "@/components/settlements/GovernancePanel";
import { useWalletProvider } from "@/hooks/useWalletProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Zap, Clock, FileText, GavelIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { 
  FACTORY_ADDRESS, 
  FACTORY_ABI 
} from "@/lib/constants";
import { getFromIPFS } from "@/services/ipfsService";
import { ProposalMetadata } from "@/types/proposals";

export default function SettlementDetails() {
  const { partyAddress } = useParams<{ partyAddress: string }>();
  const { toast } = useToast();
  const { primaryWallet } = useDynamicContext();
  const { getProvider } = useWalletProvider();
  const [loading, setLoading] = useState(true);
  const [settlement, setSettlement] = useState<{
    id: string;
    name: string;
    description: string;
    totalRaised: string;
    targetAmount: string;
    backerCount: number;
    remainingTime: string;
    creator: string;
    status: string;
  }>({
    id: "",
    name: "Loading...",
    description: "Loading settlement details...",
    totalRaised: "0",
    targetAmount: "0",
    backerCount: 0,
    remainingTime: "0 days",
    creator: "0x...",
    status: "active"
  });
  
  const [metadata, setMetadata] = useState<ProposalMetadata | null>(null);

  const fetchSettlementData = async () => {
    if (!partyAddress || !primaryWallet) return;
    
    try {
      setLoading(true);
      const walletProvider = await getProvider();
      
      const factoryContract = new ethers.Contract(
        FACTORY_ADDRESS,
        FACTORY_ABI,
        walletProvider.provider
      );
      
      // Fetch proposal data from contract
      const proposalData = await factoryContract.proposals(partyAddress);
      console.log("Proposal data:", proposalData);
      
      // Fetch vote events to count backers
      const voteEvents = await factoryContract.queryFilter(
        factoryContract.filters.ProposalVoted(partyAddress)
      );
      
      // Calculate remaining time
      const currentTime = Math.floor(Date.now() / 1000);
      const votingEnds = proposalData.votingEnds.toNumber();
      const timeRemaining = votingEnds > currentTime ? votingEnds - currentTime : 0;
      const daysRemaining = Math.ceil(timeRemaining / (24 * 60 * 60));
      
      // Fetch metadata from IPFS
      const metadataUri = proposalData.metadataURI;
      let metadata = null;
      if (metadataUri) {
        metadata = await getFromIPFS<ProposalMetadata>(
          metadataUri.replace('ipfs://', ''),
          'proposal'
        );
        setMetadata(metadata);
      }
      
      // Determine status
      let status = "active";
      if (proposalData.totalPledged.gte(proposalData.targetCapital)) {
        status = "completed";
      } else if (votingEnds < currentTime) {
        status = "failed";
      }
      
      setSettlement({
        id: partyAddress,
        name: metadata?.title || proposalData.title,
        description: metadata?.description || "No description available",
        totalRaised: ethers.utils.formatEther(proposalData.totalPledged),
        targetAmount: ethers.utils.formatEther(proposalData.targetCapital),
        backerCount: proposalData.backerCount.toNumber(),
        remainingTime: `${daysRemaining} days`,
        creator: proposalData.creator,
        status
      });
      
    } catch (error) {
      console.error("Error fetching settlement data:", error);
      toast({
        title: "Error Loading Settlement",
        description: "Could not load settlement details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettlementData();
  }, [partyAddress, primaryWallet]);

  const refreshData = () => {
    fetchSettlementData();
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Link 
                to="/settlements" 
                className="text-blue-400 hover:text-blue-300 text-sm mb-2 flex items-center gap-1"
              >
                <span>←</span> All Settlements
              </Link>
              <h1 className="text-4xl font-bold">{settlement.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-sm ${
                settlement.status === 'active' 
                  ? 'bg-green-500/20 text-green-400' 
                  : settlement.status === 'completed'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-red-500/20 text-red-400'
              }`}>
                {settlement.status === 'active' ? 'Active Funding' : 
                 settlement.status === 'completed' ? 'Funding Complete' : 'Funding Failed'}
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent" />
            </div>
          ) : (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-[#111] mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="governance">Governance</TabsTrigger>
                <TabsTrigger value="contributors">Contributors</TabsTrigger>
              </TabsList>
            
              <TabsContent value="overview">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Main content */}
                  <div className="md:col-span-2">
                    <div className="bg-[#111] rounded-xl border border-white/5 p-6 space-y-6">
                      <h2 className="text-xl font-semibold">Settlement Vision</h2>
                      <p className="text-gray-300">{settlement.description}</p>
                      
                      {metadata?.fundingBreakdown && metadata.fundingBreakdown.length > 0 && (
                        <>
                          <Separator className="my-6 bg-white/10" />
                          <h2 className="text-xl font-semibold">Funding Breakdown</h2>
                          <div className="space-y-2">
                            {metadata.fundingBreakdown.map((item, index) => (
                              <div key={index} className="flex justify-between">
                                <span className="text-gray-400">{item.category}</span>
                                <span className="font-mono">{item.amount} ETH</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      
                      <Separator className="my-6 bg-white/10" />
                      
                      <h2 className="text-xl font-semibold">Funding Progress</h2>
                      <div className="bg-black/50 h-4 w-full rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-500 h-full rounded-full" 
                          style={{ 
                            width: `${Math.min(
                              100, 
                              (parseFloat(settlement.totalRaised) / parseFloat(settlement.targetAmount)) * 100
                            )}%` 
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>{settlement.totalRaised} ETH raised</span>
                        <span>Target: {settlement.targetAmount} ETH</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="bg-[#0a1020] p-4 rounded-xl">
                          <div className="flex items-center gap-2 text-blue-400 mb-2">
                            <Users className="w-4 h-4" />
                            <span className="text-sm">Backers</span>
                          </div>
                          <span className="text-2xl font-bold">{settlement.backerCount}</span>
                        </div>
                        
                        <div className="bg-[#0a1020] p-4 rounded-xl">
                          <div className="flex items-center gap-2 text-blue-400 mb-2">
                            <Zap className="w-4 h-4" />
                            <span className="text-sm">Progress</span>
                          </div>
                          <span className="text-2xl font-bold">
                            {Math.round((parseFloat(settlement.totalRaised) / parseFloat(settlement.targetAmount)) * 100)}%
                          </span>
                        </div>
                        
                        <div className="bg-[#0a1020] p-4 rounded-xl">
                          <div className="flex items-center gap-2 text-blue-400 mb-2">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">Remaining</span>
                          </div>
                          <span className="text-2xl font-bold">{settlement.remainingTime}</span>
                        </div>
                      </div>
                      
                      {metadata?.team && metadata.team.length > 0 && (
                        <>
                          <Separator className="my-6 bg-white/10" />
                          <h2 className="text-xl font-semibold">Settlement Team</h2>
                          <div className="grid grid-cols-2 gap-4">
                            {metadata.team.map((member, index) => (
                              <div key={index} className="bg-[#0a1020] p-4 rounded-xl">
                                <h3 className="font-medium">{member.name}</h3>
                                <p className="text-gray-400 text-sm">{member.role}</p>
                                <div className="flex gap-2 mt-2">
                                  {member.linkedin && (
                                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs">
                                      LinkedIn
                                    </a>
                                  )}
                                  {member.github && (
                                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs">
                                      GitHub
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Sidebar */}
                  <div>
                    <ContributionPanel 
                      settlementId={partyAddress || ''} 
                      settlementName={settlement.name}
                      onSuccess={refreshData}
                    />
                    
                    {metadata?.socials && (
                      <div className="bg-[#111] rounded-xl border border-white/5 p-6 space-y-4 mt-6">
                        <h2 className="text-lg font-semibold">Connect</h2>
                        <div className="grid grid-cols-2 gap-2">
                          {metadata.socials.twitter && (
                            <a 
                              href={metadata.socials.twitter} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="bg-[#0a1020] p-2 rounded-lg text-center text-sm text-blue-400 hover:bg-[#0a1030]"
                            >
                              Twitter
                            </a>
                          )}
                          {metadata.socials.discord && (
                            <a 
                              href={metadata.socials.discord} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="bg-[#0a1020] p-2 rounded-lg text-center text-sm text-blue-400 hover:bg-[#0a1030]"
                            >
                              Discord
                            </a>
                          )}
                          {metadata.socials.telegram && (
                            <a 
                              href={metadata.socials.telegram} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="bg-[#0a1020] p-2 rounded-lg text-center text-sm text-blue-400 hover:bg-[#0a1030]"
                            >
                              Telegram
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="governance">
                <GovernancePanel 
                  partyAddress={partyAddress || ''}
                  isHost={settlement.creator.toLowerCase() === primaryWallet?.address?.toLowerCase()}
                />
              </TabsContent>
              
              <TabsContent value="contributors">
                <div className="bg-[#111] rounded-xl border border-white/5 p-6 space-y-6">
                  <h2 className="text-xl font-semibold">Settlement Contributors</h2>
                  
                  {settlement.backerCount === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                      <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p>No contributors yet. Be the first to support this settlement!</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* In a real implementation, you would fetch and display actual contributors */}
                      {Array.from({ length: settlement.backerCount }).map((_, index) => (
                        <div key={index} className="bg-[#0a1020] p-4 rounded-xl flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <div className="font-medium">Sentinel #{index + 1}</div>
                            <div className="text-sm text-gray-400">Contributed {(Math.random() * 5).toFixed(2)} ETH</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
      <ResistanceWalletWidget />
    </div>
  );
}
