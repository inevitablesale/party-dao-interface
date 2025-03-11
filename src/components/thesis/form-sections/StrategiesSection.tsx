import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { 
  Settings2, TrendingUp, UsersRound, Globe, Layers, Users, 
  Building, Network, ArrowLeftRight, Users2, ScrollText, Database, Check 
} from "lucide-react";
import { 
  ProposalMetadata, 
  OperationalStrategy, 
  GrowthStrategy, 
  IntegrationStrategy 
} from "@/types/proposals";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

export interface StrategiesSectionProps {
  formData: ProposalMetadata;
  formErrors: FieldErrors<ProposalMetadata>;
  register: UseFormRegister<ProposalMetadata>;
  onChange: (
    category: keyof ProposalMetadata['strategies'],
    value: OperationalStrategy[] | GrowthStrategy[] | IntegrationStrategy[]
  ) => void;
}

type StrategyCategory = keyof ProposalMetadata['strategies'];
type Strategy = OperationalStrategy | GrowthStrategy | IntegrationStrategy;

export const StrategiesSection = ({ formData, formErrors, register, onChange }: StrategiesSectionProps) => {
  const { toast } = useToast();

  const handleStrategyChange = <T extends StrategyCategory>(
    category: T,
    value: ProposalMetadata['strategies'][T][number],
    checked: boolean
  ) => {
    const currentStrategies = [...formData.strategies[category]];
    const updatedStrategies = checked
      ? [...currentStrategies, value]
      : currentStrategies.filter(s => s !== value);
    
    // Don't allow removing the last item if it's the only one
    if (!checked && currentStrategies.length === 1) {
      toast({
        title: "Strategy Required",
        description: `At least one ${category} strategy must be selected`,
        variant: "destructive"
      });
      return;
    }
    
    onChange(category, updatedStrategies as ProposalMetadata['strategies'][T]);
  };

  const isStrategySelected = (category: StrategyCategory, strategyId: Strategy) => {
    const strategies = formData.strategies[category] as Strategy[];
    return strategies.includes(strategyId);
  };

  const strategies = {
    operational: [
      { id: OperationalStrategy.TECH_MODERNIZATION, label: 'Technology Modernization', icon: Settings2, color: 'yellow' },
      { id: OperationalStrategy.PROCESS_STANDARDIZATION, label: 'Process Standardization', icon: ScrollText, color: 'teal' },
      { id: OperationalStrategy.STAFF_RETENTION, label: 'Staff Retention/Development', icon: UsersRound, color: 'purple' }
    ],
    growth: [
      { id: GrowthStrategy.GEOGRAPHIC_EXPANSION, label: 'Geographic Expansion', icon: Globe, color: 'indigo' },
      { id: GrowthStrategy.SERVICE_EXPANSION, label: 'Service Line Expansion', icon: Layers, color: 'rose' },
      { id: GrowthStrategy.CLIENT_GROWTH, label: 'Client Base Growth', icon: TrendingUp, color: 'amber' }
    ],
    integration: [
      { id: IntegrationStrategy.MERGING_OPERATIONS, label: 'Merging Operations', icon: ArrowLeftRight, color: 'cyan' },
      { id: IntegrationStrategy.CULTURE_INTEGRATION, label: 'Culture Integration', icon: Users2, color: 'emerald' },
      { id: IntegrationStrategy.SYSTEMS_CONSOLIDATION, label: 'Systems Consolidation', icon: Database, color: 'fuchsia' }
    ]
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
          <Network className="h-5 w-5 text-purple-500" />
        </div>
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Post-Acquisition Strategy
        </h2>
      </motion.div>

      {Object.entries(strategies).map(([category, items]) => (
        <motion.div 
          key={category}
          variants={itemVariants}
          className="space-y-4 bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10"
        >
          <div className="flex items-center gap-2 mb-4">
            {category === 'operational' && <Settings2 className="h-5 w-5 text-yellow-500" />}
            {category === 'growth' && <TrendingUp className="h-5 w-5 text-rose-500" />}
            {category === 'integration' && <Building className="h-5 w-5 text-teal-500" />}
            <Label className="text-lg font-medium text-white capitalize">
              {category} Strategies
            </Label>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {items.map(({ id, label, icon: Icon, color }) => {
              const isSelected = isStrategySelected(category as StrategyCategory, id);
              return (
                <button
                  key={id}
                  type="button"
                  className="relative group w-full text-left"
                  onClick={() => handleStrategyChange(category as StrategyCategory, id, !isSelected)}
                >
                  <div 
                    className={`
                      p-4 rounded-xl border transition-all duration-200
                      ${isSelected 
                        ? `border-${color}-500/50 bg-${color}-500/10 shadow-[0_0_15px_rgba(0,0,0,0.1)]` 
                        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        h-8 w-8 rounded-lg flex items-center justify-center
                        ${isSelected ? `bg-${color}-500` : `bg-${color}-500/20`}
                      `}>
                        <Icon className={`h-4 w-4 ${isSelected ? 'text-white' : `text-${color}-500`}`} />
                      </div>
                      <div className="flex-1">
                        <Label className="text-white font-medium">{label}</Label>
                      </div>
                      <div className={`
                        h-5 w-5 rounded border transition-all duration-200 flex items-center justify-center
                        ${isSelected 
                          ? `bg-${color}-500 border-${color}-500` 
                          : 'border-white/30 bg-white/5'}
                      `}>
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {formErrors.strategies?.[category as keyof typeof formErrors.strategies] && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400 mt-2"
            >
              {String(formErrors.strategies[category as keyof typeof formErrors.strategies])}
            </motion.p>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};
