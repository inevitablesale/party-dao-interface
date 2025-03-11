
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToxicButton } from "@/components/ui/toxic-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Save, PenTool, ArrowLeft, Gift, Shield, Landmark, AlertTriangle, FileText } from "lucide-react";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { GovernanceProposal } from "@/services/partyProtocolService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProposalTemplates, ProposalTemplate } from "./ProposalTemplates";
import { ToxicCard, ToxicCardHeader, ToxicCardContent, ToxicCardTitle, ToxicCardDescription } from "@/components/ui/toxic-card";
import { DrippingSlime } from "@/components/ui/dripping-slime";

const proposalSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must not exceed 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  transactions: z.array(z.object({
    target: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
    value: z.string().default("0"),
    calldata: z.string().default("0x"),
    signature: z.string().optional(),
    description: z.string().optional()
  })).min(1, "At least one transaction is required")
});

type ProposalFormValues = z.infer<typeof proposalSchema>;

export const ProposalForm = ({ 
  onSubmit, 
  onCancel 
}: { 
  onSubmit: (proposal: GovernanceProposal) => void;
  onCancel: () => void;
}) => {
  const [activeTab, setActiveTab] = useState<"templates" | "custom">("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<ProposalTemplate | null>(null);

  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      title: "",
      description: "",
      transactions: [{ target: "", value: "0", calldata: "0x" }]
    }
  });

  useEffect(() => {
    if (selectedTemplate) {
      form.reset({
        title: selectedTemplate.defaultTitle,
        description: selectedTemplate.defaultDescription,
        transactions: selectedTemplate.defaultTransactions
      });
      setActiveTab("custom");
    }
  }, [selectedTemplate, form]);

  const handleAddTransaction = () => {
    const transactions = form.getValues().transactions;
    form.setValue("transactions", [
      ...transactions, 
      { target: "", value: "0", calldata: "0x" }
    ]);
  };

  const handleRemoveTransaction = (index: number) => {
    const transactions = form.getValues().transactions;
    if (transactions.length > 1) {
      form.setValue("transactions", transactions.filter((_, i) => i !== index));
    }
  };

  const handleSelectTemplate = (template: ProposalTemplate) => {
    setSelectedTemplate(template);
  };

  // Get the appropriate icon based on template type
  const getTemplateIcon = () => {
    if (!selectedTemplate) return <FileText className="w-6 h-6 text-toxic-neon" />;
    
    switch (selectedTemplate.id) {
      case "rewardDistribution":
        return <Gift className="w-6 h-6 text-green-400" />;
      case "resourceAllocation":
        return <Landmark className="w-6 h-6 text-blue-400" />;
      case "membershipRules":
        return <Shield className="w-6 h-6 text-purple-400" />;
      case "emergencyAction":
        return <AlertTriangle className="w-6 h-6 text-red-400" />;
      default:
        return <PenTool className="w-6 h-6 text-toxic-neon" />;
    }
  };

  return (
    <div className="space-y-6 relative">
      <DrippingSlime position="top" dripsCount={10} className="absolute inset-0 pointer-events-none" />
      
      {activeTab === "custom" && selectedTemplate && (
        <button 
          onClick={() => setActiveTab("templates")}
          className="text-toxic-neon hover:text-toxic-neon/80 flex items-center gap-1 text-sm mb-4 relative z-10"
        >
          <ArrowLeft className="w-4 h-4" /> Back to templates
        </button>
      )}

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "templates" | "custom")}>
        <TabsList className="bg-black/40 border border-toxic-neon/10 w-full mb-6 radiation-scan-lines">
          <TabsTrigger 
            value="templates"
            className="data-[state=active]:bg-toxic-neon/10 data-[state=active]:text-toxic-neon flex-1"
          >
            Templates
          </TabsTrigger>
          <TabsTrigger 
            value="custom"
            className="data-[state=active]:bg-toxic-neon/10 data-[state=active]:text-toxic-neon flex-1"
          >
            {selectedTemplate ? "Customize Proposal" : "Custom Proposal"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4 mt-4 animate-fade-in">
          <ProposalTemplates onSelectTemplate={handleSelectTemplate} />
        </TabsContent>

        <TabsContent value="custom" className="space-y-4 mt-4 animate-fade-in">
          <ToxicCard className="relative overflow-visible mb-6">
            <ToxicCardHeader className="flex flex-row items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-toxic-neon/10 flex items-center justify-center">
                {getTemplateIcon()}
              </div>
              <div className="flex-1">
                <ToxicCardTitle>
                  {selectedTemplate ? selectedTemplate.defaultTitle : "Custom Proposal"}
                </ToxicCardTitle>
                <ToxicCardDescription className="mt-2">
                  {selectedTemplate ? selectedTemplate.description : "Create a custom proposal for your settlement"}
                </ToxicCardDescription>
              </div>
            </ToxicCardHeader>
            <ToxicCardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-toxic-neon">Proposal Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Settlement fund allocation" 
                            className="bg-black/50 border-toxic-neon/30 focus:border-toxic-neon/60" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-toxic-neon">Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe what this proposal will accomplish and why it should be supported..."
                            className="min-h-32 bg-black/50 border-toxic-neon/30 focus:border-toxic-neon/60"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-toxic-neon">Transactions</h3>
                      <ToxicButton
                        type="button"
                        variant="tertiary"
                        size="sm"
                        onClick={handleAddTransaction}
                        className="gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add
                      </ToxicButton>
                    </div>

                    {form.watch("transactions").map((transaction, index) => (
                      <div key={index} className="space-y-4 p-4 border border-toxic-neon/20 rounded-md bg-black/30 radiation-scan-lines">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm text-toxic-neon">Transaction {index + 1}</h4>
                          <ToxicButton
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTransaction(index)}
                            disabled={form.watch("transactions").length <= 1}
                          >
                            <X className="w-4 h-4" />
                          </ToxicButton>
                        </div>

                        <FormField
                          control={form.control}
                          name={`transactions.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white/70">Description (Optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Send ETH to treasury" 
                                  className="bg-black/50 border-toxic-neon/30 focus:border-toxic-neon/60"
                                  {...field} 
                                  value={field.value || ""} 
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`transactions.${index}.target`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white/70">Target Address</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="0x..." 
                                  className="bg-black/50 border-toxic-neon/30 focus:border-toxic-neon/60 font-mono"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`transactions.${index}.value`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white/70">Value (ETH)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="text" 
                                  placeholder="0" 
                                  className="bg-black/50 border-toxic-neon/30 focus:border-toxic-neon/60"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`transactions.${index}.calldata`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white/70">Calldata</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="0x..." 
                                  className="bg-black/50 border-toxic-neon/30 focus:border-toxic-neon/60 font-mono"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`transactions.${index}.signature`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white/70">Function Signature (Optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="transfer(address,uint256)" 
                                  className="bg-black/50 border-toxic-neon/30 focus:border-toxic-neon/60 font-mono"
                                  {...field} 
                                  value={field.value || ""} 
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <ToxicButton type="button" variant="tertiary" onClick={onCancel}>
                      Cancel
                    </ToxicButton>
                    <ToxicButton type="submit" variant="primary" className="gap-2">
                      <Save className="w-4 h-4" />
                      Create Proposal
                    </ToxicButton>
                  </div>
                </form>
              </Form>
            </ToxicCardContent>
          </ToxicCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};
