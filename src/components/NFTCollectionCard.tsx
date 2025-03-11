import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Hexagon, Cpu, Box, Blocks, Binary, Network, Shield, Database } from "lucide-react";
import { useState } from "react";
import { ProfileSection } from "./nft-card/ProfileSection";
import { AttributeBox } from "./nft-card/AttributeBox";
import { ExperienceSection } from "./nft-card/ExperienceSection";
import { VotingSection } from "./nft-card/VotingSection";

interface NFTCollectionCardProps {
  tokenId: string;
  owner: string;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: {
      trait_type: string;
      value: string;
    }[];
    experiences?: {
      title: string;
      company: string;
      duration: string;
      location: string;
    }[];
  };
}

export const NFTCollectionCard = ({ tokenId, owner, metadata }: NFTCollectionCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);

  const getAttribute = (traitType: string) => 
    metadata.attributes?.find(attr => attr.trait_type === traitType)?.value || "N/A";

  if (!metadata) {
    console.error('No metadata provided for NFT:', tokenId);
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto perspective-3000"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="relative overflow-hidden bg-transparent border-0">
        <div className="absolute inset-0 bg-black">
          <motion.div 
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                "radial-gradient(circle at 0% 0%, #00ff87 0%, transparent 50%)",
                "radial-gradient(circle at 100% 100%, #00ff87 0%, transparent 50%)",
                "radial-gradient(circle at 0% 100%, #00ff87 0%, transparent 50%)",
                "radial-gradient(circle at 100% 0%, #00ff87 0%, transparent 50%)",
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full" 
              style={{
                backgroundImage: `
                  linear-gradient(to right, #00ff87 1px, transparent 1px),
                  linear-gradient(to bottom, #00ff87 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />
          </div>
        </div>

        <div className="relative z-10">
          <div className="p-8 space-y-8">
            <motion.div 
              className="text-center space-y-4 relative"
              animate={{ y: isHovered ? -10 : 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00ff87] via-[#60efff] to-[#00ff87] pb-2">
                {metadata.name}
              </h2>
              <div className="flex justify-center gap-2">
                <Hexagon className="w-6 h-6 text-[#00ff87] animate-pulse" />
                <span className="text-[#00ff87] font-mono">ID: {tokenId}</span>
                <Hexagon className="w-6 h-6 text-[#00ff87] animate-pulse" />
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-6">
              <AttributeBox
                icon={Shield}
                label="Governance Power"
                value={getAttribute("Governance Power")}
                className="cyber-box"
              />
              <AttributeBox
                icon={Cpu}
                label="Experience Level"
                value={getAttribute("Experience Level")}
                className="cyber-box"
              />
              <AttributeBox
                icon={Box}
                label="Years in Practice"
                value={getAttribute("Years in Practice")}
                className="cyber-box"
              />
              <AttributeBox
                icon={Binary}
                label="Specialty"
                value={getAttribute("Specialty")}
                className="cyber-box"
              />
              <AttributeBox
                icon={Network}
                label="Client Base"
                value={getAttribute("Client Base")}
                className="cyber-box"
              />
              <AttributeBox
                icon={Database}
                label="Service Line"
                value={getAttribute("Service Line Expertise")}
                className="cyber-box"
              />
            </div>

            {metadata.experiences && (
              <ExperienceSection
                experiences={metadata.experiences}
                isOpen={isExperienceOpen}
                onOpenChange={setIsExperienceOpen}
              />
            )}

            <VotingSection tokenId={tokenId} owner={owner} />
          </div>
        </div>

        <motion.div 
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          animate={{
            background: [
              "radial-gradient(circle at 50% 50%, rgba(0,255,135,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 50%, rgba(0,255,135,0.2) 20%, transparent 70%)",
              "radial-gradient(circle at 50% 50%, rgba(0,255,135,0.1) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </Card>
    </motion.div>
  );
};

export default NFTCollectionCard;
