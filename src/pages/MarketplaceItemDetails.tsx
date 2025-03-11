import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  Radiation, 
  Shield, 
  Target, 
  Biohazard, 
  Clock, 
  RefreshCw, 
  PlusCircle,
  ArrowRight,
  User,
  Skull,
  AlertTriangle,
  CheckCircle,
  Eye,
  Heart,
  Share2,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModelPreview } from "@/components/marketplace/ModelPreview";
import { CharacterRevealSlider } from "@/components/marketplace/CharacterRevealSlider";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  ToxicCard, 
  ToxicCardContent, 
  ToxicCardFooter, 
  ToxicCardHeader, 
  ToxicCardTitle, 
  ToxicCardDescription 
} from "@/components/ui/toxic-card";
import { ToxicButton } from "@/components/ui/toxic-button";
import { ToxicBadge } from "@/components/ui/toxic-badge";
import { ToxicProgress } from "@/components/ui/toxic-progress";
import { DrippingSlime } from "@/components/ui/dripping-slime";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { MarketplaceListing, MarketplaceListingType } from "@/components/marketplace/MarketplaceListingGrid";

const MOCKUP_LISTINGS: Record<string, MarketplaceListing> = {
  "1": {
    id: 1,
    type: 'bounty-hunter',
    name: "Mutant Zero X-35",
    tokenId: 1,
    price: "15,000 RD",
    seller: "0x1234...5678",
    radiation: {
      level: "High",
      value: 78
    },
    attributes: [
      { trait: "Radiation Level", value: "High" },
      { trait: "Mutation", value: "Neural Hacking" },
      { trait: "Threat Level", value: "Extreme" },
      { trait: "Weapon Proficiency", value: "Advanced" },
      { trait: "Mutation Rating", value: "A+" },
      { trait: "Recovery Time", value: "48 hours" },
      { trait: "Kill Count", value: "37" }
    ],
    status: 'active',
    description: "The Mutant Zero X-35 is a highly advanced bounty hunter, specialized in neural hacking and digital infiltration. Created in the toxic wastes of the old Silicon Valley, this hunter has evolved beyond human capabilities, able to interface directly with any digital system. Extremely dangerous but effective at hunting down the most elusive digital criminals.",
    modelUrl: "https://gateway.pinata.cloud/ipfs/bafybeiheog5wgtnl7ldazmsj3n7xmkgkzpjnix5e4tuxndzw7j3bgkp2n4"
  },
  "2": {
    id: 2,
    type: 'bounty-hunter',
    name: "Toxic Liquidator K-42",
    tokenId: 42,
    price: "32,000 RD",
    seller: "0x8765...4321",
    radiation: {
      level: "Medium",
      value: 54
    },
    attributes: [
      { trait: "Radiation Level", value: "Medium" },
      { trait: "Mutation", value: "Toxic Immunity" },
      { trait: "Threat Level", value: "High" },
      { trait: "Stealth Rating", value: "S-Tier" },
      { trait: "Tracking Ability", value: "Excellent" },
      { trait: "Recovery Time", value: "24 hours" },
      { trait: "Kill Count", value: "22" }
    ],
    status: 'active',
    description: "The Toxic Liquidator K-42 is a specialized hunter that has evolved complete immunity to toxic environments. Born in the chemical wastelands, this tracker can pursue targets through the most hazardous zones where others would perish within minutes. Known for silent eliminations and unparalleled tracking skills.",
    modelUrl: "https://gateway.pinata.cloud/ipfs/bafybeiavqxeov62wgj6upfpvq6g4vpvot4mnwl3ggunxp27sbfjgs4hlfq"
  },
  "3": {
    id: 3,
    type: 'bounty-hunter',
    name: "Mind Raider B-007",
    tokenId: 7,
    price: "50,000 RD",
    seller: "0x9876...5432",
    radiation: {
      level: "Critical",
      value: 92
    },
    attributes: [
      { trait: "Radiation Level", value: "Critical" },
      { trait: "Mutation", value: "Telepathy" },
      { trait: "Threat Level", value: "Catastrophic" },
      { trait: "Mental Intrusion", value: "Unblockable" },
      { trait: "Range", value: "5 miles" },
      { trait: "Recovery Time", value: "72 hours" },
      { trait: "Kill Count", value: "59" }
    ],
    status: 'active',
    description: "The Mind Raider B-007 represents the pinnacle of psychic mutation in the wasteland. Capable of detecting targets from miles away and extracting information directly from their consciousness. The radiation levels of this hunter are near-lethal to normal humans, requiring special containment protocols when not actively hunting. The most expensive but effective hunter in the Resistance arsenal.",
    modelUrl: "https://gateway.pinata.cloud/ipfs/bafybeig47okn4sqqbajhje57htkxw6py3tdms7boyc3hkvvr4qlj7zsabu"
  },
  "4": {
    id: 4,
    type: 'survivor',
    name: "Wasteland Medic R-12",
    tokenId: 12,
    price: "18,500 RD",
    seller: "0x2468...1357",
    radiation: {
      level: "Low",
      value: 28
    },
    attributes: [
      { trait: "Specialty", value: "Medicine" },
      { trait: "Radiation Resistance", value: "Enhanced" },
      { trait: "Settlement", value: "New Haven" },
      { trait: "Surgical Skill", value: "Expert" },
      { trait: "Herb Knowledge", value: "Extensive" },
      { trait: "Field Experience", value: "15 years" },
      { trait: "Lives Saved", value: "104" }
    ],
    status: 'active',
    description: "The Wasteland Medic R-12 is a rare survivor with extensive knowledge of post-apocalyptic medicine. Capable of performing complex surgeries with limited supplies and treating radiation poisoning using synthesized compounds. One of the most valuable members of any settlement, their skills are in constant demand across the wasteland.",
    modelUrl: "https://gateway.pinata.cloud/ipfs/bafybeifzvpyj5znhgjq22cbjyzav5zsvese3m3klbkc4lcdm3fdbbxiooa"
  }
};

