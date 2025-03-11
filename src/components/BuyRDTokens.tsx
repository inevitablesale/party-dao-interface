
import { useState } from 'react';
import { ToxicButton } from "@/components/ui/toxic-button";
import { Wallet, Radiation, ArrowRightLeft, CornerRightDown, Wifi, Shield } from 'lucide-react';
import { ToxicCard } from '@/components/ui/toxic-card';

interface BuyRDTokensProps {
  onConnectWallet?: () => void;
  isConnected?: boolean;
}

export const BuyRDTokens = ({ onConnectWallet, isConnected = false }: BuyRDTokensProps) => {
  const [amount, setAmount] = useState<number>(100);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setAmount(value);
    }
  };
  
  return (
    <ToxicCard className="relative bg-black/40 border border-toxic-neon/20 p-0 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="p-6">
          <h3 className="text-2xl font-mono text-toxic-neon mb-4 toxic-glow flex items-center">
            <Radiation className="w-6 h-6 mr-2" /> Fund Projects
          </h3>
          <p className="text-white/70 mb-4">
            Convert your <span className="text-apocalypse-red font-semibold">Old World currency (USDC)</span> into <span className="text-toxic-neon font-semibold">Resistance Dollars (RD)</span> to support innovative projects and make soft capital commitments.
          </p>
          
          <div className="mb-4">
            <div className="bg-black/70 border border-toxic-neon/20 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-toxic-neon font-mono">Exchange Rate</span>
                <span className="text-white font-mono">1 USDC = 1 RD</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-toxic-neon font-mono">Minimum Transfer</span>
                <span className="text-white font-mono">10 USDC</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-toxic-neon font-mono">Protocol Fee</span>
                <span className="text-white font-mono">0.5%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-black/60 border border-toxic-neon/20 p-4 rounded-lg mb-6">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70 text-sm">Amount to Convert</span>
                <span className="text-toxic-neon text-sm">Balance: 0 USDC</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  className="w-full bg-black/70 border border-toxic-neon/30 text-white p-2 rounded-lg focus:outline-none focus:border-toxic-neon font-mono"
                />
                <span className="text-white font-mono bg-toxic-neon/20 py-2 px-3 rounded-lg">USDC</span>
              </div>
              
              <div className="flex items-center justify-center my-3">
                <div className="bg-toxic-neon/20 p-2 rounded-full">
                  <ArrowRightLeft className="h-5 w-5 text-toxic-neon" />
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70 text-sm">You'll Receive</span>
                <span className="text-toxic-neon text-sm">Est. Value</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-full bg-black/70 border border-toxic-neon/30 text-white p-2 rounded-lg font-mono">
                  {amount} RD
                </div>
                <span className="text-white font-mono bg-toxic-neon/20 py-2 px-3 rounded-lg">RD</span>
              </div>
            </div>
          </div>
          
          <ToxicButton
            className="w-full bg-toxic-dark border-toxic-neon/50 hover:bg-toxic-dark/80"
            size="lg"
            onClick={onConnectWallet}
          >
            {isConnected ? (
              <>
                <Wifi className="w-5 h-5 mr-2 text-toxic-neon" />
                <span className="text-lg font-mono">ACCESS FUNDING TERMINAL</span>
              </>
            ) : (
              <>
                <Radiation className="w-5 h-5 mr-2 text-toxic-neon" />
                <span className="text-lg font-mono flash-beacon">ACTIVATE SURVIVAL BEACON</span>
              </>
            )}
          </ToxicButton>
        </div>
        
        <div className="bg-toxic-neon/5 p-6 border-l border-toxic-neon/20">
          <h3 className="text-xl font-mono text-toxic-neon mb-4">Why Join The Resistance?</h3>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <div className="flex-shrink-0 bg-toxic-neon/10 w-8 h-8 rounded-full flex items-center justify-center">
                <Wallet className="w-4 h-4 text-toxic-neon" />
              </div>
              <div>
                <h4 className="text-white font-mono mb-1">Secure Asset Storage</h4>
                <p className="text-white/70 text-sm">Your RD tokens are stored in radiation-hardened vaults secured by battle-tested smart contracts.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex-shrink-0 bg-toxic-neon/10 w-8 h-8 rounded-full flex items-center justify-center">
                <Radiation className="w-4 h-4 text-toxic-neon" />
              </div>
              <div>
                <h4 className="text-white font-mono mb-1">Governance Rights</h4>
                <p className="text-white/70 text-sm">RD token holders vote on Resistance initiatives and resource allocation for promising projects.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex-shrink-0 bg-toxic-neon/10 w-8 h-8 rounded-full flex items-center justify-center">
                <CornerRightDown className="w-4 h-4 text-toxic-neon" />
              </div>
              <div>
                <h4 className="text-white font-mono mb-1">Priority Access</h4>
                <p className="text-white/70 text-sm">Early access to new projects, protocols, and opportunities before they're publicly available.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </ToxicCard>
  );
};
