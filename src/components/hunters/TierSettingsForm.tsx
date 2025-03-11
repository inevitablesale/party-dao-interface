
import React, { useState } from "react";
import { HunterTierLevel, BountyMetadata, HunterTier, PerformanceMultipliers } from "@/types/content";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Award, Trophy, Crown, Plus, TrashIcon, Save, ArrowRight, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateBountyHunterTiers } from "@/services/bountyService";
import { getDefaultHunterTiers, getDefaultPerformanceMultipliers } from "@/services/hunterPerformanceService";
import { HunterTierBadge } from "./HunterTierBadge";

interface TierSettingsFormProps {
  bountyId: string;
  hunterTiers?: BountyMetadata['hunterTiers'];
  performanceMultipliers?: BountyMetadata['performanceMultipliers'];
  wallet: any;
  onSaved?: () => void;
}

export const TierSettingsForm: React.FC<TierSettingsFormProps> = ({
  bountyId,
  hunterTiers,
  performanceMultipliers,
  wallet,
  onSaved
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize state with provided data or defaults
  const [tiersEnabled, setTiersEnabled] = useState(hunterTiers?.enabled ?? true);
  const [tiers, setTiers] = useState<HunterTier[]>(
    hunterTiers?.tiers ?? getDefaultHunterTiers().tiers
  );
  const [defaultTier, setDefaultTier] = useState<HunterTierLevel>(
    hunterTiers?.defaultTier ?? "bronze"
  );
  
  const [multipliers, setMultipliers] = useState<PerformanceMultipliers>(
    performanceMultipliers ?? getDefaultPerformanceMultipliers()
  );
  
  const tierIcons = {
    bronze: Shield,
    silver: Award,
    gold: Trophy,
    platinum: Crown
  };
  
  const handleTierChange = (index: number, field: keyof HunterTier, value: any) => {
    const updatedTiers = [...tiers];
    updatedTiers[index] = {
      ...updatedTiers[index],
      [field]: field === 'requiredReferrals' || field === 'requiredSuccessRate' || field === 'rewardMultiplier'
        ? parseFloat(value)
        : value
    };
    setTiers(updatedTiers);
  };
  
  const handleBenefitChange = (tierIndex: number, benefitIndex: number, value: string) => {
    const updatedTiers = [...tiers];
    const benefits = [...(updatedTiers[tierIndex].benefits || [])];
    benefits[benefitIndex] = value;
    updatedTiers[tierIndex].benefits = benefits;
    setTiers(updatedTiers);
  };
  
  const addBenefit = (tierIndex: number) => {
    const updatedTiers = [...tiers];
    if (!updatedTiers[tierIndex].benefits) {
      updatedTiers[tierIndex].benefits = [];
    }
    updatedTiers[tierIndex].benefits.push("");
    setTiers(updatedTiers);
  };
  
  const removeBenefit = (tierIndex: number, benefitIndex: number) => {
    const updatedTiers = [...tiers];
    updatedTiers[tierIndex].benefits.splice(benefitIndex, 1);
    setTiers(updatedTiers);
  };
  
  const handleMultiplierChange = (
    category: keyof PerformanceMultipliers,
    threshold: string,
    value: string
  ) => {
    const thresholdNum = parseInt(threshold);
    const valueNum = parseFloat(value);
    
    if (isNaN(thresholdNum) || isNaN(valueNum)) return;
    
    setMultipliers(prev => {
      const categoryMultipliers = { ...prev[category] };
      categoryMultipliers[thresholdNum] = valueNum;
      
      return {
        ...prev,
        [category]: categoryMultipliers
      };
    });
  };
  
  const addMultiplier = (category: keyof PerformanceMultipliers) => {
    setMultipliers(prev => {
      // Find an unused threshold value
      const existingThresholds = Object.keys(prev[category]).map(Number).sort((a, b) => a - b);
      let newThreshold = 50; // Default
      
      if (existingThresholds.length > 0) {
        // Find a value between existing thresholds or higher than the highest
        for (let i = 0; i < existingThresholds.length; i++) {
          if (i < existingThresholds.length - 1) {
            const gap = existingThresholds[i + 1] - existingThresholds[i];
            if (gap > 10) {
              newThreshold = existingThresholds[i] + Math.floor(gap / 2);
              break;
            }
          } else {
            newThreshold = existingThresholds[i] + 10;
          }
        }
      }
      
      return {
        ...prev,
        [category]: {
          ...prev[category],
          [newThreshold]: 1.1
        }
      };
    });
  };
  
  const removeMultiplier = (category: keyof PerformanceMultipliers, threshold: number) => {
    setMultipliers(prev => {
      const categoryMultipliers = { ...prev[category] };
      delete categoryMultipliers[threshold];
      
      return {
        ...prev,
        [category]: categoryMultipliers
      };
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare the hunter tiers configuration
      const hunterTiersConfig = {
        enabled: tiersEnabled,
        tiers: tiers,
        defaultTier
      };
      
      // Call the update function
      const result = await updateBountyHunterTiers(
        bountyId,
        hunterTiersConfig,
        multipliers,
        wallet
      );
      
      if (!result.success) {
        throw new Error(result.error || "Failed to update tier settings");
      }
      
      toast({
        title: "Tier Settings Updated",
        description: "Your hunter tier settings have been saved successfully."
      });
      
      if (onSaved) {
        onSaved();
      }
    } catch (error) {
      console.error("Error saving tier settings:", error);
      toast({
        title: "Error Saving Settings",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Hunter Tier Settings</CardTitle>
            <Switch 
              checked={tiersEnabled} 
              onCheckedChange={setTiersEnabled}
              aria-label="Enable performance tiers"
            />
          </div>
          <CardDescription>
            Configure performance-based tiers and rewards for your bounty hunters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tiers">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="tiers">Hunter Tiers</TabsTrigger>
              <TabsTrigger value="multipliers">Performance Multipliers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tiers" className="space-y-4">
              <div className="flex items-center mb-2">
                <Label className="mr-2">Default Tier</Label>
                <select
                  className="bg-background border border-input rounded px-3 py-2 text-sm"
                  value={defaultTier}
                  onChange={(e) => setDefaultTier(e.target.value as HunterTierLevel)}
                >
                  {tiers.map((tier) => (
                    <option key={tier.level} value={tier.level}>
                      {tier.level.charAt(0).toUpperCase() + tier.level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              {tiers.map((tier, index) => {
                const TierIcon = tierIcons[tier.level];
                return (
                  <Card key={tier.level} className="overflow-hidden">
                    <div className={
                      tier.level === "bronze" ? "bg-amber-700/20" :
                      tier.level === "silver" ? "bg-slate-400/20" :
                      tier.level === "gold" ? "bg-yellow-500/20" :
                      "bg-cyan-400/20"
                    } style={{ height: "4px" }} />
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <TierIcon className={
                          tier.level === "bronze" ? "text-amber-700" :
                          tier.level === "silver" ? "text-slate-400" :
                          tier.level === "gold" ? "text-yellow-500" :
                          "text-cyan-400"
                        } />
                        <CardTitle className="ml-2 capitalize">{tier.level} Tier</CardTitle>
                        <HunterTierBadge 
                          tier={tier.level} 
                          multiplier={tier.rewardMultiplier} 
                          compact 
                          className="ml-auto" 
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Required Referrals</Label>
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            value={tier.requiredReferrals}
                            onChange={(e) => handleTierChange(index, 'requiredReferrals', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Required Success Rate (%)</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={tier.requiredSuccessRate}
                            onChange={(e) => handleTierChange(index, 'requiredSuccessRate', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Reward Multiplier</Label>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            step="0.1"
                            value={tier.rewardMultiplier}
                            onChange={(e) => handleTierChange(index, 'rewardMultiplier', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={tier.description}
                          onChange={(e) => handleTierChange(index, 'description', e.target.value)}
                          className="mt-1"
                          rows={2}
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label>Benefits</Label>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => addBenefit(index)}
                          >
                            <Plus className="h-3.5 w-3.5 mr-1" />
                            Add
                          </Button>
                        </div>
                        
                        {tier.benefits?.map((benefit, benefitIndex) => (
                          <div key={benefitIndex} className="flex items-center mb-2">
                            <Input
                              value={benefit}
                              onChange={(e) => handleBenefitChange(index, benefitIndex, e.target.value)}
                              placeholder="Enter a benefit for this tier"
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => removeBenefit(index, benefitIndex)}
                              className="ml-2"
                            >
                              <TrashIcon className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
            
            <TabsContent value="multipliers" className="space-y-6">
              {/* Success Rate Multipliers */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium">Success Rate Multipliers</h3>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addMultiplier('successRate')}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Threshold
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(multipliers.successRate || {})
                    .sort(([a], [b]) => parseInt(a) - parseInt(b))
                    .map(([threshold, value]) => (
                      <div key={threshold} className="flex items-center gap-3">
                        <div className="flex-1">
                          <Label className="text-xs">Threshold (%)</Label>
                          <Input
                            type="number"
                            min="0" 
                            max="100"
                            value={threshold}
                            onChange={(e) => {
                              if (e.target.value && !isNaN(parseFloat(e.target.value))) {
                                const oldValue = multipliers.successRate[parseInt(threshold)];
                                removeMultiplier('successRate', parseInt(threshold));
                                handleMultiplierChange('successRate', e.target.value, oldValue.toString());
                              }
                            }}
                          />
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-500" />
                        <div className="flex-1">
                          <Label className="text-xs">Multiplier</Label>
                          <Input
                            type="number"
                            min="1"
                            step="0.05"
                            value={value}
                            onChange={(e) => handleMultiplierChange('successRate', threshold, e.target.value)}
                          />
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeMultiplier('successRate', parseInt(threshold))}
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
              
              {/* Total Completed Multipliers */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium">Total Completed Multipliers</h3>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addMultiplier('totalCompleted')}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Threshold
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(multipliers.totalCompleted || {})
                    .sort(([a], [b]) => parseInt(a) - parseInt(b))
                    .map(([threshold, value]) => (
                      <div key={threshold} className="flex items-center gap-3">
                        <div className="flex-1">
                          <Label className="text-xs">Referrals Count</Label>
                          <Input
                            type="number"
                            min="1"
                            value={threshold}
                            onChange={(e) => {
                              if (e.target.value && !isNaN(parseFloat(e.target.value))) {
                                const oldValue = multipliers.totalCompleted[parseInt(threshold)];
                                removeMultiplier('totalCompleted', parseInt(threshold));
                                handleMultiplierChange('totalCompleted', e.target.value, oldValue.toString());
                              }
                            }}
                          />
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-500" />
                        <div className="flex-1">
                          <Label className="text-xs">Multiplier</Label>
                          <Input
                            type="number"
                            min="1"
                            step="0.05"
                            value={value}
                            onChange={(e) => handleMultiplierChange('totalCompleted', threshold, e.target.value)}
                          />
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeMultiplier('totalCompleted', parseInt(threshold))}
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
              
              {/* Time to Complete Multipliers */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium">Time to Complete Multipliers</h3>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addMultiplier('timeToComplete')}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Threshold
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(multipliers.timeToComplete || {})
                    .sort(([a], [b]) => parseInt(b) - parseInt(a))  // Sort descending for time
                    .map(([threshold, value]) => (
                      <div key={threshold} className="flex items-center gap-3">
                        <div className="flex-1">
                          <Label className="text-xs">Hours Under</Label>
                          <Input
                            type="number"
                            min="1"
                            value={threshold}
                            onChange={(e) => {
                              if (e.target.value && !isNaN(parseFloat(e.target.value))) {
                                const oldValue = multipliers.timeToComplete[parseInt(threshold)];
                                removeMultiplier('timeToComplete', parseInt(threshold));
                                handleMultiplierChange('timeToComplete', e.target.value, oldValue.toString());
                              }
                            }}
                          />
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-500" />
                        <div className="flex-1">
                          <Label className="text-xs">Multiplier</Label>
                          <Input
                            type="number"
                            min="1"
                            step="0.05"
                            value={value}
                            onChange={(e) => handleMultiplierChange('timeToComplete', threshold, e.target.value)}
                          />
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeMultiplier('timeToComplete', parseInt(threshold))}
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <div className="spinner mr-2"></div>
            Saving Tier Settings...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Save Tier Settings
          </>
        )}
      </Button>
    </form>
  );
};

export default TierSettingsForm;
