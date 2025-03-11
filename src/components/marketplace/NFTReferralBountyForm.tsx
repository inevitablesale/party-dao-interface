import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Award, Coins, Link, UserPlus, Wallet, Diamond, Gift, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ToxicCard } from "@/components/ui/toxic-card";
import { ToxicButton } from "@/components/ui/toxic-button";
import { Progress } from "@/components/ui/progress";
import { createBounty } from "@/services/bountyService";
import { usePartyTransactions } from "@/hooks/usePartyTransactions";
import { calculatePriceStructure, formatCryptoAmount } from "@/utils/priceCalculator";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { RESISTANCE_NFT_ADDRESS } from "@/lib/constants";

const nftReferralFormSchema = z.object({
  name: z.string().min(3, "Bounty name must be at least 3 characters"),
  description: z.string().min(10, "Please provide a more detailed description"),
  rewardPerReferral: z.coerce.number().min(1, "Minimum reward is 1 MATIC").max(1000, "Maximum reward is 1000 MATIC"),
  totalBudget: z.coerce.number().min(20, "Minimum budget is 20 MATIC"),
  duration: z.coerce.number().min(1, "Minimum duration is 1 day").max(365, "Maximum duration is 365 days"),
  maxReferralsPerHunter: z.coerce.number().min(1, "Minimum is 1 referral per hunter").optional().default(0),
  allowPublicHunters: z.boolean().default(true),
  requireVerification: z.boolean().default(false),
  eligibleNFTs: z.string().optional(),
  successCriteria: z.string().min(5, "Please specify success criteria"),
});

type NFTReferralFormValues = z.infer<typeof nftReferralFormSchema>;

interface NFTReferralBountyFormProps {
  template?: any;
  onBack?: () => void;
}

