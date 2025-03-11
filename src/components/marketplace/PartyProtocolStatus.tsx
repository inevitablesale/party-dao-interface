
import React from 'react';
import { Link, Network, Wallet, Check, AlertTriangle } from 'lucide-react';
import { ToxicCard, ToxicCardContent, ToxicCardHeader, ToxicCardTitle } from "@/components/ui/toxic-card";
import { Progress } from "@/components/ui/progress";
import { ToxicBadge } from '@/components/ui/toxic-badge';

interface PartyProtocolStatusProps {
  status: 'connected' | 'pending' | 'disconnected';
  networkName?: string;
  gasBalance?: string;
  signatureRequired?: boolean;
  contractAddress?: string;
}

export const PartyProtocolStatus: React.FC<PartyProtocolStatusProps> = ({
  status = 'disconnected',
  networkName = 'Polygon',
  gasBalance = '0.0 MATIC',
  signatureRequired = true,
  contractAddress
}) => {
  return (
    <ToxicCard className="bg-black/50 border-toxic-neon/30">
      <ToxicCardHeader>
        <ToxicCardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5 text-toxic-neon" />
          Party Protocol Status
        </ToxicCardTitle>
      </ToxicCardHeader>
      <ToxicCardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4 text-toxic-neon" />
              <span className="text-gray-300 text-sm">Network</span>
            </div>
            <ToxicBadge 
              variant={networkName === 'Polygon' ? 'default' : 'outline'}
              className="bg-purple-900/30 text-purple-300 border-purple-500/50"
            >
              {networkName}
            </ToxicBadge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-toxic-neon" />
              <span className="text-gray-300 text-sm">Gas Balance</span>
            </div>
            <span className={`text-sm ${
              parseFloat(gasBalance) > 0.1 ? 'text-toxic-neon' : 'text-red-500'
            }`}>
              {gasBalance}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {status === 'connected' ? (
                <Check className="h-4 w-4 text-toxic-neon" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              )}
              <span className="text-gray-300 text-sm">Connection Status</span>
            </div>
            <ToxicBadge 
              variant={status === 'connected' ? 'default' : 'outline'}
              className={status === 'connected' 
                ? 'bg-green-900/30 text-green-300 border-green-500/50' 
                : status === 'pending'
                ? 'bg-amber-900/30 text-amber-300 border-amber-500/50'
                : 'bg-red-900/30 text-red-300 border-red-500/50'
              }
            >
              {status === 'connected' ? 'Connected' : status === 'pending' ? 'Pending' : 'Disconnected'}
            </ToxicBadge>
          </div>
          
          {contractAddress && (
            <div className="pt-2 border-t border-gray-800">
              <div className="flex items-center gap-2 mb-1">
                <Link className="h-4 w-4 text-toxic-neon" />
                <span className="text-gray-400 text-sm">Contract</span>
              </div>
              <span className="text-xs font-mono text-gray-300 break-all">
                {contractAddress}
              </span>
            </div>
          )}
          
          {signatureRequired && (
            <div className="bg-amber-900/20 p-3 rounded border border-amber-500/30 text-amber-300 text-xs">
              Participation requires wallet signature to authorize Party Protocol interactions. You pay gas fees on Polygon network.
            </div>
          )}
        </div>
      </ToxicCardContent>
    </ToxicCard>
  );
};
