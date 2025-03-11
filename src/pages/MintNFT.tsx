
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { WalletInfo } from "@/components/WalletInfo";
import { PostOnboardingView } from "@/components/PostOnboardingView";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import { useToast } from "@/hooks/use-toast";
import { checkNFTOwnership } from "@/services/contractService";
import { useNavigate } from "react-router-dom";

const MintNFTContent = () => {
  const { user, setShowAuthFlow, primaryWallet } = useDynamicContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [hasNFT, setHasNFT] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Automatically open the auth flow when component mounts if user is not connected
    if (!user) {
      setShowAuthFlow?.(true);
    }
  }, [user, setShowAuthFlow]);

  useEffect(() => {
    const checkNFT = async () => {
      if (primaryWallet?.address) {
        setIsChecking(true);
        try {
          console.log('Checking NFT ownership...');
          const ownsNFT = await checkNFTOwnership(
            await primaryWallet.getWalletClient(),
            primaryWallet.address
          );
          console.log('NFT ownership result:', ownsNFT);
          setHasNFT(ownsNFT);
          
          if (ownsNFT) {
            toast({
              title: "NFT Detected",
              description: "You already own a LedgerFren NFT. Redirecting to governance...",
            });
            setTimeout(() => navigate('/governance-voting'), 2000);
          }
        } catch (error) {
          console.error('Error checking NFT:', error);
          toast({
            title: "Error",
            description: "Failed to check NFT ownership. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsChecking(false);
        }
      }
    };
    
    checkNFT();
  }, [primaryWallet, toast, navigate]);

  if (user?.verifications?.completedOnboarding) {
    return <PostOnboardingView />;
  }

  return (
    <div className="text-center mb-8 max-w-5xl mx-auto pt-32">
      <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight">
        Mint your LedgerFren NFT
      </h1>
      <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
        Get your LedgerFren NFT to access the platform. Once verified, you'll be able to participate in investment opportunities.
      </p>

      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10">
          <div className="flex justify-center mb-8">
            <DynamicWidget />
          </div>
          {isChecking ? (
            <div className="text-white text-center">
              Checking NFT ownership...
            </div>
          ) : (
            <WalletInfo />
          )}
        </div>
      </div>
    </div>
  );
};

const MintNFT = () => {
  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, #000B2E 0%, #000000 100%)', opacity: 0.98 }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 70%, rgba(64, 156, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(147, 51, 255, 0.1) 0%, transparent 45%), radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.05) 0%, transparent 55%)', animation: 'quantumField 30s ease-in-out infinite' }} />
        <div className="absolute inset-0 opacity-90" style={{ backgroundImage: 'radial-gradient(1px 1px at 10% 10%, rgba(255, 255, 255, 0.8) 100%, transparent), radial-gradient(2px 2px at 20% 20%, rgba(0, 255, 255, 0.7) 100%, transparent), radial-gradient(1.5px 1.5px at 30% 30%, rgba(147, 51, 255, 0.8) 100%, transparent), radial-gradient(2px 2px at 40% 40%, rgba(64, 156, 255, 0.6) 100%, transparent), radial-gradient(1.5px 1.5px at 50% 50%, rgba(255, 255, 255, 0.7) 100%, transparent)', backgroundSize: '400% 400%', animation: 'temporalWake 240s ease-in-out infinite' }} />
      </div>
      
      <Nav />
      
      <div className="container mx-auto px-4 relative z-10">
        <MintNFTContent />
      </div>
    </div>
  );
};

export default MintNFT;
