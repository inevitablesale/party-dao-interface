
import React from "react";
import { Target, Shield, Zap, ArrowRight, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToxicButton } from "@/components/ui/toxic-button";
import { useNFTRoles } from "@/hooks/useNFTRoles";
import { ToxicBadge } from "@/components/ui/toxic-badge";
import { NFTClass } from "@/services/alchemyService";

interface RoleBasedHubProps {
  onSelectRole: (role: string) => void;
}

interface RoleCard {
  title: NFTClass;
  description: string;
  icon: React.ReactNode;
  color: string;
  abilities: string[];
  count: number;
  unlocked: boolean;
}

export const RoleBasedHub: React.FC<RoleBasedHubProps> = ({ onSelectRole }) => {
  const { 
    primaryRole, 
    isSentinel, 
    isSurvivor, 
    isBountyHunter,
    nftsByRole
  } = useNFTRoles();
  
  // Count NFTs by class
  const sentinelCount = nftsByRole.sentinel.length;
  const survivorCount = nftsByRole.survivor.length;
  const bountyHunterCount = nftsByRole.bountyHunter.length;
  
  const roleCards: RoleCard[] = [
    {
      title: "Sentinel",
      description: "Create and manage bounties, fund projects, and oversee wasteland operations",
      icon: <Shield className="h-8 w-8 text-blue-400" />,
      color: "bg-slate-800/90",
      abilities: [
        "Create bounty programs",
        "Fund survivor projects",
        "Deploy reward pools",
        "Monitor hunter performance"
      ],
      count: sentinelCount,
      unlocked: isSentinel
    },
    {
      title: "Survivor",
      description: "Develop technical solutions, create content, and build community projects",
      icon: <Zap className="h-8 w-8 text-purple-400" />,
      color: "bg-slate-800/90",
      abilities: [
        "Create technical projects",
        "Request development funding",
        "Manage contributor tasks",
        "Deploy participation pools"
      ],
      count: survivorCount,
      unlocked: isSurvivor
    },
    {
      title: "Bounty Hunter",
      description: "Complete bounties, earn rewards, and build your reputation in the wasteland",
      icon: <Target className="h-8 w-8 text-toxic-neon" />,
      color: "bg-slate-800/90",
      abilities: [
        "Accept available bounties",
        "Track completion status",
        "Build hunter reputation",
        "Earn role-based rewards"
      ],
      count: bountyHunterCount,
      unlocked: isBountyHunter
    }
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-lg bg-gradient-to-r from-gray-900 to-black border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-4">Wasteland Role Hub</h2>
        <p className="text-gray-300 mb-4">
          Access role-specific interfaces for creating, managing, and completing bounties based on your NFT roles.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roleCards.map((role, index) => (
            <Card 
              key={index} 
              className={`border border-gray-700 ${role.color} hover:border-toxic-neon/40 transition-all duration-300 ${!role.unlocked && 'opacity-80'}`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  {role.icon}
                  {role.count > 0 ? (
                    <ToxicBadge variant="default" className="bg-toxic-neon/20 text-toxic-neon border-toxic-neon/40">
                      {role.count}x
                    </ToxicBadge>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300 font-medium">None</span>
                  )}
                </div>
                <CardTitle className="text-white mt-3 text-2xl">{role.title}</CardTitle>
                <CardDescription className="text-gray-300 mt-1">
                  {role.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {role.abilities.map((ability, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-toxic-neon/80"></div>
                      {ability}
                    </div>
                  ))}
                </div>
                <ToxicButton
                  variant={role.unlocked ? "default" : "ghost"}
                  className="w-full justify-between mt-3"
                  disabled={!role.unlocked}
                  onClick={() => onSelectRole(role.title)}
                >
                  {role.unlocked ? "Access Interface" : "NFT Required"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </ToxicButton>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
