import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { File, DollarSign, Users, MessageSquare, Timer, HelpCircle, Beaker, Shield } from "lucide-react";
import { VotingDurationInput } from "@/components/thesis/VotingDurationInput";
import { TargetCapitalInput, convertToWei } from "@/components/thesis/TargetCapitalInput";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ProposalMetadata } from "@/types/proposals";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ResistanceWalletWidget } from "@/components/wallet/ResistanceWalletWidget";
import { 
  createParty, 
  createEthCrowdfund, 
  updateSurvivorMetadata, 
  verifySurvivorOwnership,
  PartyOptions,
  CrowdfundOptions
} from "@/services/partyProtocolService";
import { 
  RD_TOKEN_ADDRESS, 
  FACTORY_ADDRESS, 
  SUBMISSION_FEE,
  PARTY_PROTOCOL,
  SURVIVOR_NFT_ADDRESS
} from "@/lib/constants";
import { ethers } from "ethers";

const thesisFormSchema = z.object({
  title: z.string().min(2, {
    message: "Thesis title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  category: z.string().min(2, {
    message: "Category must be at least 2 characters.",
  }),
  external_url: z.string().url({
    message: "Please enter a valid project URL.",
  }),
  image: z.string().min(1, {
    message: "Project image is required.",
  }),
  investment: z.object({
    targetCapital: z.string().min(1, {
      message: "Target capital is required."
    }),
    description: z.string().min(10, {
      message: "Investment description must be at least 10 characters.",
    }),
  }),
  fundingBreakdown: z.array(z.object({
    category: z.string(),
    amount: z.string()
  })),
  team: z.array(z.object({
    name: z.string(),
    role: z.string(),
    linkedin: z.string().url().optional(),
    github: z.string().url().optional(),
  })),
  votingDuration: z.number().min(7 * 24 * 60 * 60, {
    message: "Voting duration must be at least 7 days.",
  }),
  linkedInURL: z.string().url({
    message: "Please enter a valid LinkedIn URL.",
  }),
  blockchain: z.string().array().nonempty({
    message: "Please select at least one blockchain.",
  }),
  socials: z.object({
    twitter: z.string().url().optional(),
    discord: z.string().url().optional(),
    telegram: z.string().url().optional(),
  }),

  // Add party specific fields
  partyName: z.string().min(5, {
    message: "Party name must be at least 5 characters.",
  }),
  allowPublicProposals: z.boolean().default(true),
  minContribution: z.string().min(1, {
    message: "Minimum contribution is required."
  }),
  maxContribution: z.string().min(1, {
    message: "Maximum contribution is required."
  }),
  crowdfundDuration: z.number().min(1 * 24 * 60 * 60, {
    message: "Crowdfund duration must be at least 1 day."
  })
});

const requiredFormData = {
  title: "Decentralized Identity Protocol",
  description: "A protocol for self-sovereign identity management using zero-knowledge proofs",
  category: "Identity & Privacy",
  external_url: "https://zkid.example.com",
  image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  investment: {
    targetCapital: "500000",
    description: "Funding for protocol development and security audits",
  },
  fundingBreakdown: [],
  team: [
    {
      name: "Alice Johnson",
      role: "Lead Developer",
      linkedin: "https://linkedin.com/in/alice",
      github: "https://github.com/alicejohnson"
    },
    {
      name: "Bob Smith",
      role: "Security Architect",
      linkedin: "https://linkedin.com/in/bob",
      github: "https://github.com/bobsmith"
    }
  ],
  votingDuration: 14 * 24 * 60 * 60, // 14 days
  linkedInURL: "https://linkedin.com/in/example",
  blockchain: ["Ethereum", "Polygon"],
  socials: {
    twitter: "",
    discord: "",
    telegram: "",
  },
};

const completeFormData = {
  ...requiredFormData,
  fundingBreakdown: [
    { category: "Smart Contract Development", amount: "200000" },
    { category: "Security Audit", amount: "100000" },
    { category: "Marketing & Community", amount: "100000" },
    { category: "Operations & Legal", amount: "100000" }
  ],
  team: [
    {
      name: "Alice Johnson",
      role: "Lead Developer",
      linkedin: "https://linkedin.com/in/alice",
      github: "https://github.com/alicejohnson"
    },
    {
      name: "Bob Smith",
      role: "Security Architect",
      linkedin: "https://linkedin.com/in/bob",
      github: "https://github.com/bobsmith"
    }
  ],
  socials: {
    twitter: "https://twitter.com/zkidproject",
    discord: "https://discord.gg/zkid",
    telegram: "https://t.me/zkidproject"
  }
};

