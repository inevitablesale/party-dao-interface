
import { SettlementsHistory } from "@/components/settlements/SettlementsHistory";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Shield, Layers, Network, Blocks, Building2, Biohazard, Target, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ResistanceWalletWidget } from "@/components/wallet/ResistanceWalletWidget";
import { motion } from "framer-motion";
import { useWalletConnection } from "@/hooks/useWalletConnection";

const Proposals = () => {
  const navigate = useNavigate();
  const { isConnected, connect } = useWalletConnection();
  
  const settlementSteps = [{
    icon: Layers,
    title: "Scout Settlements",
    description: "Explore embattled settlements and evaluate their strategic importance. Your support starts with just 1 RD token.",
    points: [
      "Assess settlement defenses",
      "Evaluate resource needs",
      "Review survivor capabilities"
    ]
  }, {
    icon: Network,
    title: "Secure Resources",
    description: "Pledge your resources to help settlements withstand the wasteland threats. Strengthen our network of survivors.",
    points: [
      "Commit needed resources",
      "No upfront resource transfer",
      "Track total community support"
    ]
  }, {
    icon: Blocks,
    title: "Build Strongholds",
    description: "Once resource thresholds are met, settlements become secure strongholds with Resistance backing.",
    points: [
      "Settlement reinforcement",
      "Community integration",
      "Defensive perimeter setup"
    ]
  }];

  const handleAction = () => {
    if (!isConnected) {
      connect();
    } else {
      navigate('/thesis');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Section with Asymmetrical Design */}
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-full h-full bg-gradient-to-b from-toxic-neon/5 to-transparent" />
          <div className="absolute w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9zdmc+')] opacity-10" />
        </div>

        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-start gap-12 pt-32 pb-20 px-4">
            {/* Left Column - Main Content */}
            <div className="flex-1 relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center space-x-2 bg-toxic-neon/10 rounded-full px-4 py-2 mb-6">
                  <Shield className="w-4 h-4 text-toxic-neon" />
                  <span className="text-sm text-toxic-neon">Resistance Protocol</span>
                </div>
                <h1 className="text-5xl font-bold mb-6 text-white">
                  Secure Settlements with
                  <span className="block mt-2 bg-gradient-to-r from-toxic-neon via-toxic-neon/80 to-toxic-neon bg-clip-text text-transparent">
                    Resource Commitments
                  </span>
                </h1>
                <p className="text-lg text-zinc-400 mb-8 max-w-xl">
                  {isConnected 
                    ? "Discover struggling settlements and pledge your resources to protect them. Help survivors establish secure outposts with zero upfront resource transfer."
                    : "Connect your device to scan for settlements in need. Join our coalition in rebuilding civilization from the ashes."}
                </p>
                <Button 
                  onClick={handleAction}
                  className="relative bg-gradient-to-r from-toxic-neon/80 to-toxic-neon/60 hover:from-toxic-neon hover:to-toxic-neon/80 text-black px-8 py-4 rounded-lg font-semibold text-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {isConnected ? "Establish Settlement" : "Connect Device"}
                </Button>
              </motion.div>
            </div>

            {/* Right Column - Process Steps */}
            <div className="lg:w-[450px] space-y-4">
              {settlementSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm p-6 hover:bg-zinc-900/70 transition-all duration-300">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-lg bg-toxic-neon/10 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-toxic-neon" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                          <p className="text-sm text-zinc-400 mb-3">{step.description}</p>
                          <ul className="space-y-1">
                            {step.points.map((point, i) => (
                              <li key={i} className="text-sm text-zinc-500 flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-toxic-neon" />
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Settlements Section - Only shown when connected */}
      {isConnected && (
        <div className="bg-gradient-to-b from-zinc-900/50 to-transparent">
          <div className="container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-toxic-neon/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-toxic-neon" />
                </div>
                <h2 className="text-2xl font-bold text-white">Settlement Outposts</h2>
              </div>
              <SettlementsHistory />
            </motion.div>
          </div>
        </div>
      )}

      <ResistanceWalletWidget />
    </div>
  );
};

export default Proposals;