type ActivityType = 'listing' | 'offer' | 'sale' | 'transfer' | 'mint';

interface ItemActivity {
  id: string;
  type: ActivityType;
  timestamp: string;
  price?: string;
  from: string;
  to?: string;
  txHash?: string;
}

const MOCKUP_ACTIVITY: ItemActivity[] = [
  {
    id: 'act1',
    type: 'listing',
    timestamp: '2 hours ago',
    price: '15,000 RD',
    from: '0x1234...5678'
  },
  {
    id: 'act2',
    type: 'offer',
    timestamp: '5 hours ago',
    price: '12,000 RD',
    from: '0xabcd...efgh'
  },
  {
    id: 'act3',
    type: 'transfer',
    timestamp: '2 days ago',
    from: '0x7890...1234',
    to: '0x1234...5678',
    txHash: '0xdead...beef'
  },
  {
    id: 'act4',
    type: 'mint',
    timestamp: '5 days ago',
    from: 'Resistance Contract',
    to: '0x7890...1234',
    txHash: '0xface...cafe'
  }
];

const getTypeIcon = (type: MarketplaceListingType) => {
  switch(type) {
    case 'survivor':
      return <Shield className="h-5 w-5 text-toxic-neon" />;
    case 'bounty-hunter':
      return <Target className="h-5 w-5 text-apocalypse-red" />;
    case 'equipment':
      return <Radiation className="h-5 w-5 text-toxic-neon" />;
    case 'settlement':
      return <User className="h-5 w-5 text-toxic-muted" />;
    default:
      return <Biohazard className="h-5 w-5 text-toxic-neon" />;
  }
};

const getRadiationColor = (value: number) => {
  if (value >= 80) return "text-apocalypse-red";
  if (value >= 50) return "text-yellow-400";
  return "text-toxic-neon";
};

