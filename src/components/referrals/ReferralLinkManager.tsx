import React, { useState, useEffect } from 'react';
import { Copy, Share2, Check, QrCode, ArrowUpRight, Award, Trophy } from 'lucide-react';
import { ToxicButton } from '@/components/ui/toxic-button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCustomWallet } from '@/hooks/useCustomWallet';
import { getBounties, Bounty } from '@/services/bountyService';
import { Card } from '@/components/ui/card';

interface ReferralLinkManagerProps {
  address?: string;
  showBountySelector?: boolean;
  onBountySelect?: (bountyId: string) => void;
  className?: string;
}

const ReferralLinkManager: React.FC<ReferralLinkManagerProps> = ({ 
  address, 
  showBountySelector = true,
  onBountySelect,
  className 
}) => {
  const { toast } = useToast();
  const { isConnected, getReferrer } = useCustomWallet();
  const [copied, setCopied] = useState(false);
  const [activeBounties, setActiveBounties] = useState<Bounty[]>([]);
  const [selectedBountyId, setSelectedBountyId] = useState<string>('');
  
  // Load available active bounties
  useEffect(() => {
    const loadBounties = async () => {
      try {
        const allBounties = await getBounties('active');
        setActiveBounties(allBounties);
        
        // Set default selected bounty if there are any
        if (allBounties.length > 0 && !selectedBountyId) {
          setSelectedBountyId(allBounties[0].id);
          onBountySelect?.(allBounties[0].id);
        }
      } catch (error) {
        console.error("Error loading bounties for referral:", error);
      }
    };

    if (isConnected) {
      loadBounties();
    }
  }, [isConnected, onBountySelect, selectedBountyId]);
  
  // Generate referral link based on connected wallet and selected bounty
  const getReferralLink = () => {
    if (!address) return 'Connect wallet to generate your referral link';
    
    const referrer = getReferrer() || address;
    
    if (selectedBountyId && showBountySelector) {
      return `${window.location.origin}/r/${selectedBountyId}/${referrer}`;
    }
    
    return `${window.location.origin}/r/${referrer}`;
  };
  
  const referralLink = getReferralLink();
  
  const copyToClipboard = () => {
    if (!address) return;
    
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    
    toast({
      title: "Referral Link Copied!",
      description: "Your unique referral link has been copied to clipboard.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const shareReferral = () => {
    if (!address) return;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join the Wasteland Resistance',
        text: 'Claim your free NFT and help rebuild civilization in the Wasteland!',
        url: referralLink,
      });
    } else {
      copyToClipboard();
    }
  };
  
  const showQRCode = () => {
    if (!address) return;
    
    toast({
      title: "QR Code Feature",
      description: "QR code generation will be available in the next update.",
    });
  };

  const handleBountyChange = (bountyId: string) => {
    setSelectedBountyId(bountyId);
    onBountySelect?.(bountyId);
  };

  const selectedBounty = activeBounties.find(b => b.id === selectedBountyId);

  return (
    <div className={`space-y-4 ${className}`}>
      {showBountySelector && activeBounties.length > 0 && (
        <div className="space-y-2">
          <label className="text-white/70 text-sm block flex items-center gap-2">
            <Award className="h-4 w-4 text-toxic-neon" />
            Select Bounty Program
          </label>
          <Select value={selectedBountyId} onValueChange={handleBountyChange}>
            <SelectTrigger className="bg-black/50 border-toxic-neon/30">
              <SelectValue placeholder="Select a bounty program" />
            </SelectTrigger>
            <SelectContent className="bg-black border-toxic-neon/30">
              {activeBounties.map((bounty) => (
                <SelectItem key={bounty.id} value={bounty.id}>
                  {bounty.name} ({bounty.rewardAmount} MATIC)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {selectedBounty && (
        <Card className="bg-black/50 border-toxic-neon/30 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs uppercase text-toxic-neon/70 flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              Active Bounty
            </div>
            <div className="text-xs text-white/70">
              {selectedBounty.rewardAmount} MATIC per referral
            </div>
          </div>
          <p className="text-sm text-white/90 mb-1">{selectedBounty.name}</p>
          <p className="text-xs text-white/70">{selectedBounty.description}</p>
        </Card>
      )}
      
      <div>
        <label className="text-white/70 text-sm mb-2 block flex items-center gap-2">
          <Share2 className="h-4 w-4 text-toxic-neon" />
          Your Referral Link
        </label>
        <div className="relative">
          <Input 
            value={referralLink}
            readOnly
            className="bg-black/50 border-toxic-neon/30 text-toxic-neon pr-10"
          />
          <button 
            className="absolute right-2 top-1/2 -translate-y-1/2 text-toxic-neon/60 hover:text-toxic-neon"
            onClick={copyToClipboard}
          >
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <ToxicButton 
          variant="outline"
          onClick={copyToClipboard}
          className="border-toxic-neon/30"
          disabled={!address}
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </ToxicButton>
        <ToxicButton 
          variant="outline"
          onClick={shareReferral}
          className="border-toxic-neon/30"
          disabled={!address}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </ToxicButton>
        <ToxicButton 
          variant="outline"
          onClick={showQRCode}
          className="border-toxic-neon/30"
          disabled={!address}
        >
          <QrCode className="h-4 w-4 mr-2" />
          QR Code
        </ToxicButton>
      </div>
    </div>
  );
};

export default ReferralLinkManager;