export default function ThesisSubmission() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { primaryWallet } = useDynamicContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSurvivorNFT, setHasSurvivorNFT] = useState(false);
  const [survivorTokenId, setSurvivorTokenId] = useState<string | null>(null);

  // Check if user owns a Survivor NFT
  useEffect(() => {
    const checkSurvivorOwnership = async () => {
      if (primaryWallet) {
        try {
          const result = await verifySurvivorOwnership(primaryWallet, SURVIVOR_NFT_ADDRESS);
          if (typeof result === 'boolean') {
            setHasSurvivorNFT(result);
          } else if (result && typeof result === 'object') {
            setHasSurvivorNFT(result.hasNFT);
            if (result.tokenId) {
              setSurvivorTokenId(result.tokenId);
            }
          }
        } catch (error) {
          console.error("Error checking Survivor ownership:", error);
        }
      }
    };
    
    checkSurvivorOwnership();
  }, [primaryWallet]);

  const form = useForm<z.infer<typeof thesisFormSchema>>({
    resolver: zodResolver(thesisFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      external_url: "",
      image: "",
      investment: {
        targetCapital: "",
        description: "",
      },
      fundingBreakdown: [
        { category: "", amount: "" },
        { category: "", amount: "" },
        { category: "", amount: "" },
        { category: "", amount: "" }
      ],
      team: [
        { name: "", role: "", linkedin: "", github: "" },
        { name: "", role: "", linkedin: "", github: "" }
      ],
      votingDuration: 7 * 24 * 60 * 60,
      linkedInURL: "",
      blockchain: [],
      socials: {
        twitter: "",
        discord: "",
        telegram: "",
      },
      
      // Party Protocol specific fields
      partyName: "",
      allowPublicProposals: true,
      minContribution: "0.1",
      maxContribution: "100",
      crowdfundDuration: 14 * 24 * 60 * 60 // 14 days
    }
  });

  const fillRequiredData = () => {
    form.reset(requiredFormData);
    toast({
      title: "Required Data Loaded",
      description: "Form has been filled with required fields only.",
    });
  };

  const fillCompleteData = () => {
    form.reset(completeFormData);
    toast({
      title: "Complete Data Loaded",
      description: "Form has been filled with all available fields.",
    });
  };

  async function onSubmit(values: z.infer<typeof thesisFormSchema>) {
    setIsSubmitting(true);
    try {
      if (!primaryWallet) {
        throw new Error("Wallet is not available");
      }

      if (!hasSurvivorNFT) {
        throw new Error("You must own a Survivor NFT to create a settlement");
      }

      const walletClient = await primaryWallet.getWalletClient();
      if (!walletClient) {
        throw new Error("Wallet client not available");
      }

      const provider = new ethers.providers.Web3Provider(walletClient as any);
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();

      toast({
        title: "Creating Settlement...",
        description: "Setting up your party on Party Protocol",
      });

      // Create metadata for IPFS
      const metadata: ProposalMetadata = {
        title: values.title,
        description: values.description,
        category: values.category,
        investment: {
          targetCapital: values.investment.targetCapital,
          description: values.investment.description,
        },
        votingDuration: values.votingDuration,
        linkedInURL: values.linkedInURL,
        blockchain: values.blockchain,
        fundingBreakdown: values.fundingBreakdown
          .filter(item => item.category && item.amount)
          .map(item => ({
            category: item.category,
            amount: item.amount
          })),
        team: values.team
          .filter(member => member.name && member.role)
          .map(member => ({
            name: member.name,
            role: member.role,
            linkedin: member.linkedin,
            github: member.github
          })),
        socials: {
          twitter: values.socials.twitter || undefined,
          discord: values.socials.discord || undefined,
          telegram: values.socials.telegram || undefined
        },
        submissionTimestamp: Math.floor(Date.now() / 1000),
        submitter: signerAddress,
        isTestMode: false
      };

      // Set up Party options
      const partyOptions: PartyOptions = {
        name: values.partyName || `${values.title} Settlement`,
        hosts: [signerAddress],
        votingDuration: values.votingDuration,
        executionDelay: PARTY_PROTOCOL.EXECUTION_DELAY,
        passThresholdBps: PARTY_PROTOCOL.PASS_THRESHOLD_BPS,
        allowPublicProposals: values.allowPublicProposals,
        description: values.description,
        metadataURI: "" // Will be set after IPFS upload
      };

      // Create the Party
      toast({
        title: "Creating Party...",
        description: "Please approve the transaction to create your settlement",
      });

      const partyAddress = await createParty(primaryWallet, partyOptions);

      // Set up Crowdfund options
      const crowdfundOptions: CrowdfundOptions = {
        initialContributor: signerAddress,
        minContribution: ethers.utils.parseEther(values.minContribution).toString(),
        maxContribution: ethers.utils.parseEther(values.maxContribution).toString(),
        maxTotalContributions: ethers.utils.parseEther(values.investment.targetCapital).toString(),
        duration: values.crowdfundDuration
      };

      // Create the ETH Crowdfund
      toast({
        title: "Creating Crowdfund...",
        description: "Please approve the transaction to set up funding",
      });

      const crowdfundAddress = await createEthCrowdfund(primaryWallet, partyAddress, crowdfundOptions, metadata);

      // Update the Survivor NFT metadata
      toast({
        title: "Updating Metadata...",
        description: "Updating your Survivor NFT with settlement data",
      });

      if (survivorTokenId) {
        await updateSurvivorMetadata(primaryWallet, survivorTokenId, partyAddress, crowdfundAddress, metadata);
      }

      toast({
        title: "Settlement Created!",
        description: "Your settlement has been successfully created on Party Protocol.",
      });

      // Navigate to the proposal details page
      navigate(`/settlements/${partyAddress}`);

    } catch (error: any) {
      console.error("Error submitting thesis:", error);
      toast({
        title: "Error Creating Settlement",
        description: error.message || "An error occurred while creating the settlement.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm mb-4">
              🚀 Create Your Settlement
            </div>
            <h1 className="text-5xl font-bold text-white font-mono">
              Launch Your Settlement
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Create a settlement powered by Party Protocol. Present your vision to Sentinels and gather resources to build in the wasteland.
            </p>
            
            {!hasSurvivorNFT && (
              <div className="p-4 bg-red-900/30 border border-red-500/20 rounded-lg mt-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-red-400" />
                  <div className="text-left">
                    <h3 className="font-medium text-white">Survivor NFT Required</h3>
                    <p className="text-sm text-gray-300">You must own a Survivor NFT to create a settlement.</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={fillRequiredData}
                variant="outline"
                className="bg-black/30 border-blue-500/30 hover:border-blue-500/50 text-blue-400 gap-2"
              >
                <Beaker className="w-4 h-4" />
                Load Required Data
              </Button>
              <Button
                onClick={fillCompleteData}
                variant="outline"
                className="bg-black/30 border-green-500/30 hover:border-green-500/50 text-green-400 gap-2"
              >
                <Beaker className="w-4 h-4" />
                Load Complete Data
              </Button>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-[#111] rounded-xl border border-white/5 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <File className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-medium">Project Overview</h2>
                </div>
                <div className="grid gap-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label>Title</Label>
                      <Input
                        {...form.register("title")}
                        placeholder="Enter your project title"
                        className="mt-2 bg-black/50 border-white/10"
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Input
                        {...form.register("category")}
                        placeholder="e.g., DeFi, NFT, Gaming"
                        className="mt-2 bg-black/50 border-white/10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      {...form.register("description")}
                      placeholder="Describe your project's vision and goals..."
                      className="mt-2 bg-black/50 border-white/10 min-h-[120px]"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label>Project URL</Label>
                      <Input
                        {...form.register("external_url")}
                        placeholder="https://your-project.com"
                        className="mt-2 bg-black/50 border-white/10"
                      />
                    </div>
                    <div>
                      <Label>Project Image URL</Label>
                      <Input
                        {...form.register("image")}
                        placeholder="https://image-url.com"
                        className="mt-2 bg-black/50 border-white/10"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#111] rounded-xl border border-white/5 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <DollarSign className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-medium">Settlement Funding</h2>
                </div>
                <div className="space-y-6">
                  <TargetCapitalInput
                    value={form.watch("investment.targetCapital")}
                    onChange={(value) => form.setValue("investment.targetCapital", value)}
                    error={form.formState.errors.investment?.targetCapital ? [form.formState.errors.investment.targetCapital.message || ""] : undefined}
                  />
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Minimum Contribution (ETH)</Label>
                      <Input
                        {...form.register("minContribution")}
                        placeholder="0.1"
                        className="mt-2 bg-black/50 border-white/10"
                      />
                    </div>
                    <div>
                      <Label>Maximum Contribution (ETH)</Label>
                      <Input
                        {...form.register("maxContribution")}
                        placeholder="100"
                        className="mt-2 bg-black/50 border-white/10"
                      />
                    </div>
                  </div>
                  
                  {form.watch("fundingBreakdown")?.map((_, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4">
                      <Input
                        {...form.register(`fundingBreakdown.${index}.category`)}
                        placeholder="Category (e.g., Smart Contract Development)"
                        className="bg-black/50 border-white/10"
                      />
                      <Input
                        {...form.register(`fundingBreakdown.${index}.amount`)}
                        placeholder="Amount in RD"
                        className="bg-black/50 border-white/10"
                      />
                    </div>
                  ))}

                  <VotingDurationInput
                    value={form.watch("votingDuration")}
                    onChange={(value) => form.setValue("votingDuration", value[0])}
                    error={form.formState.errors.votingDuration ? [form.formState.errors.votingDuration.message || ""] : undefined}
                  />
                  
                  <div>
                    <Label>Crowdfund Duration (days)</Label>
                    <Input
                      type="number"
                      {...form.register("crowdfundDuration", { 
                        valueAsNumber: true,
                        setValueAs: v => parseInt(v) * 24 * 60 * 60 // Convert days to seconds
                      })}
                      placeholder="14"
                      className="mt-2 bg-black/50 border-white/10"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#111] rounded-xl border border-white/5 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-medium">Team & Roadmap</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Team Members</Label>
                    <div className="space-y-4">
                      {[0, 1].map((index) => (
                        <div key={index}>
                          <Input
                            {...form.register(`team.${index}.name`)}
                            placeholder={`Team member ${index + 1} name`}
                            className="bg-black/50 border-white/10 mb-2"
                          />
                          <div className="grid grid-cols-3 gap-2">
                            <Input
                              {...form.register(`team.${index}.role`)}
                              placeholder="Role"
                              className="bg-black/50 border-white/10"
                            />
                            <Input
                              {...form.register(`team.${index}.linkedin`)}
                              placeholder="LinkedIn URL"
                              className="bg-black/50 border-white/10"
                            />
                            <Input
                              {...form.register(`team.${index}.github`)}
                              placeholder="GitHub URL"
                              className="bg-black/50 border-white/10"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#111] rounded-xl border border-white/5 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <File className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-medium">Party Settings</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Party Name</Label>
                    <Input
                      {...form.register("partyName")}
                      placeholder="Enter your settlement party name"
                      className="mt-2 bg-black/50 border-white/10"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="allowPublicProposals"
                      {...form.register("allowPublicProposals")}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="allowPublicProposals">Allow public proposals (anyone can propose actions)</Label>
                  </div>
                </div>
              </div>

              <div className="bg-[#111] rounded-xl border border-white/5 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-medium">Social Links</h2>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    {...form.register("socials.twitter")}
                    placeholder="Twitter URL"
                    className="bg-black/50 border-white/10"
                  />
                  <Input
                    {...form.register("socials.discord")}
                    placeholder="Discord URL"
                    className="bg-black/50 border-white/10"
                  />
                  <Input
                    {...form.register("socials.telegram")}
                    placeholder="Telegram URL"
                    className="bg-black/50 border-white/10"
                  />
                </div>
              </div>

              <div className="bg-[#0a1020] rounded-xl border border-white/5 p-6">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-1">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                      ℹ️
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">
                    Your settlement will be created as a Party on Party Protocol. This will allow Sentinels to contribute ETH and receive governance rights proportional to their contribution.
                  </p>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting || !hasSurvivorNFT}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 text-lg font-medium"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    Creating Settlement...
                  </div>
                ) : !hasSurvivorNFT ? (
                  <span className="flex items-center gap-2">
                    Survivor NFT Required
                    <Shield className="h-5 w-5" />
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Launch Settlement
                    <span className="text-xl">→</span>
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <ResistanceWalletWidget />
    </div>
  );
}
