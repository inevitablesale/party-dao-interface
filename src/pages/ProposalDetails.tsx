
import { useParams, useNavigate } from "react-router-dom";
import { Building2, ChevronLeft, FileText, Target, Users, Info, Shield, Radiation, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResistanceWalletWidget } from "@/components/wallet/ResistanceWalletWidget";
import { ProposalDetailsCard } from "@/components/proposals/ProposalDetailsCard";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProposal } from "@/hooks/useProposal";
import { useWalletConnection } from "@/hooks/useWalletConnection";

const ProposalDetails = () => {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const { isConnected, connect } = useWalletConnection();
  const { data: proposal, isLoading, error } = useProposal(tokenId);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl text-white mb-4">Connect your device to view settlement details</h1>
          <Button onClick={connect} className="bg-gradient-to-r from-toxic-neon/80 to-toxic-neon/60 hover:from-toxic-neon hover:to-toxic-neon/80 text-black">
            Connect Device
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-toxic-neon/5 to-black" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9zdmc+')] opacity-10" />
        </div>
        
        <div className="container mx-auto px-4 pt-24 pb-20 relative z-10 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Button 
              variant="ghost" 
              onClick={() => navigate('/proposals')}
              className="text-white/60 hover:text-white hover:bg-white/5 transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Settlements
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-toxic-neon/20 to-toxic-neon/20 blur-xl" />
              <Building2 className="w-16 h-16 mx-auto text-toxic-neon relative" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-toxic-neon via-toxic-neon/80 to-toxic-neon">
              Support This Settlement
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Commit resources to help this settlement survive and thrive in the wasteland
            </p>
          </motion.div>

          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="bg-black/40 border border-toxic-neon/10 backdrop-blur-sm mx-auto">
              <TabsTrigger value="overview" className="data-[state=active]:bg-toxic-neon/10 data-[state=active]:text-toxic-neon">
                Overview
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-toxic-neon/10 data-[state=active]:text-toxic-neon">
                Details
              </TabsTrigger>
              <TabsTrigger value="investment" className="data-[state=active]:bg-toxic-neon/10 data-[state=active]:text-toxic-neon">
                Resources
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <ProposalDetailsCard tokenId={tokenId} />
            </TabsContent>

            <TabsContent value="details">
              <ProposalDetailsCard tokenId={tokenId} view="details" />
            </TabsContent>

            <TabsContent value="investment">
              <ProposalDetailsCard tokenId={tokenId} view="investment" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <ResistanceWalletWidget />
    </div>
  );
};

export default ProposalDetails;