const getActivityIcon = (type: ActivityType) => {
  switch(type) {
    case 'listing':
      return <PlusCircle className="h-4 w-4 text-toxic-neon" />;
    case 'offer':
      return <Target className="h-4 w-4 text-yellow-400" />;
    case 'sale':
      return <CheckCircle className="h-4 w-4 text-green-400" />;
    case 'transfer':
      return <ArrowRight className="h-4 w-4 text-blue-400" />;
    case 'mint':
      return <Radiation className="h-4 w-4 text-purple-400" />;
    default:
      return <Clock className="h-4 w-4 text-toxic-muted" />;
  }
};

export default function MarketplaceItemDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isConnected, address } = useCustomWallet();
  const { connect } = useWalletConnection();
  const [item, setItem] = useState<MarketplaceListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchaseStep, setPurchaseStep] = useState(0);
  const [offerAmount, setOfferAmount] = useState('');
  const [revealValue, setRevealValue] = useState(20);
  const [autoRotate, setAutoRotate] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    
    const timer = setTimeout(() => {
      if (id && MOCKUP_LISTINGS[id]) {
        setItem(MOCKUP_LISTINGS[id]);
      }
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  const handlePurchase = () => {
    if (!isConnected) {
      connect();
      return;
    }
    
    setPurchaseStep(1);
  };
  
  const handleMakeOffer = () => {
    if (!isConnected) {
      connect();
      return;
    }
    
    alert('Make offer functionality would be implemented here');
  };
  
  const handleBackToMarketplace = () => {
    navigate(-1);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white relative post-apocalyptic-bg">
        <DrippingSlime position="top" dripsCount={8} showIcons={false} toxicGreen={true} />
        <div className="container px-4 pt-32 pb-16">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Radiation className="w-12 h-12 text-toxic-neon animate-pulse mx-auto mb-4" />
              <h2 className="text-2xl font-mono text-toxic-neon mb-2">SCANNING WASTELAND</h2>
              <p className="text-toxic-muted">Searching for asset data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!item) {
    return (
      <div className="min-h-screen bg-black text-white relative post-apocalyptic-bg">
        <DrippingSlime position="top" dripsCount={8} showIcons={false} toxicGreen={true} />
        <div className="container px-4 pt-32 pb-16">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-apocalypse-red mx-auto mb-4" />
              <h2 className="text-2xl font-mono text-apocalypse-red mb-2">ASSET NOT FOUND</h2>
              <p className="text-white/70 mb-6">This wasteland asset does not exist or has been claimed</p>
              <ToxicButton onClick={handleBackToMarketplace}>
                Return to Wasteland
              </ToxicButton>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white relative post-apocalyptic-bg">
      <DrippingSlime position="top" dripsCount={15} showIcons={false} toxicGreen={true} />
      <div className="dust-particles"></div>
      <div className="fog-overlay"></div>
      
      <div className="container px-4 pt-32 pb-16 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button 
            variant="ghost" 
            onClick={handleBackToMarketplace}
            className="mb-6 text-toxic-neon hover:bg-toxic-neon/10"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <ToxicCard className="bg-black/70 border-toxic-neon/30 mb-6">
                <ToxicCardContent className="p-0">
                  <div className="h-[400px] relative">
                    {item?.modelUrl ? (
                      <ModelPreview 
                        modelUrl={item.modelUrl} 
                        height="400px"
                        width="100%"
                        autoRotate={autoRotate}
                        radiationLevel={revealValue}
                        animateRadiation={true}
                        useRadiationCloud={true}
                        radiationCloudUrl="bafybeiayvmbutisgus45sujbr65sqnpeqcd3vtu6tjxwbmwadf35frszp4"
                        revealValue={100 - revealValue}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gradient-to-b from-toxic-neon/20 to-black/60">
                        <Biohazard className="h-24 w-24 text-toxic-neon/30" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <ToxicButton 
                        variant="outline" 
                        size="sm" 
                        className="bg-black/50 border-toxic-neon/40 text-toxic-neon"
                        onClick={() => setAutoRotate(!autoRotate)}
                      >
                        <RotateCcw className={`h-4 w-4 mr-1 ${autoRotate ? 'animate-spin' : ''}`} />
                        {autoRotate ? 'Stop' : 'Rotate'}
                      </ToxicButton>
                    </div>
                  </div>
                </ToxicCardContent>
                <ToxicCardFooter className="p-3">
                  <CharacterRevealSlider
                    value={revealValue}
                    onChange={setRevealValue}
                    className="w-full"
                  />
                </ToxicCardFooter>
              </ToxicCard>
              
              <ToxicCard className="bg-black/70 border-toxic-neon/30">
                <ToxicCardHeader>
                  <ToxicCardTitle className="flex items-center gap-2">
                    <Radiation className="h-5 w-5" /> Radiation Levels
                  </ToxicCardTitle>
                </ToxicCardHeader>
                <ToxicCardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-white/70">Current Level:</span>
                        <span className={`text-sm font-mono ${getRadiationColor(item?.radiation.value)}`}>
                          {item?.radiation.level} ({item?.radiation.value}%) 
                        </span>
                      </div>
                      <ToxicProgress value={item?.radiation.value} max={100} />
                    </div>
                    
                    <div className="p-3 bg-black/40 border border-yellow-400/30 rounded text-sm">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <p className="text-white/80">
                          Radiation levels above 70% require special containment protocols. 
                          Special handling certification is required for levels above 85%.
                        </p>
                      </div>
                    </div>
                  </div>
                </ToxicCardContent>
              </ToxicCard>
            </div>
            
            <div className="lg:col-span-1">
              <ToxicCard className="bg-black/70 border-toxic-neon/30 mb-6">
                <ToxicCardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <ToxicBadge variant="outline" className="flex items-center gap-1">
                      {getTypeIcon(item?.type)}
                      <span>{item?.type.replace('-', ' ').toUpperCase()}</span>
                    </ToxicBadge>
                    <ToxicBadge variant="secondary" className="flex items-center gap-1 bg-toxic-neon/20 text-toxic-neon">
                      TOKEN #{item?.tokenId}
                    </ToxicBadge>
                  </div>
                  <ToxicCardTitle>{item?.name}</ToxicCardTitle>
                  <ToxicCardDescription>
                    Listed by {item?.seller} • {item?.status === 'active' ? 'Active' : 'Inactive'}
                  </ToxicCardDescription>
                </ToxicCardHeader>
                <ToxicCardContent>
                  <p className="text-white/80 mb-6">
                    {item?.description || "No description available for this wasteland asset."}
                  </p>
                  
                  <div className="p-4 bg-black/50 border border-toxic-neon/30 rounded-lg mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/70">Price</span>
                      <span className="text-2xl font-mono text-toxic-neon">{item?.price}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/60">Approximate USD Value</span>
                      <span className="text-white/80">$150.00</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <ToxicButton 
                      variant="marketplace"
                      className="w-full"
                      onClick={handlePurchase}
                    >
                      {isConnected ? (
                        <>Buy Now</>
                      ) : (
                        <>Connect Wallet</>
                      )}
                    </ToxicButton>
                    
                    <ToxicButton 
                      variant="outline"
                      className="w-full border-toxic-neon/40"
                      onClick={handleMakeOffer}
                    >
                      Make Offer
                    </ToxicButton>
                  </div>
                </ToxicCardContent>
              </ToxicCard>
              
              <ToxicCard className="bg-black/70 border-toxic-neon/30">
                <ToxicCardHeader>
                  <ToxicCardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" /> Market Stats
                  </ToxicCardTitle>
                </ToxicCardHeader>
                <ToxicCardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded bg-black/40 border border-toxic-neon/20">
                        <div className="text-sm text-white/60">Floor Price</div>
                        <div className="text-toxic-neon font-mono">12,500 RD</div>
                      </div>
                      <div className="p-3 rounded bg-black/40 border border-toxic-neon/20">
                        <div className="text-sm text-white/60">24h Volume</div>
                        <div className="text-toxic-neon font-mono">125,240 RD</div>
                      </div>
                      <div className="p-3 rounded bg-black/40 border border-toxic-neon/20">
                        <div className="text-sm text-white/60">Owners</div>
                        <div className="text-toxic-neon font-mono">37 / 142</div>
                      </div>
                      <div className="p-3 rounded bg-black/40 border border-toxic-neon/20">
                        <div className="text-sm text-white/60">Listed</div>
                        <div className="text-toxic-neon font-mono">18%</div>
                      </div>
                    </div>
                  </div>
                </ToxicCardContent>
              </ToxicCard>
            </div>
            
            <div className="lg:col-span-1">
              <Tabs defaultValue="properties" className="w-full mb-6">
                <TabsList className="w-full bg-black/80 border-b border-toxic-neon/30">
                  <TabsTrigger 
                    value="properties" 
                    className="flex-1 data-[state=active]:bg-toxic-neon/10 data-[state=active]:text-toxic-neon"
                  >
                    Properties
                  </TabsTrigger>
                  <TabsTrigger 
                    value="activity" 
                    className="flex-1 data-[state=active]:bg-toxic-neon/10 data-[state=active]:text-toxic-neon"
                  >
                    Activity
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="properties" className="pt-4">
                  <ToxicCard className="bg-black/70 border-toxic-neon/30">
                    <ToxicCardContent>
                      <div className="space-y-3">
                        {item?.attributes && item.attributes.map((attr, index) => (
                          <div key={index} className="flex justify-between p-2 border-b border-toxic-neon/10 last:border-0">
                            <span className="text-white/70">{attr.trait}</span>
                            <span className="text-toxic-neon font-mono">{attr.value}</span>
                          </div>
                        ))}
                      </div>
                    </ToxicCardContent>
                  </ToxicCard>
                </TabsContent>
                
                <TabsContent value="activity" className="pt-4">
                  <ToxicCard className="bg-black/70 border-toxic-neon/30">
                    <ToxicCardContent>
                      <div className="space-y-3">
                        {MOCKUP_ACTIVITY.map((activity) => (
                          <div 
                            key={activity.id} 
                            className="flex items-center p-2 border-b border-toxic-neon/10 last:border-0"
                          >
                            <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center mr-3">
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className="text-white/80">
                                  {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                                </span>
                                <span className="text-toxic-muted text-xs">{activity.timestamp}</span>
                              </div>
                              
                              <div className="flex justify-between mt-1">
                                <span className="text-xs text-white/60">
                                  {activity.type === 'mint' ? 'Minted by' : 
                                   activity.type === 'transfer' ? 'Transferred from' : 'From'}: {activity.from}
                                </span>
                                {activity.price && (
                                  <span className="text-toxic-neon text-xs font-mono">{activity.price}</span>
                                )}
                              </div>
                              
                              {activity.to && (
                                <div className="mt-1 text-xs text-white/60">
                                  To: {activity.to}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ToxicCardContent>
                  </ToxicCard>
                </TabsContent>
              </Tabs>
              
              <div className="flex gap-4">
                <ToxicButton 
                  variant="outline" 
                  className="flex-1 border-toxic-neon/40"
                  onClick={() => {}}
                >
                  <Heart className="h-4 w-4 mr-2" /> Favorite
                </ToxicButton>
                <ToxicButton 
                  variant="outline" 
                  className="flex-1 border-toxic-neon/40"
                  onClick={() => {}}
                >
                  <Share2 className="h-4 w-4 mr-2" /> Share
                </ToxicButton>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
