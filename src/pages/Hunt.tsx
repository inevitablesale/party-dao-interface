
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Target, Users, Code, UserPlus, FileText, GalleryVertical, BadgeDollarSign, Shield, Zap } from "lucide-react";
import { useNFTRoles } from "@/hooks/useNFTRoles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToxicButton } from "@/components/ui/toxic-button";
import { useToast } from "@/hooks/use-toast";
import { ReferralSystem } from "@/components/radiation/ReferralSystem";
import { RoleBasedHub } from "@/components/marketplace/RoleBasedHub";
import { BountyHunterHub } from "@/components/marketplace/BountyHunterHub";
import { SentinelHub } from "@/components/marketplace/SentinelHub";
import { SurvivorHub } from "@/components/marketplace/SurvivorHub";
import { NFTClass } from "@/services/alchemyService";

export const Hunt = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    primaryRole, 
    isLoading, 
    isSentinel, 
    isSurvivor, 
    isBountyHunter,
    hasMultipleRoles,
    nftsByRole
  } = useNFTRoles();
  
  const [selectedView, setSelectedView] = useState<'hub' | 'role'>('hub');
  const [activeRole, setActiveRole] = useState<NFTClass>('Unknown');
  
  // Set the active role when primary role is loaded
  useEffect(() => {
    if (primaryRole !== 'Unknown') {
      setActiveRole(primaryRole);
    }
  }, [primaryRole]);
  
  const handleRoleSelect = (role: NFTClass) => {
    setActiveRole(role);
    setSelectedView('role');
  };
  
  // Determine which role-specific component to render
  const renderRoleSpecificContent = () => {
    if (selectedView === 'hub') {
      return <RoleBasedHub onSelectRole={(role) => handleRoleSelect(role as NFTClass)} />;
    }
    
    switch (activeRole) {
      case 'Sentinel':
        return <SentinelHub />;
      case 'Survivor':
        return <SurvivorHub />;
      case 'Bounty Hunter':
        return <BountyHunterHub />;
      default:
        return <RoleBasedHub onSelectRole={(role) => handleRoleSelect(role as NFTClass)} />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-gradient-to-r from-gray-900 to-black py-16 px-4 border-b border-gray-800">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-white flex items-center gap-3">
            <Target className="h-8 w-8 text-toxic-neon" />
            Wasteland Command Center
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Your role-based command center for creating, managing, and completing bounties in the wasteland
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Referral System - Left Side */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="sticky top-20">
              <ReferralSystem />
              
              {/* Role Selection Panel */}
              <Card className="mt-6 bg-gray-900/50 border-toxic-neon/30">
                <CardHeader>
                  <CardTitle className="text-white">Your Roles</CardTitle>
                  <CardDescription>
                    {isLoading ? "Loading your roles..." : 
                      primaryRole !== "Unknown" ? 
                      `Currently active: ${activeRole}` : 
                      "You have no role NFT yet"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isSentinel && (
                      <div className={`flex items-center justify-between p-2 rounded ${activeRole === 'Sentinel' ? 'bg-toxic-neon/10 border border-toxic-neon/40' : ''}`}>
                        <div className="flex items-center gap-3 text-gray-300">
                          <Shield className="h-5 w-5 text-toxic-neon" />
                          <span>Sentinel ({nftsByRole.sentinel.length})</span>
                        </div>
                        <ToxicButton
                          variant={activeRole === 'Sentinel' ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handleRoleSelect('Sentinel')}
                        >
                          {activeRole === 'Sentinel' ? 'Active' : 'Switch'}
                        </ToxicButton>
                      </div>
                    )}
                    
                    {isSurvivor && (
                      <div className={`flex items-center justify-between p-2 rounded ${activeRole === 'Survivor' ? 'bg-toxic-neon/10 border border-toxic-neon/40' : ''}`}>
                        <div className="flex items-center gap-3 text-gray-300">
                          <Zap className="h-5 w-5 text-toxic-neon" />
                          <span>Survivor ({nftsByRole.survivor.length})</span>
                        </div>
                        <ToxicButton
                          variant={activeRole === 'Survivor' ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handleRoleSelect('Survivor')}
                        >
                          {activeRole === 'Survivor' ? 'Active' : 'Switch'}
                        </ToxicButton>
                      </div>
                    )}
                    
                    {isBountyHunter && (
                      <div className={`flex items-center justify-between p-2 rounded ${activeRole === 'Bounty Hunter' ? 'bg-toxic-neon/10 border border-toxic-neon/40' : ''}`}>
                        <div className="flex items-center gap-3 text-gray-300">
                          <Target className="h-5 w-5 text-toxic-neon" />
                          <span>Bounty Hunter ({nftsByRole.bountyHunter.length})</span>
                        </div>
                        <ToxicButton
                          variant={activeRole === 'Bounty Hunter' ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handleRoleSelect('Bounty Hunter')}
                        >
                          {activeRole === 'Bounty Hunter' ? 'Active' : 'Switch'}
                        </ToxicButton>
                      </div>
                    )}
                    
                    {!isSentinel && !isSurvivor && !isBountyHunter && (
                      <div className="flex items-center gap-3 text-gray-300">
                        <Users className="h-5 w-5 text-gray-500" />
                        <span>No Role-Based Access</span>
                      </div>
                    )}
                    
                    {(isSentinel || isSurvivor || isBountyHunter) && (
                      <ToxicButton
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => setSelectedView('hub')}
                      >
                        Back to Hub
                      </ToxicButton>
                    )}
                    
                    {(!isSentinel && !isSurvivor && !isBountyHunter) && (
                      <ToxicButton
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => navigate("/buy-membership-nft")}
                      >
                        Get a Role NFT
                      </ToxicButton>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Main Content - Role Based Interface */}
          <div className="lg:col-span-9 order-1 lg:order-2">
            {renderRoleSpecificContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hunt;
