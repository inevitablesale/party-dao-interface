import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { isPast, formatDistanceToNow } from 'date-fns';
import { useProposal } from '@/hooks/useProposal';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { motion } from "framer-motion";
import { 
  Coins, Clock, ChevronDown, Info, PieChart, Users, ExternalLink, 
  BrainCircuit, Twitter, Github, Calendar, Gift, Target, ArrowUpRight, User,
  Shield
} from "lucide-react";
import { ProposalLoadingCard } from './ProposalLoadingCard';
import { formatRDAmount } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useWalletProvider } from '@/hooks/useWalletProvider';
import { ProposalMetadata } from '@/types/proposals';
import { getTokenBalance } from '@/services/tokenService';
import { 
  FACTORY_ADDRESS, 
  FACTORY_ABI, 
  RD_TOKEN_ADDRESS,
  MIN_LGR_REQUIRED 
} from '@/lib/constants';
import { getFromIPFS } from '@/services/ipfsService';
import { loadingStates } from './ProposalLoadingCard';

interface ProposalDetailsCardProps {
  tokenId?: string;
  view?: 'overview' | 'details' | 'investment';
}

export const ProposalDetailsCard = ({ tokenId, view = 'overview' }: ProposalDetailsCardProps) => {
  const { toast } = useToast();
  const { isConnected, connect, address } = useWalletConnection();
  const { getProvider } = useWalletProvider();
  const [proposalDetails, setProposalDetails] = useState<ProposalMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [pledgedAmount, setPledgedAmount] = useState<string>("0");
  const [backerCount, setBackerCount] = useState(0);
  const [pledgeInput, setPledgeInput] = useState("");
  const [isPledging, setIsPledging] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isVotingEnded, setIsVotingEnded] = useState(false);
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  const VOTING_FEE = ethers.utils.parseEther("1");

  const RD_PRICE_USD = 0.10;

  const formatUSDAmount = (rdAmount: string): string => {
    if (!rdAmount) return "$0.00";
    const amount = parseFloat(rdAmount.replace(' RD', ''));
    if (isNaN(amount)) return "$0.00";
    const usdAmount = amount * RD_PRICE_USD;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(usdAmount);
  };

  const calculateProgress = () => {
    if (!pledgedAmount || !proposalDetails?.investment.targetCapital) return 0;
    const progress = (Number(pledgedAmount) / Number(proposalDetails.investment.targetCapital)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  useEffect(() => {
    console.log('Proposal details effect running...', {
      tokenId,
      isConnected
    });

    if (!tokenId) {
      console.log('No token ID provided');
      toast({
        title: "Invalid Proposal ID",
        description: "Please provide a valid proposal ID.",
        variant: "destructive",
      });
      return;
    }

    if (!isConnected) {
      console.log('Wallet not connected');
      return;
    }

    const fetchProposalDetails = async () => {
      setIsLoading(true);
      setLoadingProgress(20);

      try {
        console.log('Getting wallet provider...');
        const walletProvider = await getProvider();
        console.log('Initializing contract...');
        
        const factoryContract = new ethers.Contract(
          FACTORY_ADDRESS,
          FACTORY_ABI,
          walletProvider.provider
        );
        setLoadingProgress(40);

        console.log(`Getting tokenURI, pledged amount, and vote events for token #${tokenId}`);
        
        const proposalData = await factoryContract.proposals(tokenId);
        const tokenUri = await factoryContract.tokenURI(tokenId);
        setLoadingProgress(50);

        console.log('Querying ProposalVoted events...');
        const filter = factoryContract.filters.ProposalVoted(tokenId, null);
        const events = await factoryContract.queryFilter(filter);
        
        console.log('Token URI:', tokenUri);
        console.log('Pledged amount:', ethers.utils.formatEther(proposalData.totalPledged));
        console.log('Vote events count:', events.length);
        
        setPledgedAmount(ethers.utils.formatEther(proposalData.totalPledged));
        setBackerCount(events.length);
        setLoadingProgress(60);

        if (tokenUri) {
          console.log('Starting IPFS fetch for metadata');
          const ipfsHash = tokenUri.replace('ipfs://', '');
          console.log('IPFS hash:', ipfsHash);
          
          const metadata = await getFromIPFS<ProposalMetadata>(
            ipfsHash,
            'proposal'
          );
          console.log('Successfully fetched IPFS data:', metadata);
          setProposalDetails(metadata);
        } else {
          console.warn('No tokenURI found for this proposal');
          throw new Error('No metadata found for this proposal');
        }
        
        setLoadingProgress(100);
      } catch (error: any) {
        console.error("Error fetching proposal details:", error);
        toast({
          title: "Failed to Load Proposal",
          description: error.message || "Could not retrieve proposal details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposalDetails();
  }, [tokenId, isConnected, getProvider, toast]);

  useEffect(() => {
    if (proposalDetails?.submissionTimestamp && proposalDetails?.votingDuration) {
      const updateTimeRemaining = () => {
        const submissionTimestamp = proposalDetails.submissionTimestamp || Math.floor(Date.now() / 1000);
        const endTimestamp = (submissionTimestamp + proposalDetails.votingDuration) * 1000;
        const endDate = new Date(endTimestamp);
        
        if (isPast(endDate)) {
          setIsVotingEnded(true);
          setTimeRemaining("Voting ended");
        } else {
          setIsVotingEnded(false);
          setTimeRemaining(`ends in ${formatDistanceToNow(endDate)}`);
        }
      };

      updateTimeRemaining();
      const timer = setInterval(updateTimeRemaining, 1000);
      return () => clearInterval(timer);
    }
  }, [proposalDetails]);

  const handlePledge = async () => {
    if (!tokenId || !isConnected || !pledgeInput) return;
    
    setIsPledging(true);
    try {
      const walletProvider = await getProvider();
      const signer = walletProvider.provider.getSigner();
      const signerAddress = await signer.getAddress();
      
      // First check RD token approval
      const rdToken = new ethers.Contract(
        RD_TOKEN_ADDRESS,
        ["function approve(address,uint256) returns (bool)", "function allowance(address,address) view returns (uint256)"],
        signer
      );
      
      console.log('Checking RD token approval...');
      const currentAllowance = await rdToken.allowance(signerAddress, FACTORY_ADDRESS);
      
      if (currentAllowance.lt(VOTING_FEE)) {
        console.log('Approving voting fee:', ethers.utils.formatEther(VOTING_FEE));
        const approveTx = await rdToken.approve(FACTORY_ADDRESS, VOTING_FEE);
        await approveTx.wait();
        console.log('Approval transaction confirmed');
      } else {
        console.log('Sufficient allowance exists');
      }

      const pledgeAmountBN = ethers.utils.parseEther(pledgeInput);
      const factoryContract = new ethers.Contract(
        FACTORY_ADDRESS,
        FACTORY_ABI,
        signer
      );

      console.log('Submitting vote transaction...');
      const voteTx = await factoryContract.vote(tokenId, pledgeAmountBN, {
        gasLimit: 500000 // Explicit gas limit to prevent estimation issues
      });
      
      console.log('Vote transaction submitted:', voteTx.hash);
      await voteTx.wait();

      toast({
        title: "Support Pledged Successfully",
        description: `Your commitment of ${pledgeInput} RD has been recorded.`,
      });

      // Refresh pledge amount display
      const updatedProposal = await factoryContract.proposals(tokenId);
      setPledgedAmount(ethers.utils.formatEther(updatedProposal.totalPledged));
      
    } catch (error: any) {
      console.error("Pledging error:", error);
      toast({
        title: "Pledging Failed",
        description: error.message || "Failed to submit pledge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPledging(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <p className="text-zinc-400 text-lg">Connect your device to access settlement details</p>
            <Button 
              onClick={connect} 
              size="lg"
              className="bg-gradient-to-r from-toxic-neon/80 to-toxic-neon/60 hover:from-toxic-neon hover:to-toxic-neon/80 text-black px-8 py-4 rounded-lg font-semibold text-lg"
            >
              Connect Device
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <ProposalLoadingCard 
          loadingState={loadingStates[Math.floor((loadingProgress / 100) * loadingStates.length)]} 
        />
      </motion.div>
    );
  }

  if (!proposalDetails) {
    return (
      <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <p className="text-zinc-400 text-lg">The requested proposal could not be found.</p>
        </CardContent>
      </Card>
    );
  }

  if (view === 'overview') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm">
          <CardHeader>
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center space-x-2 bg-toxic-neon/10 rounded-full px-4 py-2">
                  <Shield className="w-4 h-4 text-toxic-neon" />
                  <span className="text-sm text-toxic-neon">{proposalDetails.category || "Settlement"}</span>
                </div>
                {proposalDetails.blockchain?.map((chain) => (
                  <span key={chain} className="px-3 py-1 text-xs font-medium bg-toxic-neon/10 text-toxic-neon rounded-full">
                    {chain}
                  </span>
                ))}
              </div>
              
              <div>
                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-toxic-neon via-toxic-neon/80 to-toxic-neon">
                  {proposalDetails.title}
                </h1>
                <p className="text-lg text-zinc-400">{proposalDetails.description}</p>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mt-4">
                <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-400">Important Notice</h3>
                    <p className="text-white">Only a 1 RD fee is required to secure your support. Your pledged resources represent your contribution to settlement security.</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Shield className="w-6 h-6 text-toxic-neon" />
                        Secure This Settlement
                      </h3>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-toxic-neon/10 border border-toxic-neon/20">
                        <Clock className="w-5 h-5 text-toxic-neon" />
                        <span className={`text-lg font-medium ${isVotingEnded ? 'text-red-400' : 'text-toxic-neon'}`}>
                          {timeRemaining}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-toxic-neon/10 backdrop-blur-sm">
                      <p className="text-2xl font-bold text-white">
                        {formatRDAmount(pledgedAmount)}
                      </p>
                      <span className="text-sm text-zinc-400 border-l border-zinc-700 pl-2">
                        {backerCount} supporter{backerCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <Label htmlFor="pledgeAmount" className="text-zinc-400 mb-2 block">
                        Resource Commitment (RD)
                      </Label>
                      <Input
                        id="pledgeAmount"
                        type="number"
                        min="0"
                        step="0.1"
                        value={pledgeInput}
                        onChange={(e) => setPledgeInput(e.target.value)}
                        placeholder="Enter RD resources to commit"
                        className="bg-zinc-900/50 border-zinc-800/50 text-white h-12"
                      />
                    </div>
                    <Button
                      onClick={handlePledge}
                      disabled={isPledging || !pledgeInput}
                      size="lg"
                      className="bg-gradient-to-r from-toxic-neon/80 to-toxic-neon/60 hover:from-toxic-neon hover:to-toxic-neon/80 text-black font-semibold h-12 mt-8 md:mt-0"
                    >
                      {isPledging ? (
                        "Processing..."
                      ) : (
                        <>
                          <Shield className="w-5 h-5 mr-2" />
                          Commit Resources
                        </>
                      )}
                    </Button>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm text-zinc-400 mb-2">
                      <span>Progress Towards Security Threshold</span>
                      <span className="font-medium">
                        {calculateProgress().toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={calculateProgress()}
                      className="h-3 bg-zinc-800"
                    />
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-zinc-400">
                        Pledged: {formatRDAmount(pledgedAmount)}
                      </span>
                      <span className="text-zinc-400">
                        Target: {formatRDAmount(proposalDetails.investment.targetCapital)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>
    );
  }

  if (view === 'details') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
          <CardContent className="p-8 space-y-8">
            {(proposalDetails.team && proposalDetails.team.length > 0) && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6 text-toxic-neon" />
                  Settlement Leaders
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {proposalDetails.team.map((member, index) => (
                    <div key={index} className="bg-toxic-neon/5 rounded-lg p-4 border border-toxic-neon/20">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-white font-medium">{member.name}</p>
                          <p className="text-toxic-neon/80 text-sm">{member.role}</p>
                        </div>
                        <div className="flex gap-2">
                          {member.linkedin && (
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                              className="p-2 rounded-full bg-toxic-neon/10 hover:bg-toxic-neon/20 transition-colors">
                              <ExternalLink className="w-4 h-4 text-toxic-neon" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {proposalDetails.socials && (
              <div className="bg-toxic-neon/5 rounded-lg p-6 border border-toxic-neon/20">
                <h4 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-toxic-neon" />
                  Communication Channels
                </h4>
                <div className="flex flex-wrap gap-4">
                  {proposalDetails.socials.twitter && (
                    <a
                      href={proposalDetails.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-toxic-neon/10 text-toxic-neon hover:bg-toxic-neon/20 transition-colors"
                    >
                      <Twitter className="w-5 h-5 mr-2" />
                      Radio Freq.
                    </a>
                  )}
                  {proposalDetails.socials.discord && (
                    <a
                      href={proposalDetails.socials.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-toxic-neon/10 text-toxic-neon hover:bg-toxic-neon/20 transition-colors"
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Meeting Point
                    </a>
                  )}
                  {proposalDetails.socials.telegram && (
                    <a
                      href={proposalDetails.socials.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-toxic-neon/10 text-toxic-neon hover:bg-toxic-neon/20 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Emergency Signal
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="bg-toxic-neon/5 p-6 rounded-xl backdrop-blur-sm space-y-4 border border-toxic-neon/20">
              <h3 className="text-xl font-semibold text-toxic-neon">Settlement Strategy</h3>
              <p className="text-white/80 leading-relaxed">
                {proposalDetails.investment.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (view === 'investment') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
          <CardContent className="p-8 space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Resource Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-toxic-neon/5 p-4 rounded-lg border border-toxic-neon/20">
                  <p className="text-toxic-neon/80 text-sm">Target Resources</p>
                  <p className="text-white text-lg font-medium">
                    {formatRDAmount(proposalDetails.investment.targetCapital)}
                  </p>
                </div>
                <div className="bg-toxic-neon/5 p-4 rounded-lg border border-toxic-neon/20">
                  <p className="text-toxic-neon/80 text-sm">Total Pledged</p>
                  <p className="text-white text-lg font-medium">
                    {formatRDAmount(pledgedAmount)}
                  </p>
                </div>
              </div>
            </div>

            {proposalDetails.fundingBreakdown && (
              <div className="bg-toxic-neon/5 rounded-lg p-6 border border-toxic-neon/20">
                <h4 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                  <PieChart className="w-5 h-5 text-toxic-neon" />
                  Resource Allocation
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {proposalDetails.fundingBreakdown.map((item, index) => (
                    <div key={index} className="bg-toxic-neon/10 rounded-lg p-4">
                      <p className="text-toxic-neon/80 text-sm">{item.category}</p>
                      <p className="text-white font-medium">{formatRDAmount(item.amount)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-toxic-neon/5 rounded-lg p-6 border border-toxic-neon/20">
              <h4 className="text-xl font-bold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-toxic-neon" />
                Settlement Purpose
              </h4>
              <p className="text-white/80 leading-relaxed mt-4">
                {proposalDetails.investment.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return null;
};

export default ProposalDetailsCard;

