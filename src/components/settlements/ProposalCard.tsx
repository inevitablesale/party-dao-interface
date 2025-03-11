
import { useState } from "react";
import { format } from "date-fns";
import { CheckCircle, XCircle, Clock, ArrowRight, ChevronDown, ChevronUp, ExternalLink, User, Check, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PartyProposal } from "@/types/proposals";
import { ProposalStatus } from "@/types/content";

export const ProposalCard = ({ 
  proposal, 
  onVote, 
  onExecute,
  canExecute = false,
  showVoting = true
}: { 
  proposal: PartyProposal;
  onVote: (proposalId: string, support: boolean) => Promise<void>;
  onExecute: (proposalId: string, proposal: PartyProposal) => Promise<void>;
  canExecute?: boolean;
  showVoting?: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
  
  // Get the appropriate status badge color and text
  const getStatusBadge = (status: ProposalStatus) => {
    switch (status) {
      case 'active':
        return { color: 'bg-blue-500/20 text-blue-400', text: 'Active', icon: Clock };
      case 'passed':
        return { color: 'bg-yellow-500/20 text-yellow-400', text: 'Passed', icon: CheckCircle };
      case 'ready':
        return { color: 'bg-purple-500/20 text-purple-400', text: 'Ready', icon: Clock };
      case 'executed':
        return { color: 'bg-green-500/20 text-green-400', text: 'Executed', icon: ShieldCheck };
      case 'defeated':
        return { color: 'bg-red-500/20 text-red-400', text: 'Defeated', icon: XCircle };
      case 'cancelled':
        return { color: 'bg-gray-500/20 text-gray-400', text: 'Cancelled', icon: X };
      case 'expired':
        return { color: 'bg-orange-500/20 text-orange-400', text: 'Expired', icon: Clock };
      default:
        return { color: 'bg-gray-500/20 text-gray-400', text: 'Unknown', icon: Clock };
    }
  };
  
  const statusBadge = getStatusBadge(proposal.status);
  const StatusIcon = statusBadge.icon;
  
  const handleVote = async (support: boolean) => {
    if (isVoting) return;
    
    setIsVoting(true);
    try {
      await onVote(proposal.id, support);
      setHasVoted(true);
    } finally {
      setIsVoting(false);
    }
  };
  
  const handleExecute = async () => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    try {
      await onExecute(proposal.id, proposal);
    } finally {
      setIsExecuting(false);
    }
  };
  
  return (
    <div className="bg-black/30 border border-white/10 rounded-lg p-5 transition-all hover:border-white/20">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`px-2.5 py-1 rounded-full text-xs flex items-center gap-1 ${statusBadge.color}`}>
                <StatusIcon className="w-3 h-3" />
                <span>{statusBadge.text}</span>
              </div>
              <div className="text-xs text-gray-400">
                {format(new Date(proposal.createdAt * 1000), 'MMM d, yyyy')}
              </div>
            </div>
            <h3 className="font-medium text-lg">{proposal.title}</h3>
          </div>
          
          {(proposal.status === 'ready' && canExecute) && (
            <Button 
              onClick={handleExecute}
              disabled={isExecuting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isExecuting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                  Executing
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Execute
                </div>
              )}
            </Button>
          )}
        </div>
        
        <div className="text-sm text-gray-300">
          {proposal.description.length > 150 && !expanded
            ? `${proposal.description.slice(0, 150)}...`
            : proposal.description}
        </div>
        
        {proposal.description.length > 150 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-400 text-sm flex items-center gap-1 w-fit"
          >
            {expanded ? (
              <>View Less <ChevronUp className="w-4 h-4" /></>
            ) : (
              <>View More <ChevronDown className="w-4 h-4" /></>
            )}
          </button>
        )}
        
        {/* Only show voting UI for active proposals */}
        {proposal.status === 'active' && showVoting && (
          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Support</span>
                <span>{forPercentage.toFixed(0)}% ({proposal.votesFor})</span>
              </div>
              <Progress value={forPercentage} className="h-2 bg-black" indicatorClassName="bg-green-500" />
              
              <div className="flex justify-between text-sm">
                <span>Against</span>
                <span>{(100 - forPercentage).toFixed(0)}% ({proposal.votesAgainst})</span>
              </div>
              <Progress value={100 - forPercentage} className="h-2 bg-black" indicatorClassName="bg-red-500" />
            </div>
            
            {!hasVoted && (
              <div className="flex gap-2 mt-4">
                <Button 
                  onClick={() => handleVote(true)}
                  disabled={isVoting}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isVoting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                      Voting
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Support
                    </div>
                  )}
                </Button>
                <Button 
                  onClick={() => handleVote(false)}
                  disabled={isVoting}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {isVoting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                      Voting
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4" />
                      Against
                    </div>
                  )}
                </Button>
              </div>
            )}
            
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Voting ends in {proposal.timeRemaining}</span>
            </div>
          </div>
        )}
        
        {/* Show transaction details for expanded view */}
        {expanded && proposal.transactions.length > 0 && (
          <div className="mt-4 border-t border-white/10 pt-4 space-y-4">
            <h4 className="font-medium">Transactions ({proposal.transactions.length})</h4>
            {proposal.transactions.map((tx, index) => (
              <div key={index} className="bg-black/30 border border-white/10 p-3 rounded-md">
                <div className="text-sm text-gray-400">Target Address:</div>
                <div className="font-mono text-sm truncate mb-2">{tx.target}</div>
                
                {tx.signature && (
                  <>
                    <div className="text-sm text-gray-400">Function:</div>
                    <div className="font-mono text-sm mb-2">{tx.signature}</div>
                  </>
                )}
                
                <div className="text-sm text-gray-400">Value:</div>
                <div className="font-mono text-sm">{tx.value} ETH</div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <User className="w-3 h-3" />
          <div className="font-mono truncate">{proposal.proposer}</div>
        </div>
      </div>
    </div>
  );
};

