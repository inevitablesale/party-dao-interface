
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Award, 
  Users, 
  Briefcase, 
  Wallet, 
  ArrowRight,
  Coins
} from "lucide-react";
import { cn } from "@/lib/utils";

export type RewardTemplateType = 
  | "standardReferral" 
  | "multiLevelReferral" 
  | "settlementContribution" 
  | "custom";

interface RewardTemplate {
  id: RewardTemplateType;
  title: string;
  description: string;
  icon: React.ReactNode;
  distribution: {
    description: string;
    splits: Array<{recipient: string, percentage: number}>
  };
  isPopular?: boolean;
}

const REWARD_TEMPLATES: RewardTemplate[] = [
  {
    id: "standardReferral",
    title: "Standard Referral",
    description: "Simple direct referral reward split between referrer and platform",
    icon: <Award className="w-6 h-6 text-toxic-neon" />,
    isPopular: true,
    distribution: {
      description: "70/30 split between referrer and platform",
      splits: [
        { recipient: "Referrer", percentage: 70 },
        { recipient: "Platform", percentage: 30 }
      ]
    }
  },
  {
    id: "multiLevelReferral",
    title: "Multi-Level Referral",
    description: "Three-tier distribution for referral chains",
    icon: <Users className="w-6 h-6 text-blue-400" />,
    distribution: {
      description: "50/30/20 split between direct referrer, their referrer, and platform",
      splits: [
        { recipient: "Direct Referrer", percentage: 50 },
        { recipient: "Indirect Referrer", percentage: 30 },
        { recipient: "Platform", percentage: 20 }
      ]
    }
  },
  {
    id: "settlementContribution",
    title: "Settlement Rewards",
    description: "Rewards for settlement contributors",
    icon: <Briefcase className="w-6 h-6 text-purple-400" />,
    distribution: {
      description: "Distribution based on settlement contribution tiers",
      splits: [
        { recipient: "Sentinel Contributors", percentage: 60 },
        { recipient: "Survivor Contributors", percentage: 30 },
        { recipient: "Platform", percentage: 10 }
      ]
    }
  },
  {
    id: "custom",
    title: "Custom Distribution",
    description: "Create your own custom reward distribution",
    icon: <Wallet className="w-6 h-6 text-amber-400" />,
    distribution: {
      description: "Fully customizable distribution",
      splits: [
        { recipient: "Custom Recipient 1", percentage: 50 },
        { recipient: "Custom Recipient 2", percentage: 50 }
      ]
    }
  }
];

interface ReferralRewardTemplatesProps {
  onSelectTemplate: (template: RewardTemplate) => void;
}

export const ReferralRewardTemplates = ({ onSelectTemplate }: ReferralRewardTemplatesProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<RewardTemplateType | null>(null);
  const navigate = useNavigate();

  const handleSelectTemplate = (template: RewardTemplate) => {
    setSelectedTemplate(template.id);
    onSelectTemplate(template);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Choose a Reward Template</h2>
        <p className="text-white/60">Select a predefined reward distribution or create your own</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REWARD_TEMPLATES.map((template) => (
          <Card
            key={template.id}
            className={cn(
              "relative border cursor-pointer transition-all duration-200 hover:border-toxic-neon/70 hover:shadow-[0_0_15px_rgba(57,255,20,0.2)] bg-black/60",
              selectedTemplate === template.id 
                ? "border-toxic-neon shadow-[0_0_20px_rgba(57,255,20,0.3)]" 
                : "border-white/10"
            )}
            onClick={() => handleSelectTemplate(template)}
          >
            {template.isPopular && (
              <div className="absolute -top-3 -right-3 bg-toxic-neon text-black text-xs font-bold py-1 px-3 rounded-full">
                Popular
              </div>
            )}
            <div className="p-5">
              <div className="flex items-start">
                <div className="mr-4">
                  {template.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white">{template.title}</h3>
                  <p className="text-sm text-white/60 mt-1">{template.description}</p>
                </div>
              </div>
              
              <Separator className="my-4 bg-white/10" />
              
              <div className="space-y-3">
                <p className="text-sm text-white/80">{template.distribution.description}</p>
                {template.distribution.splits.map((split, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-white/70">{split.recipient}</span>
                    <div className="flex items-center gap-1">
                      <Coins className="w-3 h-3 text-toxic-neon/70" />
                      <span className="text-toxic-neon font-medium">{split.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          className="bg-toxic-neon hover:bg-toxic-neon/90 text-black font-medium gap-2"
          disabled={!selectedTemplate}
          onClick={() => navigate("/proposals/create")}
        >
          Continue to Proposal <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
