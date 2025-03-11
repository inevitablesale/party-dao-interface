import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { User, Briefcase, AlertCircle } from "lucide-react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { analyzeLinkedInProfile } from "@/services/linkedinService";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { MarketplaceMetadata } from "@/types/marketplace";

interface CreateResumeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateResumeOverlay({ isOpen, onClose }: CreateResumeOverlayProps) {
  const { isConnected, address } = useWalletConnection();
  const { user, setShowAuthFlow } = useDynamicContext();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [profileData, setProfileData] = useState<MarketplaceMetadata | null>(null);

  const linkedInUrl = user?.metadata?.["LinkedIn Profile URL"];

  const getIpfsHttpUrl = (ipfsUrl: string) => {
    if (!ipfsUrl) return '';
    if (ipfsUrl.startsWith('ipfs://')) {
      return `https://gateway.pinata.cloud/ipfs/${ipfsUrl.replace('ipfs://', '')}`;
    }
    return ipfsUrl;
  };

  const handleImportFromLinkedIn = async () => {
    if (!linkedInUrl) {
      toast({
        title: "LinkedIn Profile Required",
        description: "Please add your LinkedIn profile URL in your wallet settings.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const metadata = await analyzeLinkedInProfile(linkedInUrl);
      console.log('LinkedIn profile analyzed:', metadata);
      // Convert IPFS URL to HTTP URL if present
      const enrichedMetadata: MarketplaceMetadata = {
        ...metadata,
        imageUrl: getIpfsHttpUrl(metadata.image)
      };
      setProfileData(enrichedMetadata);
      toast({
        title: "Profile Imported",
        description: "Your LinkedIn profile has been successfully imported.",
      });
    } catch (error) {
      console.error('Error analyzing LinkedIn profile:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze your LinkedIn profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRegenerateNFT = async () => {
    setIsAnalyzing(true);
    try {
      const metadata = await analyzeLinkedInProfile(linkedInUrl);
      console.log('LinkedIn profile regenerated:', metadata);
      // Convert IPFS URL to HTTP URL if present
      const enrichedMetadata: MarketplaceMetadata = {
        ...metadata,
        imageUrl: getIpfsHttpUrl(metadata.image)
      };
      setProfileData(enrichedMetadata);
      toast({
        title: "Profile Regenerated",
        description: "Your LinkedIn profile has been regenerated with new variations.",
      });
    } catch (error) {
      console.error('Error regenerating LinkedIn profile:', error);
      toast({
        title: "Regeneration Failed",
        description: "Could not regenerate your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="max-w-4xl h-[90vh] bg-black/95 border-white/10 text-white p-0 flex !flex-col overflow-hidden"
        style={{
          maxHeight: 'calc(100vh - 2rem)'
        }}
      >
        <div className="flex-none px-6 py-4 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <User className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Create Resume NFT</h2>
              <p className="text-sm text-white/60">Showcase your professional experience as an NFT</p>
            </div>
          </div>
        </div>

        <div 
          className="flex-1 min-h-0 overflow-y-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(168, 85, 247, 0.5) rgba(255, 255, 255, 0.05)',
            scrollbarGutter: 'stable',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className="h-full px-6 py-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8 max-w-2xl mx-auto"
            >
              {!user ? (
                <div className="p-4 border border-yellow-500/20 rounded-lg bg-yellow-500/5">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-yellow-500">Authentication Required</h3>
                      <p className="text-sm text-white/60 mt-1">
                        Please log in or sign up to create a Resume NFT.
                      </p>
                      <div className="mt-4">
                        <DynamicWidget />
                      </div>
                    </div>
                  </div>
                </div>
              ) : !linkedInUrl ? (
                <div className="p-4 border border-yellow-500/20 rounded-lg bg-yellow-500/5">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-yellow-500">LinkedIn Profile Required</h3>
                      <p className="text-sm text-white/60 mt-1">
                        Please add your LinkedIn profile URL in your wallet settings to create a Resume NFT.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4 border-yellow-500/20 hover:border-yellow-500/40 text-yellow-500"
                        onClick={() => {
                          document.querySelector('[data-dynamic-settings-button]')?.dispatchEvent(
                            new MouseEvent('click', { bubbles: true })
                          );
                        }}
                      >
                        Open Wallet Settings
                      </Button>
                    </div>
                  </div>
                </div>
              ) : profileData ? (
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-medium">Review Your Resume NFT</h3>
                      <Button
                        variant="outline"
                        className="border-purple-500/20 hover:border-purple-500/40 text-purple-400"
                        onClick={handleRegenerateNFT}
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Regenerating...
                          </>
                        ) : (
                          <>Regenerate NFT</>
                        )}
                      </Button>
                    </div>
                    
                    <div className="relative w-32 h-32 mx-auto">
                      <motion.div 
                        className="absolute inset-0 rounded-full border-2 border-purple-500/30"
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 10,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                      <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-purple-500/20 to-transparent backdrop-blur-sm">
                        {profileData.imageUrl && (
                          <img 
                            src={profileData.imageUrl} 
                            alt={profileData.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error('Image failed to load:', profileData.imageUrl);
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        )}
                        <div className={`absolute inset-0 flex items-center justify-center ${profileData.imageUrl ? 'hidden' : ''}`}>
                          <User className="w-12 h-12 text-purple-400" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-6 space-y-6">
                      <div className="text-center">
                        <h4 className="text-2xl font-medium mb-2">{profileData.name}</h4>
                        <p className="text-white/60">{profileData.description}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-white/80 mb-2">Experience</h4>
                        <div className="space-y-4">
                          {profileData.experiences.map((exp, index) => (
                            <div key={index} className="bg-white/5 p-4 rounded-lg">
                              <h5 className="font-medium">{exp.title}</h5>
                              <p className="text-sm text-white/60">{exp.company}</p>
                              <p className="text-sm text-white/40">{exp.duration} • {exp.location}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-white/80 mb-2">Education</h4>
                        <div className="space-y-2">
                          {profileData.education.map((edu, index) => (
                            <div key={index} className="bg-white/5 p-4 rounded-lg">
                              <h5 className="font-medium">{edu.degree}</h5>
                              <p className="text-sm text-white/60">{edu.school}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-white/80 mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {profileData.skills.map((skill, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4 text-center">
                    <Briefcase className="w-12 h-12 mx-auto text-purple-400" />
                    <h3 className="text-xl font-medium">Import Your Professional Experience</h3>
                    <p className="text-white/60 max-w-md mx-auto">
                      We'll analyze your LinkedIn profile to create a comprehensive Resume NFT that showcases your professional journey.
                    </p>
                  </div>

                  <Button
                    className="w-full h-16 text-lg bg-purple-500 hover:bg-purple-600"
                    onClick={handleImportFromLinkedIn}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing Your Profile...
                      </>
                    ) : (
                      <>
                        Import from LinkedIn
                      </>
                    )}
                  </Button>

                  <p className="text-sm text-white/40 text-center">
                    Using LinkedIn URL: {linkedInUrl}
                  </p>
                </>
              )}
            </motion.div>
          </div>
        </div>

        {profileData && (
          <div className="flex-none px-6 py-4 border-t border-white/10 bg-black/95">
            <div className="max-w-2xl mx-auto flex gap-4">
              <Button
                className="flex-1 bg-transparent border border-white/10 hover:bg-white/5"
                onClick={() => setProfileData(null)}
              >
                Start Over
              </Button>
              <Button
                className="flex-1 bg-purple-500 hover:bg-purple-600"
                onClick={() => {
                  toast({
                    title: "NFT Created",
                    description: "Your Resume NFT has been successfully created!",
                  });
                  onClose();
                }}
              >
                Create NFT
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
