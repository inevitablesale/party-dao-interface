
import { useState, useEffect } from "react";
import { usePartyData } from "@/hooks/usePartyData";
import { useToast } from "@/hooks/use-toast";
import { Shield, FileText, Check, X, ChevronRight, AlertTriangle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatEthAmount } from "@/utils/priceCalculator";
import { ethers } from "ethers";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useWalletProvider } from "@/hooks/useWalletProvider";

interface PartyGovernanceProps {
  partyAddress: string;
}

interface Proposal {
  id: number;
  title: string;
  description: string;
  proposer: string;
  status: "active" | "passed" | "executed" | "defeated" | "expired";
  votesFor: string;
  votesAgainst: string;
  createdAt: number;
  executionDeadline: number;
}

export const PartyGovernance = ({ partyAddress }: PartyGovernanceProps) => {
  const { data: partyData, loading } = usePartyData(partyAddress);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loadingProposals, setLoadingProposals] = useState(true);
  const { toast } = useToast();
  const { primaryWallet } = useDynamicContext();
  const { getProvider } = useWalletProvider();
  
  useEffect(() => {
    if (!partyAddress || !primaryWallet) return;
    
    const fetchProposals = async () => {
      try {
        setLoadingProposals(true);
        
        // In a real implementation, this would fetch proposals from the Party contract
        // This is a placeholder with mock proposals
        
        const mockProposals: Proposal[] = [
          {
            id: 1,
            title: "Treasury Management Proposal",
            description: "Allocate 20% of treasury to stablecoin reserves for operational expenses",
            proposer: "0x1234...5678",
            status: "active",
            votesFor: "2.5",
            votesAgainst: "0.5",
            createdAt: Math.floor(Date.now() / 1000) - 86400,
            executionDeadline: Math.floor(Date.now() / 1000) + 172800
          },
          {
            id: 2,
            title: "Community Development Fund",
            description: "Create a fund to support community initiatives and projects",
            proposer: "0x8765...4321",
            status: "passed",
            votesFor: "3.2",
            votesAgainst: "0.8",
            createdAt: Math.floor(Date.now() / 1000) - 172800,
            executionDeadline: Math.floor(Date.now() / 1000) + 86400
          },
          {
            id: 3,
            title: "Partnership with DeFi Protocol",
            description: "Establish strategic partnership with XYZ Protocol for yield generation",
            proposer: "0x5678...1234",
            status: "executed",
            votesFor: "4.0",
            votesAgainst: "0.2",
            createdAt: Math.floor(Date.now() / 1000) - 259200,
            executionDeadline: Math.floor(Date.now() / 1000) - 86400
          }
        ];
        
        setProposals(mockProposals);
      } catch (error) {
        console.error("Error fetching proposals:", error);
        toast({
          title: "Error Loading Proposals",
          description: "Could not load governance proposals. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoadingProposals(false);
      }
    };
    
    fetchProposals();
  }, [partyAddress, primaryWallet, toast]);
  
  const handleVote = async (proposalId: number, support: boolean) => {
    if (!primaryWallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to vote on proposals",
        variant: "destructive"
      });
      return;
    }
    
    try {
      toast({
        title: "Processing Vote...",
        description: "Please approve the transaction in your wallet",
      });
      
      // In a real implementation, this would call the Party contract's vote function
      // This is a placeholder that simulates a successful vote
      
      setTimeout(() => {
        // Update proposals with new vote counts
        setProposals(prevProposals =>
          prevProposals.map(proposal => {
            if (proposal.id === proposalId) {
              const votingPower = partyData?.memberVotingPower || "0.1";
              return {
                ...proposal,
                votesFor: support
                  ? (parseFloat(proposal.votesFor) + parseFloat(votingPower)).toString()
                  : proposal.votesFor,
                votesAgainst: !support
                  ? (parseFloat(proposal.votesAgainst) + parseFloat(votingPower)).toString()
                  : proposal.votesAgainst
              };
            }
            return proposal;
          })
        );
        
        toast({
          title: "Vote Successful",
          description: `You've successfully voted ${support ? "for" : "against"} the proposal`,
        });
      }, 2000);
    } catch (error) {
      console.error("Error voting on proposal:", error);
      toast({
        title: "Voting Failed",
        description: "Could not submit your vote. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleCreateProposal = () => {
    toast({
      title: "Create Proposal",
      description: "Proposal creation is not yet implemented in this demo",
    });
  };
  
  const renderProposalStatus = (status: string) => {
    switch (status) {
      case "active":
        return <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs">Active</span>;
      case "passed":
        return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">Passed</span>;
      case "executed":
        return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">Executed</span>;
      case "defeated":
        return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">Defeated</span>;
      case "expired":
        return <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded text-xs">Expired</span>;
      default:
        return <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded text-xs">Unknown</span>;
    }
  };
  
  if (loading) {
    return (
      <div className="bg-[#111] rounded-xl border border-toxic-neon/30 p-6 animate-pulse">
        <div className="h-6 w-1/3 bg-white/10 rounded mb-4"></div>
        <div className="h-4 w-2/3 bg-white/10 rounded mb-6"></div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white/5 rounded"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!partyData) {
    return (
      <div className="bg-[#111] rounded-xl border border-toxic-neon/30 p-6">
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-yellow-500 opacity-50" />
          <h3 className="text-xl font-medium">Party Data Unavailable</h3>
          <p className="text-gray-400 mt-2">Could not load governance data for this settlement</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="bg-[#111] rounded-xl border border-toxic-neon/30 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-toxic-neon" />
            <h2 className="text-xl font-semibold">Settlement Governance</h2>
          </div>
          
          {partyData.userIsHost && (
            <Button 
              onClick={handleCreateProposal}
              className="bg-toxic-neon text-black hover:bg-toxic-neon/90"
            >
              <FileText className="w-4 h-4 mr-2" />
              Create Proposal
            </Button>
          )}
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-[#0a1020] border-toxic-neon/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Your Voting Power</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{partyData.memberVotingPower || "0"}</div>
              <CardDescription>
                {parseFloat(partyData.memberVotingPower || "0") > 0 
                  ? "You can vote on proposals" 
                  : "No voting power"}
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="bg-[#0a1020] border-toxic-neon/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Treasury Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatEthAmount(parseFloat(partyData.treasury.ethBalance))} ETH</div>
              <CardDescription>Available for governance proposals</CardDescription>
            </CardContent>
          </Card>
          
          <Card className="bg-[#0a1020] border-toxic-neon/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Total Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{partyData.memberCount}</div>
              <CardDescription>Active settlement members</CardDescription>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="active">
          <TabsList className="bg-black/50 mb-4">
            <TabsTrigger value="active">Active Proposals</TabsTrigger>
            <TabsTrigger value="past">Past Proposals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {loadingProposals ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-24 bg-white/5 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {proposals
                  .filter(p => p.status === "active")
                  .map(proposal => (
                    <Card key={proposal.id} className="bg-[#0a1020] border-toxic-neon/10 overflow-hidden">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 p-4">
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-white">{proposal.title}</h3>
                            {renderProposalStatus(proposal.status)}
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{proposal.description}</p>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Proposed by: {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}</span>
                            <span>{Math.floor((Date.now() / 1000 - proposal.createdAt) / 3600)} hours ago</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                            onClick={() => handleVote(proposal.id, true)}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            For ({proposal.votesFor})
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                            onClick={() => handleVote(proposal.id, false)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Against ({proposal.votesAgainst})
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                
                {proposals.filter(p => p.status === "active").length === 0 && (
                  <div className="text-center py-12 bg-[#0a1020] rounded-xl">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-600 opacity-30" />
                    <h3 className="text-lg font-medium">No Active Proposals</h3>
                    <p className="text-gray-400 mt-2">There are currently no active proposals for this settlement</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {loadingProposals ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-white/5 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {proposals
                  .filter(p => p.status !== "active")
                  .map(proposal => (
                    <Card key={proposal.id} className="bg-[#0a1020] border-toxic-neon/10 overflow-hidden">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 p-4">
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-white">{proposal.title}</h3>
                            {renderProposalStatus(proposal.status)}
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{proposal.description}</p>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Proposed by: {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}</span>
                            <span>{Math.floor((Date.now() / 1000 - proposal.createdAt) / 86400)} days ago</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-8">
                          <div className="text-sm">
                            <div className="text-green-400">For: {proposal.votesFor}</div>
                            <div className="text-red-400">Against: {proposal.votesAgainst}</div>
                          </div>
                          
                          <Button variant="ghost" size="icon">
                            <ChevronRight className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                
                {proposals.filter(p => p.status !== "active").length === 0 && (
                  <div className="text-center py-12 bg-[#0a1020] rounded-xl">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-600 opacity-30" />
                    <h3 className="text-lg font-medium">No Past Proposals</h3>
                    <p className="text-gray-400 mt-2">There are no past proposals for this settlement yet</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
