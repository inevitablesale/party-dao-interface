
import { useEffect, useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Progress } from "@/components/ui/progress";
import { Check, ArrowRight, Eye, Save, RefreshCw } from "lucide-react";
import { analyzeLinkedInProfile } from "@/services/linkedinService";
import { mintNFT } from "@/services/contractService";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { LoadingSlides } from "./LoadingSlides";
import { motion } from "framer-motion";
import { MarketplaceMetadata } from "@/types/marketplace";

interface NFTPreview {
  name: string;
  image: string;
  skills: string[];
  experiences: Array<{
    title: string;
    company: string;
    duration: string;
    location: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
  }>;
}

export const WalletInfo = () => {
  const { primaryWallet, user } = useDynamicContext();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [progress, setProgress] = useState(25);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [nftPreview, setNFTPreview] = useState<NFTPreview | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>("");
  const [isSavedToBlockchain, setIsSavedToBlockchain] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkConnection = async () => {
      if (primaryWallet) {
        const connected = await primaryWallet.isConnected();
        setIsWalletConnected(connected);
      } else {
        setIsWalletConnected(false);
      }
    };

    checkConnection();
  }, [primaryWallet]);

  const handleAnalyzeProfile = async () => {
    console.group('LinkedIn Profile Analysis');
    console.log('Starting profile analysis...');
    
    const linkedInUrl = user?.metadata?.["LinkedIn Profile URL"];
    console.log('LinkedIn URL:', linkedInUrl);
    
    if (!linkedInUrl) {
      console.warn('LinkedIn Profile URL not found in metadata');
      toast({
        title: "LinkedIn Profile Not Found",
        description: "Please add your LinkedIn profile URL in your wallet settings.",
        variant: "destructive",
      });
      console.groupEnd();
      return;
    }

    setIsAnalyzing(true);
    try {
      console.log('Fetching LinkedIn profile data...');
      const metadata = await analyzeLinkedInProfile(linkedInUrl);
      setProgress(50);
      
      const preview: NFTPreview = {
        name: metadata.name,
        image: metadata.image,
        skills: metadata.skills,
        experiences: metadata.experiences,
        education: metadata.education
      };
      
      if (metadata.image) {
        setPreviewImageUrl(metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/'));
      }
      
      setNFTPreview(preview);
      setIsSavedToBlockchain(false);
      toast({
        title: "Analysis Complete",
        description: "Preview your NFT before saving to blockchain.",
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze profile. Please try again.",
        variant: "destructive",
      });
      setProgress(25);
    } finally {
      setIsAnalyzing(false);
      console.groupEnd();
    }
  };

  const handleMintNFT = async () => {
    if (!nftPreview) return;
    
    setIsMinting(true);
    try {
      console.log('Starting NFT minting process...');
      
      if (!primaryWallet?.address) {
        throw new Error('Wallet address not found');
      }

      const result = await mintNFT(
        await primaryWallet.getWalletClient(),
        primaryWallet.address,
        nftPreview
      );

      console.log('NFT minted successfully:', result);
      setProgress(100);
      setIsSavedToBlockchain(true);
      
      toast({
        title: "NFT Minted Successfully!",
        description: "Your Professional NFT has been minted. Redirecting to marketplace...",
      });

      setTimeout(() => {
        navigate('/marketplace');
      }, 2000);
    } catch (error) {
      console.error('Minting failed:', error);
      toast({
        title: "Minting Failed",
        description: error instanceof Error ? error.message : "Failed to mint NFT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  if (!isWalletConnected) {
    return null;
  }

  const getStepStatus = (stepIndex: number) => {
    if (progress === 100) return "complete";
    if (progress >= stepIndex * 25) return "complete";
    if (progress >= (stepIndex - 1) * 25) return "current";
    return "upcoming";
  };

  const steps = [
    { name: "Create Wallet", status: getStepStatus(1) },
    { name: "Preview ID Badge", status: getStepStatus(2) },
    { name: "Mint ID Badge", status: getStepStatus(3) }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6 space-y-6"
    >
      <Progress value={progress} className="h-2 bg-white/10" />
      
      <div className="grid grid-cols-3 gap-2">
        {steps.map((step, index) => (
          <motion.div 
            key={step.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className={cn(
              "flex flex-col items-center text-center space-y-2",
              step.status === "complete" ? "text-polygon-primary" : 
              step.status === "current" ? "text-polygon-primary" : 
              "text-gray-500"
            )}
          >
            <motion.div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border transition-colors duration-300",
                step.status === "complete" ? "bg-polygon-primary border-polygon-primary" :
                step.status === "current" ? "border-polygon-primary" :
                "border-gray-500"
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {step.status === "complete" ? (
                <Check className="w-4 h-4 text-white animate-scale-in" />
              ) : step.status === "current" ? (
                <ArrowRight className="w-4 h-4 text-polygon-primary animate-pulse" />
              ) : null}
            </motion.div>
            <span className="text-xs font-medium">{step.name}</span>
          </motion.div>
        ))}
      </div>

      <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
        <motion.h3 
          className="text-xl font-semibold text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Professional Services NFT
        </motion.h3>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Your LinkedIn profile will be analyzed to generate a professional NFT representing your experience and qualifications.
        </motion.p>
        
        {isAnalyzing && <LoadingSlides isAnalyzing={isAnalyzing} />}
        
        {nftPreview ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="animate-fade-in"
          >
            <Card className={cn(
              "relative overflow-hidden transition-all duration-500",
              "bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a]",
              "border border-polygon-primary/20",
              "hover:border-polygon-primary/40",
              "group"
            )}>
              <div className="absolute inset-0 bg-gradient-to-r from-polygon-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative flex flex-col p-8 gap-8">
                {previewImageUrl && (
                  <div className="w-full flex justify-center animate-fade-in">
                    <div className="relative w-32 aspect-square">
                      <div className="absolute inset-0 bg-polygon-primary/20 rounded-full blur-2xl animate-pulse-slow" />
                      <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-polygon-primary to-polygon-secondary rounded-full blur animate-pulse-slow" />
                        <img 
                          src={previewImageUrl} 
                          alt="NFT Preview" 
                          className="relative rounded-full aspect-square object-cover w-full border-4 border-white/10"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-6 animate-fade-in w-full">
                  <div className="space-y-2 text-center">
                    <h4 className="text-3xl font-bold bg-gradient-to-r from-white to-polygon-primary bg-clip-text text-transparent">
                      {nftPreview.name}
                    </h4>
                    <p className="text-xl text-gray-400">Professional Services NFT</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {nftPreview.experiences.map((exp, index) => (
                      <div 
                        key={index}
                        className="animate-fade-in"
                        style={{ animationDelay: `${150 + index * 100}ms` }}
                      >
                        <div className="flex flex-col p-4 rounded-lg bg-black/20 border border-white/5 hover:border-polygon-primary/20 transition-colors">
                          <span className="text-sm text-gray-400 mb-1">{exp.title}</span>
                          <span className="text-lg font-semibold text-white">{exp.company}</span>
                          <span className="text-sm text-gray-400">{exp.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    {!isSavedToBlockchain && (
                      <>
                        <button
                          onClick={handleMintNFT}
                          disabled={isMinting}
                          className={cn(
                            "flex-1 py-4 px-6 rounded-lg font-semibold",
                            "bg-gradient-to-r from-polygon-primary to-polygon-secondary",
                            "text-white shadow-lg",
                            "transition-all duration-300",
                            "hover:shadow-polygon-primary/20 hover:scale-[1.02]",
                            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                            "animate-fade-in delay-300",
                            "flex items-center justify-center gap-2"
                          )}
                        >
                          <Save className="w-4 h-4" />
                          {isMinting ? 'Saving to Blockchain...' : 'Save to Blockchain'}
                        </button>
                        <button
                          onClick={handleAnalyzeProfile}
                          disabled={isAnalyzing}
                          className={cn(
                            "flex-1 py-4 px-6 rounded-lg font-semibold",
                            "bg-white/10 text-white",
                            "transition-all duration-300",
                            "hover:bg-white/20",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            "animate-fade-in delay-300",
                            "flex items-center justify-center gap-2"
                          )}
                        >
                          <RefreshCw className="w-4 h-4" />
                          Re-analyze
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            className="flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={handleAnalyzeProfile}
              disabled={isAnalyzing}
              className={cn(
                isAnalyzing ? 'bg-polygon-primary/50' : 'bg-polygon-primary hover:bg-polygon-primary/90',
                'text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2'
              )}
            >
              <Eye className="w-4 h-4" />
              {isAnalyzing ? 'Analyzing Profile...' : 'Preview NFT'}
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default WalletInfo;
