
import React, { useState, useEffect } from "react";
import { Shield, Users, BadgeDollarSign, Target, EyeIcon, Clipboard, Plus, Wallet, Scroll, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ToxicCard, ToxicCardContent, ToxicCardHeader, ToxicCardTitle, ToxicCardDescription, ToxicCardFooter } from "@/components/ui/toxic-card";
import { ToxicButton } from "@/components/ui/toxic-button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { NFTReferralBountyForm } from "./NFTReferralBountyForm";
import { getBounties, Bounty } from "@/services/bountyService";

// Mock bounty templates
const bountyTemplates = [
  {
    title: "NFT Referral Program",
    description: "Create a bounty for community members to refer new users to mint NFTs",
    pool: "Reward Pool",
    reward: "Fixed amount per successful referral",
    icon: <Target className="h-6 w-6 text-toxic-neon" />
  },
  {
    title: "Talent Acquisition",
    description: "Hire bounty hunters to identify and recruit talent for your settlement",
    pool: "Reward Pool",
    reward: "Percentage of placement fee",
    icon: <Users className="h-6 w-6 text-toxic-neon" />
  },
  {
    title: "Business Development",
    description: "Establish partnerships and expand network through bounty hunters",
    pool: "Revenue Share Pool",
    reward: "Commission-based on deals closed",
    icon: <BadgeDollarSign className="h-6 w-6 text-toxic-neon" />
  }
];

