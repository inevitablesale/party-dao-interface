import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet, Loader2, Shield, Gift, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useDynamicUtils } from "@/hooks/useDynamicUtils";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { useNFTBalance } from "@/hooks/useNFTBalance";
import { useToast } from "@/hooks/use-toast";
import { NFTPurchaseDialog } from "./wallet/NFTPurchaseDialog";
import { Input } from "@/components/ui/input";
import Cookies from 'js-cookie';

// The cookie name for access verification
const ACCESS_COOKIE_NAME = 'resistance_dao_access';
// Cookie expiry in days (30 days)
const COOKIE_EXPIRY = 30;
// Password for access (in a real app, this would be environment-based or server-verified)
const ACCESS_PASSWORD = 'resistance2024';

export const AccessCoverOverlay = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isPasswordError, setIsPasswordError] = useState(false);
  const { connectWallet, isInitializing } = useDynamicUtils();
  const { address } = useCustomWallet();
  const { data: nftBalanceData, isLoading: isCheckingNFT } = useNFTBalance(address);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing access cookie on mount
    const hasAccess = Cookies.get(ACCESS_COOKIE_NAME);
    if (hasAccess) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isCheckingNFT) return;
    
    if (address && nftBalanceData && nftBalanceData.balance > 0) {
      setShowOptions(true);
    }
  }, [address, nftBalanceData, isCheckingNFT]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === ACCESS_PASSWORD) {
      // Set cookie for future access
      Cookies.set(ACCESS_COOKIE_NAME, 'true', { expires: COOKIE_EXPIRY });
      setIsPasswordError(false);
      setIsOpen(false);
      toast({
        title: "Access Granted",
        description: "Welcome to Resistance DAO",
      });
    } else {
      setIsPasswordError(true);
      toast({
        title: "Access Denied",
        description: "Invalid password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGetNFT = () => {
    setIsPurchaseOpen(true);
    setIsOpen(false);
  };

  const handleGiftNFT = () => {
    setIsPurchaseOpen(true);
    setIsOpen(false);
    setShowOptions(false);
  };

  const handleContinueToDapp = () => {
    setIsOpen(false);
    setShowOptions(false);
  };

  const handlePurchaseDialogClose = (open: boolean) => {
    setIsPurchaseOpen(open);
    if (!open && nftBalanceData && nftBalanceData.balance === 0) {
      setIsOpen(true);
    }
  };

  if (!isOpen) {
    return (
      <NFTPurchaseDialog 
        open={isPurchaseOpen}
        onOpenChange={handlePurchaseDialogClose}
      />
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-[90] bg-black/90 flex items-center justify-center overflow-hidden pointer-events-auto">
        <div className="container max-w-7xl mx-auto px-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent pointer-events-none" />
                <img 
                  src="https://gateway.pinata.cloud/ipfs/bafybeifpkqs6hubctlfnk7fv4v27ot4rrr4szmgr7p5alwwiisylfakpbi"
                  alt="Resistance DAO NFT"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center md:text-left space-y-8 relative"
            >
              <div className="flex flex-col items-center md:items-start gap-6">
                <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-200 to-blue-300">
                  Welcome to Resistance DAO
                </h1>
                <p className="text-xl text-blue-200/80 max-w-2xl">
                  Enter the password to access the platform
                </p>
                <form onSubmit={handlePasswordSubmit} className="w-full max-w-md space-y-4">
                  <div className="relative">
                    <Input
                      type="password"
                      placeholder="Enter access password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full bg-black/50 border ${
                        isPasswordError ? 'border-red-500' : 'border-blue-500/20'
                      } text-white px-4 py-6 rounded-lg focus:border-blue-500 transition-colors`}
                    />
                    <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                  </div>
                  <Button 
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-semibold px-8 py-6 text-lg"
                  >
                    Access Platform
                  </Button>
                  {isPasswordError && (
                    <p className="text-sm text-red-500">
                      Invalid password. Please try again.
                    </p>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};
