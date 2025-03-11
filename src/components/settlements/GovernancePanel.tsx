import { useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Check, X, FileText, ShieldCheck, Clock, LucideVote } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  createGovernanceProposal, 
  voteOnGovernanceProposal, 
  executeGovernanceProposal, 
  GovernanceProposal 
} from "@/services/partyProtocolService";
import { ProposalForm } from "./ProposalForm";
import { ProposalCard } from "./ProposalCard";
import { VotingPowerDisplay } from "./VotingPowerDisplay";
import { useProposals } from "@/hooks/useProposals";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useVotingPower } from "@/hooks/useVotingPower";
import { ProposalStatus } from "@/types/content";

export const GovernancePanel = ({ 
  partyAddress, 
  isHost = false 
}: { 
  partyAddress: string;
  isHost?: boolean;
}) => {
  const { toast } = useToast();
  const { primaryWallet } = useDynamicContext();
  const { isConnected, connect } = useWalletConnection();
  const [showForm, setShowForm] = useState(false);
  const { data: proposals = [], isLoading, refetch } = useProposals(partyAddress);
  const { canPropose, canExecute: hasExecutionPower } = useVotingPower();

  const handleProposalSubmit = async (proposal: GovernanceProposal) => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a proposal.",
        variant: "destructive"
      });
      connect();
      return;
    }
    
    if (!primaryWallet) {
      return;
    }
    
    try {
      toast({
        title: "Creating Proposal",
        description: "Please confirm the transaction in your wallet.",
      });
      
      const proposalId = await createGovernanceProposal(
        primaryWallet,
        partyAddress,
        proposal
      );
      
      toast({
        title: "Proposal Created",
        description: `Your proposal has been created with ID ${proposalId}`,
      });
      
      setShowForm(false);
      refetch();
    } catch (error: any) {
      console.error("Error creating proposal:", error);
      toast({
        title: "Error Creating Proposal",
        description: error.message || "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const handleVote = async (proposalId: string, support: boolean) => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to vote.",
        variant: "destructive"
      });
      connect();
      return;
    }
    
    if (!primaryWallet) {
      return;
    }
    
    try {
      toast({
        title: "Submitting Vote",
        description: "Please confirm the transaction in your wallet.",
      });
      
      await voteOnGovernanceProposal(
        primaryWallet,
        partyAddress,
        proposalId,
        support
      );
      
      toast({
        title: "Vote Submitted",
        description: `Your vote has been recorded.`,
      });
      
      refetch();
    } catch (error: any) {
      console.error("Error voting on proposal:", error);
      toast({
        title: "Error Submitting Vote",
        description: error.message || "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const handleExecute = async (proposalId: string, proposal: GovernanceProposal) => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to execute this proposal.",
        variant: "destructive"
      });
      connect();
      return;
    }
    
    if (!primaryWallet) {
      return;
    }
    
    try {
      toast({
        title: "Executing Proposal",
        description: "Please confirm the transaction in your wallet.",
      });
      
      await executeGovernanceProposal(
        primaryWallet,
        partyAddress,
        proposalId,
        proposal
      );
      
      toast({
        title: "Proposal Executed",
        description: `The proposal has been executed successfully.`,
      });
      
      refetch();
    } catch (error: any) {
      console.error("Error executing proposal:", error);
      toast({
        title: "Error Executing Proposal",
        description: error.message || "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-[#111] rounded-xl border border-white/5 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Settlement Governance</h2>
        {!showForm && (
          <Button 
            onClick={() => {
              if (!isConnected) {
                toast({
                  title: "Wallet Not Connected",
                  description: "Please connect your wallet to create a proposal.",
                });
                connect();
                return;
              }
              
              if (!canPropose) {
                toast({
                  title: "Insufficient Voting Power",
                  description: "You need more voting power to create proposals. Sentinels can always create proposals, while others need at least 2 NFTs.",
                  variant: "destructive"
                });
                return;
              }
              
              setShowForm(true);
            }}
            className="bg-blue-500 hover:bg-blue-600 gap-2"
          >
            <Plus className="w-4 h-4" />
            New Proposal
          </Button>
        )}
      </div>
      
      {isConnected && !showForm && (
        <div className="mb-6">
          <VotingPowerDisplay />
        </div>
      )}
      
      {showForm ? (
        <div className="space-y-4">
          <ProposalForm 
            onSubmit={handleProposalSubmit} 
            onCancel={() => setShowForm(false)}
          />
        </div>
      ) : (
        <div>
          <Tabs defaultValue="active">
            <TabsList className="bg-black/40 border border-white/10">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="passed">Passed</TabsTrigger>
              <TabsTrigger value="ready">Ready</TabsTrigger>
              <TabsTrigger value="executed">Executed</TabsTrigger>
              <TabsTrigger value="defeated">Failed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-4 mt-4">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
                </div>
              ) : proposals.filter(p => p.status === 'active').length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>No active proposals</p>
                </div>
              ) : (
                proposals
                  .filter(p => p.status === 'active')
                  .map(proposal => (
                    <ProposalCard 
                      key={proposal.id}
                      proposal={proposal}
                      onVote={handleVote}
                      onExecute={handleExecute}
                      canExecute={false}
                    />
                  ))
              )}
            </TabsContent>
            
            <TabsContent value="passed" className="space-y-4 mt-4">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
                </div>
              ) : proposals.filter(p => p.status === 'passed').length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Check className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>No passed proposals</p>
                </div>
              ) : (
                proposals
                  .filter(p => p.status === 'passed')
                  .map(proposal => (
                    <ProposalCard 
                      key={proposal.id}
                      proposal={proposal}
                      onVote={handleVote}
                      onExecute={handleExecute}
                      canExecute={false}
                    />
                  ))
              )}
            </TabsContent>
            
            <TabsContent value="ready" className="space-y-4 mt-4">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
                </div>
              ) : proposals.filter(p => p.status === 'ready').length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Clock className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>No ready proposals</p>
                </div>
              ) : (
                proposals
                  .filter(p => p.status === 'ready')
                  .map(proposal => (
                    <ProposalCard 
                      key={proposal.id}
                      proposal={proposal}
                      onVote={handleVote}
                      onExecute={handleExecute}
                      canExecute={hasExecutionPower}
                    />
                  ))
              )}
            </TabsContent>
            
            <TabsContent value="executed" className="space-y-4 mt-4">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
                </div>
              ) : proposals.filter(p => p.status === 'executed').length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <ShieldCheck className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>No executed proposals</p>
                </div>
              ) : (
                proposals
                  .filter(p => p.status === 'executed')
                  .map(proposal => (
                    <ProposalCard 
                      key={proposal.id}
                      proposal={proposal}
                      onVote={handleVote}
                      onExecute={handleExecute}
                      canExecute={false}
                      showVoting={false}
                    />
                  ))
              )}
            </TabsContent>
            
            <TabsContent value="defeated" className="space-y-4 mt-4">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
                </div>
              ) : proposals.filter(p => p.status === 'defeated' || p.status === 'cancelled' || p.status === 'expired').length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <X className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>No failed proposals</p>
                </div>
              ) : (
                proposals
                  .filter(p => p.status === 'defeated' || p.status === 'cancelled' || p.status === 'expired')
                  .map(proposal => (
                    <ProposalCard 
                      key={proposal.id}
                      proposal={proposal}
                      onVote={handleVote}
                      onExecute={handleExecute}
                      canExecute={false}
                      showVoting={false}
                    />
                  ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};