export const SentinelHub: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Mock sentinel stats
  const sentinelStats = {
    totalSpent: "$1900",
    activeBounties: 3,
    hiredHunters: 16,
    averageSuccessRate: 78,
    treasury: "$2800"
  };
  
  // Load bounties from service
  useEffect(() => {
    const loadBounties = async () => {
      setLoading(true);
      try {
        const fetchedBounties = await getBounties();
        setBounties(fetchedBounties);
        
        // Update sentinel stats based on real data
        if (fetchedBounties.length > 0) {
          sentinelStats.activeBounties = fetchedBounties.filter(b => b.status === "active").length;
          sentinelStats.totalSpent = `$${fetchedBounties.reduce((total, b) => total + b.usedBudget, 0)}`;
        }
      } catch (error) {
        console.error("Error loading bounties:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadBounties();
  }, [activeTab]);
  
  // Handler for creating new bounty
  const handleCreateBounty = (template?: any) => {
    setSelectedTemplate(template);
    setActiveTab("create-form");
  };
  
  // Handler to go back to templates
  const handleBackToTemplates = () => {
    setSelectedTemplate(null);
    setActiveTab("create");
  };

  // Calculate remaining budget for a bounty
  const getRemainingBudget = (bounty: Bounty) => {
    return bounty.totalBudget - bounty.usedBudget;
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-toxic-neon/20 data-[state=active]:text-toxic-neon">
            <Shield className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="create" className="data-[state=active]:bg-toxic-neon/20 data-[state=active]:text-toxic-neon">
            <Plus className="h-4 w-4 mr-2" />
            Create Bounty
          </TabsTrigger>
          <TabsTrigger value="manage" className="data-[state=active]:bg-toxic-neon/20 data-[state=active]:text-toxic-neon">
            <Clipboard className="h-4 w-4 mr-2" />
            Manage Bounties
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          {/* Sentinel Stats Dashboard */}
          <ToxicCard className="bg-gray-900/60 border border-toxic-neon/40">
            <ToxicCardHeader>
              <div className="flex justify-between items-center">
                <ToxicCardTitle>Sentinel Command Center</ToxicCardTitle>
                <span className="text-toxic-neon font-mono text-sm px-3 py-1 rounded-full bg-black/60 border border-toxic-neon/40">
                  <Wallet className="h-4 w-4 mr-1 inline" /> Treasury: {sentinelStats.treasury}
                </span>
              </div>
              <ToxicCardDescription>
                Manage your bounty programs and monitor hunter performance
              </ToxicCardDescription>
            </ToxicCardHeader>
            <ToxicCardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-black/50 p-4 rounded-lg border border-toxic-neon/20">
                  <div className="flex items-center gap-2 mb-2">
                    <BadgeDollarSign className="h-5 w-5 text-toxic-neon" />
                    <span className="text-gray-400 text-sm">Total Spent</span>
                  </div>
                  <span className="text-2xl font-bold text-white block">{sentinelStats.totalSpent}</span>
                </div>
                
                <div className="bg-black/50 p-4 rounded-lg border border-toxic-neon/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Clipboard className="h-5 w-5 text-toxic-neon" />
                    <span className="text-gray-400 text-sm">Active Bounties</span>
                  </div>
                  <span className="text-2xl font-bold text-white block">{sentinelStats.activeBounties}</span>
                </div>
                
                <div className="bg-black/50 p-4 rounded-lg border border-toxic-neon/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-toxic-neon" />
                    <span className="text-gray-400 text-sm">Hired Hunters</span>
                  </div>
                  <span className="text-2xl font-bold text-white block">{sentinelStats.hiredHunters}</span>
                </div>
                
                <div className="bg-black/50 p-4 rounded-lg border border-toxic-neon/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-toxic-neon" />
                    <span className="text-gray-400 text-sm">Success Rate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">{sentinelStats.averageSuccessRate}%</span>
                    <Progress value={sentinelStats.averageSuccessRate} className="h-2 w-16 mt-1" />
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Active Bounty Programs</h3>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8 text-gray-400">Loading bounties...</div>
                  ) : bounties.length === 0 ? (
                    <div className="text-center py-8 bg-black/30 rounded-lg border border-toxic-neon/20">
                      <Clipboard className="h-8 w-8 text-toxic-neon/30 mx-auto mb-3" />
                      <p className="text-white/70 mb-4">No active bounties yet</p>
                      <ToxicButton variant="primary" onClick={() => setActiveTab("create")}>
                        Create Your First Bounty
                      </ToxicButton>
                    </div>
                  ) : (
                    bounties.map((bounty) => (
                      <div key={bounty.id} className="bg-black/30 p-4 rounded-lg border border-toxic-neon/30 hover:border-toxic-neon/50 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-white font-medium">{bounty.name}</h4>
                            <p className="text-sm text-gray-400">{bounty.description.substring(0, 50)}...</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-toxic-neon/20 text-toxic-neon">
                              {bounty.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                          <div>
                            <p className="text-gray-400">Budget</p>
                            <p className="text-white font-mono">{bounty.totalBudget} MATIC</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Used</p>
                            <p className="text-white font-mono">{bounty.usedBudget} MATIC</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Remaining</p>
                            <p className="text-toxic-neon font-mono">{getRemainingBudget(bounty)} MATIC</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Successful</p>
                            <p className="text-white font-mono">{bounty.successCount} referrals</p>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <div className="flex justify-between items-center mb-1 text-xs text-gray-400">
                            <span>Budget Used</span>
                            <span>{((bounty.usedBudget / bounty.totalBudget) * 100).toFixed(0)}%</span>
                          </div>
                          <Progress value={(bounty.usedBudget / bounty.totalBudget) * 100} className="h-1.5" />
                        </div>
                        
                        <div className="flex justify-end mt-4">
                          <ToxicButton variant="tertiary" size="sm">
                            <EyeIcon className="h-4 w-4 mr-1" />
                            View Details
                          </ToxicButton>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </ToxicCardContent>
            <ToxicCardFooter>
              <ToxicButton variant="outline" onClick={() => setActiveTab("create")}>
                <Plus className="h-4 w-4 mr-1" />
                Create New Bounty
              </ToxicButton>
            </ToxicCardFooter>
          </ToxicCard>
        </TabsContent>
        
        <TabsContent value="create" className="space-y-6">
          <Card className="bg-gray-900/60 border border-toxic-neon/20">
            <CardHeader>
              <CardTitle className="text-white">Create a Bounty Program</CardTitle>
              <CardDescription>
                Setup a new bounty program using one of our templates or create a custom one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {bountyTemplates.map((template, idx) => (
                  <Card key={idx} className="bg-black/40 border-toxic-neon/20 hover:border-toxic-neon/40 transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        {template.icon}
                        <CardTitle className="text-lg text-white">{template.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-sm mb-4">{template.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Pool Type:</span>
                          <span className="text-toxic-neon">{template.pool}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Reward Structure:</span>
                          <span className="text-white">{template.reward}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <ToxicButton 
                        variant="outline"
                        className="w-full"
                        onClick={() => handleCreateBounty(template)}
                      >
                        Use Template
                      </ToxicButton>
                    </CardFooter>
                  </Card>
                ))}
                
                {/* Custom Bounty Card */}
                <Card className="bg-black/40 border-dashed border-toxic-neon/30 hover:border-toxic-neon/50 transition-all">
                  <CardContent className="flex flex-col items-center justify-center h-full py-10">
                    <div className="rounded-full bg-toxic-neon/10 p-3 mb-4">
                      <Plus className="h-6 w-6 text-toxic-neon" />
                    </div>
                    <h3 className="text-white font-medium mb-2">Custom Bounty</h3>
                    <p className="text-gray-400 text-sm text-center mb-4">
                      Create a completely customized bounty program with your own parameters
                    </p>
                    <ToxicButton 
                      variant="outline"
                      onClick={() => handleCreateBounty()}
                    >
                      Start from Scratch
                    </ToxicButton>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <ToxicButton variant="ghost" onClick={() => setActiveTab("dashboard")}>
                Back to Dashboard
              </ToxicButton>
              
              <ToxicButton variant="tertiary">
                <Scroll className="h-4 w-4 mr-1" />
                View Bounty Documentation
              </ToxicButton>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="create-form" className="space-y-6">
          <NFTReferralBountyForm 
            template={selectedTemplate} 
            onBack={handleBackToTemplates}
          />
        </TabsContent>
        
        <TabsContent value="manage" className="space-y-6">
          <Card className="bg-gray-900/60 border border-toxic-neon/20">
            <CardHeader>
              <CardTitle className="text-white">Manage Your Bounties</CardTitle>
              <CardDescription>
                View, edit and monitor all your existing bounty programs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-gray-400">Loading bounties...</div>
              ) : bounties.length === 0 ? (
                <div className="text-center py-8 bg-black/30 rounded-lg border border-toxic-neon/20">
                  <Clipboard className="h-8 w-8 text-toxic-neon/30 mx-auto mb-3" />
                  <p className="text-white/70 mb-4">No bounties have been created yet</p>
                  <ToxicButton variant="primary" onClick={() => setActiveTab("create")}>
                    Create Your First Bounty
                  </ToxicButton>
                </div>
              ) : (
                <div className="space-y-4">
                  {bounties.map((bounty) => (
                    <div key={bounty.id} className="bg-black/30 p-4 rounded-lg border border-toxic-neon/30 hover:border-toxic-neon/50 transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-medium">{bounty.name}</h4>
                          <p className="text-sm text-gray-400">{bounty.description.substring(0, 50)}...</p>
                        </div>
                        <div className="flex gap-2">
                          <ToxicButton variant="ghost" size="sm">
                            <EyeIcon className="h-4 w-4" />
                          </ToxicButton>
                          <ToxicButton variant="ghost" size="sm">
                            <Clipboard className="h-4 w-4" />
                          </ToxicButton>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-gray-400">Budget</p>
                          <p className="text-white font-mono">{bounty.totalBudget} MATIC</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Used</p>
                          <p className="text-white font-mono">{bounty.usedBudget} MATIC</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Remaining</p>
                          <p className="text-toxic-neon font-mono">{getRemainingBudget(bounty)} MATIC</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Successful</p>
                          <p className="text-white font-mono">{bounty.successCount} referrals</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-4 gap-2">
                        <ToxicButton variant="tertiary" size="sm">
                          Edit Bounty
                        </ToxicButton>
                        <ToxicButton variant="outline" size="sm">
                          View Submissions
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </ToxicButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
