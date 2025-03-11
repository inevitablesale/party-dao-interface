import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Shield, User, ChevronUp, ChevronDown, Wallet, LogOut, ExternalLink } from "lucide-react";
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { truncateAddress } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export const ResistanceWalletWidget = () => {
  const { isConnected, connect, disconnect, address, isPendingInitialization } = useWalletConnection();
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  
  const handleConnect = async () => {
    try {
      await connect();
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive"
      });
    }
  };
  
  const handleDisconnect = async () => {
    try {
      await disconnect();
      setIsExpanded(false);
      toast({
        title: "Disconnected",
        description: "Your wallet has been disconnected",
      });
    } catch (error: any) {
      toast({
        title: "Disconnect Failed",
        description: error.message || "Failed to disconnect wallet",
        variant: "destructive"
      });
    }
  };
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  if (isPendingInitialization) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-black/80 backdrop-blur-lg border border-white/10 rounded-lg p-3 flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          <span className="text-sm">Initializing...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isConnected ? (
        <div className={`bg-black/80 backdrop-blur-lg border border-white/10 rounded-lg overflow-hidden transition-all ${isExpanded ? 'w-64' : 'w-auto'}`}>
          <div 
            className="p-3 flex items-center justify-between cursor-pointer hover:bg-white/5"
            onClick={toggleExpanded}
          >
            <div className="flex items-center space-x-2">
              <Shield className="text-blue-400 w-5 h-5" />
              <span className="text-sm font-medium">Resistance Protocol</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </div>
          
          {isExpanded && (
            <div className="p-4 border-t border-white/10 space-y-4">
              <div className="flex items-center space-x-2">
                <User className="text-gray-400 w-4 h-4" />
                <div className="text-sm flex items-center">
                  <span className="font-mono">{truncateAddress(address || '')}</span>
                  <a 
                    href={`https://etherscan.io/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 ml-2"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                className="w-full border-white/10 hover:bg-white/5 gap-2 text-red-400 hover:text-red-300"
                onClick={handleDisconnect}
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Button 
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 gap-2"
          onClick={handleConnect}
        >
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </Button>
      )}
    </div>
  );
};
