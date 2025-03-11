
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, Plus, Check, Clock, Copy, ChevronRight, ExternalLink, Award, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToxicButton } from '@/components/ui/toxic-button';
import { ToxicBadge } from '@/components/ui/toxic-badge';
import { ToxicCard, ToxicCardContent, ToxicCardFooter } from '@/components/ui/toxic-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useReferrals } from '@/hooks/useReferrals';
import { ReferralInfo } from '@/services/referralService';
import { formatDistanceToNow } from 'date-fns';

export const ReferralDashboard = () => {
  const {
    referrals,
    isLoading,
    error,
    fetchReferrals,
    addReferral,
    completeReferral,
    getSavedReferrer
  } = useReferrals();
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [newReferralData, setNewReferralData] = useState({
    name: '',
    description: '',
    type: 'nft-membership',
    rewardPercentage: 5
  });
  
  const [referralLinkDialog, setReferralLinkDialog] = useState<{
    isOpen: boolean;
    referralId: string;
    link: string;
  }>({
    isOpen: false,
    referralId: '',
    link: ''
  });
  
  const submitNewReferral = async () => {
    console.log("Submitting new referral:", newReferralData);
    return "";
  };
  
  const claimReward = async (referralId: string) => {
    console.log("Claiming reward for referral:", referralId);
    return true;
  };
  
  const generateReferralLink = (referralId: string) => {
    return `${window.location.origin}/r/${referralId}`;
  };
  
  const isCreatingReferral = false;
  const canCreateReferral = true;
  const userRole = "Bounty Hunter";
  
  const handleCreateReferral = async () => {
    try {
      const referredAddress = "0x" + Math.random().toString(16).substring(2, 42);
      await addReferral(referredAddress);
      toast({
        title: "Referral created",
        description: "Your referral has been created successfully.",
      });
    } catch (err) {
      console.error("Error creating referral:", err);
      toast({
        title: "Failed to create referral",
        description: "An error occurred while creating the referral.",
        variant: "destructive",
      });
    }
  };
  
  const handleShareReferral = (referralId: string) => {
    const link = generateReferralLink(referralId);
    setReferralLinkDialog({
      isOpen: true,
      referralId,
      link
    });
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: 'Copied!',
          description: 'Referral link copied to clipboard.',
        });
      },
      (err) => {
        console.error('Failed to copy: ', err);
        toast({
          title: 'Failed to copy',
          description: 'Please try again or copy manually.',
          variant: 'destructive',
        });
      }
    );
  };
  
  const renderReferralCard = (referral: ReferralInfo) => (
    <ToxicCard key={referral.id} className="overflow-hidden">
      <ToxicCardContent className="p-4 space-y-3">
        <div className="flex justify-between">
          <ToxicBadge variant="outline" className="flex items-center gap-1">
            <Share2 className="w-3 h-3" />
            NFT Referral
          </ToxicBadge>
          
          <ToxicBadge 
            variant={
              referral.status === 'active' ? 'success' : 
              referral.status === 'expired' ? 'destructive' : 
              'default'
            }
          >
            {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
          </ToxicBadge>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-white mb-1">Referral to {referral.referredAddress.substring(0, 6)}...</h3>
          <p className="text-sm text-white/70 line-clamp-2">Invite a new member to join the Resistance</p>
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <div className="flex flex-col">
            <span className="text-sm text-white/60">Reward</span>
            <span className="font-mono text-toxic-neon">5%</span>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-sm text-white/60">Created</span>
            <span className="text-white/80 text-sm flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(referral.referralDate), { addSuffix: true })}
            </span>
          </div>
        </div>
      </ToxicCardContent>
      
      <ToxicCardFooter className="px-4 py-3 bg-black/40 flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs gap-1"
          onClick={() => handleShareReferral(referral.id)}
        >
          <Share2 className="w-3 h-3" /> Share Link
        </Button>
        
        {referral.status === 'claimed' && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs gap-1 text-toxic-neon border-toxic-neon/50"
            onClick={() => claimReward(referral.id)}
          >
            <Award className="w-3 h-3" /> Claim Reward
          </Button>
        )}
      </ToxicCardFooter>
    </ToxicCard>
  );
  
  const renderEmptyState = (message: string, canCreate: boolean = false) => (
    <div className="bg-black/20 rounded-xl border border-white/5 p-8 text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-toxic-neon/10 flex items-center justify-center mb-4">
        <Share2 className="w-8 h-8 text-toxic-neon" />
      </div>
      <h3 className="text-xl font-medium text-white mb-2">{message}</h3>
      <p className="text-white/60 max-w-md mx-auto mb-6">
        {canCreate 
          ? "Create your first referral to start earning rewards for bringing new members." 
          : "Only Bounty Hunters can create and manage referrals in the wasteland."}
      </p>
      
      {canCreate && (
        <ToxicButton onClick={() => navigate('/referrals/create')} className="gap-1">
          <Plus className="w-4 h-4" />
          Create Referral
        </ToxicButton>
      )}
    </div>
  );
  
  return (
    <div className="p-6 bg-black/60 border border-toxic-neon/30 rounded-xl space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-mono text-toxic-neon mb-1">Wasteland Referrals</h2>
          <p className="text-white/60 text-sm">
            Earn rewards by referring new members to the Resistance
          </p>
        </div>
        
        {canCreateReferral && (
          <ToxicButton 
            onClick={() => navigate('/referrals/create')} 
            className="gap-1"
            disabled={isCreatingReferral}
          >
            <Plus className="w-4 h-4" />
            Create Referral
          </ToxicButton>
        )}
      </div>
      
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="bg-black/40 border border-white/10">
          <TabsTrigger value="active" className="data-[state=active]:bg-toxic-neon/20">Active Referrals</TabsTrigger>
          <TabsTrigger value="rewards" className="data-[state=active]:bg-toxic-neon/20">My Rewards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-0">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-white/5 rounded-lg h-48"></div>
              ))}
            </div>
          ) : referrals.length === 0 ? (
            renderEmptyState(
              userRole === 'Bounty Hunter' 
                ? "You haven't created any referrals yet" 
                : "Become a Bounty Hunter to create referrals",
              canCreateReferral
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {referrals.map(renderReferralCard)}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="rewards" className="mt-0">
          <div className="bg-black/20 rounded-xl border border-white/5 p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-toxic-neon/10 flex items-center justify-center mb-4">
              <Award className="w-8 h-8 text-toxic-neon" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No rewards available</h3>
            <p className="text-white/60 max-w-md mx-auto">
              Start sharing your referral links to earn rewards
            </p>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Referral Link Dialog */}
      <Dialog 
        open={referralLinkDialog.isOpen} 
        onOpenChange={(open) => setReferralLinkDialog({...referralLinkDialog, isOpen: open})}
      >
        <DialogContent className="sm:max-w-md bg-toxic-dark border-toxic-neon/30">
          <DialogHeader>
            <DialogTitle className="text-toxic-neon">Your Referral Link</DialogTitle>
            <DialogDescription>
              Share this link to invite others and earn rewards.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center space-x-2 mt-4">
            <div className="grid flex-1 gap-2">
              <Input
                id="link"
                readOnly
                value={referralLinkDialog.link}
                className="bg-black/30 border-white/10"
              />
            </div>
            <Button 
              type="button" 
              variant="outline" 
              className="px-3 border-toxic-neon/40"
              onClick={() => copyToClipboard(referralLinkDialog.link)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <DialogFooter className="sm:justify-start mt-4">
            <Button
              type="button"
              variant="outline"
              className="gap-1 text-toxic-neon border-toxic-neon/40"
              onClick={() => window.open(referralLinkDialog.link, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
              Open Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