export function NFTReferralBountyForm({ template, onBack }: NFTReferralBountyFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createSettlement, isProcessing } = usePartyTransactions();
  const [estimatedGasCost, setEstimatedGasCost] = useState("~1.2 MATIC");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isConnected, address, primaryWallet } = useWalletConnection();
  
  const defaultValues: NFTReferralFormValues = {
    name: template?.title || "NFT Referral Program",
    description: template?.description || "Reward community members for referring new users to mint NFTs",
    rewardPerReferral: 20,
    totalBudget: 500,
    duration: 30,
    maxReferralsPerHunter: 0,
    allowPublicHunters: true,
    requireVerification: false,
    eligibleNFTs: RESISTANCE_NFT_ADDRESS,
    successCriteria: "User must mint at least one NFT using the referral link",
  };
  
  const form = useForm<NFTReferralFormValues>({
    resolver: zodResolver(nftReferralFormSchema),
    defaultValues,
  });
  
  const watchTotalBudget = form.watch("totalBudget");
  const watchRewardPerReferral = form.watch("rewardPerReferral");
  
  const estimatedReferrals = Math.floor(watchTotalBudget / watchRewardPerReferral);
  
  const priceBreakdown = calculatePriceStructure(
    watchTotalBudget - (watchTotalBudget * 0.02),
    'MATIC'
  );
  
  const onSubmit = async (data: NFTReferralFormValues) => {
    try {
      if (!isConnected || !address) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your wallet to create a bounty",
          variant: "destructive"
        });
        return;
      }
      
      setIsSubmitting(true);
      
      console.log("Wallet state during submission:", {
        isConnected,
        address,
        primaryWallet: !!primaryWallet
      });
      
      const result = await createBounty({
        name: data.name,
        description: data.description,
        rewardType: "fixed",
        rewardAmount: data.rewardPerReferral,
        totalBudget: data.totalBudget,
        duration: data.duration,
        maxReferralsPerHunter: data.maxReferralsPerHunter || 0,
        allowPublicHunters: data.allowPublicHunters,
        requireVerification: data.requireVerification,
        eligibleNFTs: data.eligibleNFTs?.split(",").map(addr => addr.trim()) || [],
        successCriteria: data.successCriteria,
        bountyType: "nft_referral",
      }, primaryWallet);
      
      if (result) {
        toast({
          title: "Bounty Created!",
          description: "Your NFT referral bounty has been created successfully",
        });
        navigate("/bounty/management");
      }
    } catch (error: any) {
      console.error("Error creating bounty:", error);
      
      if (error.code === 4001) {
        toast({
          title: "Transaction Rejected",
          description: "You rejected the transaction in your wallet",
          variant: "destructive"
        });
      } else if (error.message?.includes("network")) {
        toast({
          title: "Network Error",
          description: "Please make sure you're connected to Polygon network",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Failed to Create Bounty",
          description: error.message || "There was an error creating your bounty",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="bg-gray-900/60 border border-toxic-neon/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Gift className="h-5 w-5 text-toxic-neon" />
              Create NFT Referral Bounty
            </CardTitle>
            <CardDescription>
              Set up a bounty program that rewards hunters for bringing in NFT minters
            </CardDescription>
          </div>
          {onBack && (
            <Button variant="ghost" onClick={onBack}>
              Back to Templates
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bounty Name</FormLabel>
                      <FormControl>
                        <Input placeholder="NFT Referral Program" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Describe your bounty program" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="rewardPerReferral"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reward Per Referral (MATIC)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Amount paid to hunter per successful referral
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="totalBudget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Budget (MATIC)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Maximum total to spend on this bounty
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        How long will this bounty program run?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="eligibleNFTs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Eligible NFT Contracts</FormLabel>
                      <FormControl>
                        <Input placeholder="Contract addresses, comma separated" {...field} />
                      </FormControl>
                      <FormDescription>
                        Which NFT contracts are eligible for referral rewards?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="successCriteria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Success Criteria</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., User mints at least 1 NFT" {...field} />
                      </FormControl>
                      <FormDescription>
                        What must happen for a referral to be successful?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-6">
                <ToxicCard className="border border-toxic-neon/30 bg-black/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-toxic-neon text-lg">Bounty Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Reward Per Referral:</span>
                        <span className="text-white font-mono">{watchRewardPerReferral} MATIC</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Platform Fee (2%):</span>
                        <span className="text-white font-mono">{(watchTotalBudget * 0.02).toFixed(2)} MATIC</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Net Reward Pool:</span>
                        <span className="text-toxic-neon font-mono">{(watchTotalBudget * 0.98).toFixed(2)} MATIC</span>
                      </div>
                      <Separator className="my-2 bg-gray-800" />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Estimated Referrals:</span>
                        <span className="text-white font-mono">{estimatedReferrals}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Estimated Gas Cost:</span>
                        <span className="text-white font-mono">{estimatedGasCost}</span>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-sm text-gray-400 mb-2">Referral Link Format:</p>
                      <code className="bg-black/60 text-toxic-neon p-2 rounded text-xs block overflow-x-auto">
                        https://resistance-dao.com/r/{'{bountyId}'}/{'{referrerAddress}'}
                      </code>
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-sm text-gray-400 mb-1">Pool Utilization:</p>
                      <Progress value={0} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0 Used</span>
                        <span>{estimatedReferrals} Available</span>
                      </div>
                    </div>
                  </CardContent>
                </ToxicCard>
                
                <div className="space-y-4 bg-black/30 p-4 rounded-lg border border-gray-800">
                  <h3 className="text-white font-medium mb-2">Advanced Settings</h3>
                  
                  <FormField
                    control={form.control}
                    name="maxReferralsPerHunter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Referrals Per Hunter</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            placeholder="0 for unlimited"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Limit how many referrals a single hunter can make (0 = unlimited)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="allowPublicHunters"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Allow Public Hunters</FormLabel>
                          <FormDescription className="text-xs">
                            Anyone can participate as a bounty hunter
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="requireVerification"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Require Manual Verification</FormLabel>
                          <FormDescription className="text-xs">
                            Manually review and approve each referral
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-4 pt-4">
              {onBack && (
                <Button type="button" variant="outline" onClick={onBack}>
                  Cancel
                </Button>
              )}
              <ToxicButton 
                type="submit" 
                disabled={isSubmitting || isProcessing}
              >
                {isSubmitting ? "Creating Bounty..." : "Create Bounty"}
              </ToxicButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

