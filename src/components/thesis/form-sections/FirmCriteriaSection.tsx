
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FirmSize, DealType, GeographicFocus, ProposalMetadata } from "@/types/proposals";
import { US_STATES } from "@/lib/constants/states";
import { motion } from "framer-motion";
import { Building2, Globe2, MapPin, Briefcase, Check } from "lucide-react";
import { FieldErrors } from "react-hook-form";

interface FirmCriteriaSectionProps {
  formData: {
    firmCriteria: {
      size: FirmSize;
      location: string;
      dealType: DealType;
      geographicFocus: GeographicFocus;
    };
  };
  formErrors: FieldErrors<ProposalMetadata>;
  onChange: (field: 'size' | 'location' | 'dealType' | 'geographicFocus', value: any) => void;
}

export const FirmCriteriaSection = ({ formData, formErrors, onChange }: FirmCriteriaSectionProps) => {
  useEffect(() => {
    if (formData.firmCriteria.size === undefined) {
      onChange('size', FirmSize.BELOW_1M);
    }
    if (formData.firmCriteria.dealType === undefined) {
      onChange('dealType', DealType.ACQUISITION);
    }
    if (formData.firmCriteria.geographicFocus === undefined) {
      onChange('geographicFocus', GeographicFocus.LOCAL);
    }
  }, []);

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
          <Building2 className="h-5 w-5 text-yellow-500" />
        </div>
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Target Firm Criteria
        </h2>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-5 w-5 text-yellow-500" />
          <Label className="text-lg font-medium text-white">Preferred Firm Size (Revenue)</Label>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {[
            { value: FirmSize.BELOW_1M, label: "Below $1M", color: "yellow" },
            { value: FirmSize.ONE_TO_FIVE_M, label: "$1M–$5M", color: "yellow" },
            { value: FirmSize.FIVE_TO_TEN_M, label: "$5M–$10M", color: "yellow" },
            { value: FirmSize.TEN_PLUS, label: "$10M+", color: "yellow" }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              className="relative group w-full text-left"
              onClick={() => onChange('size', option.value)}
            >
              <div
                className={`
                  relative group rounded-lg border transition-all duration-200 p-4
                  ${formData.firmCriteria.size === option.value 
                    ? `bg-${option.color}-500/10 border-${option.color}-500/50` 
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg bg-${option.color}-500/20 flex items-center justify-center`}>
                    <Building2 className={`h-4 w-4 text-${option.color}-500`} />
                  </div>
                  <div className="flex-1">
                    <Label className="text-white font-medium">{option.label}</Label>
                  </div>
                  <div className={`
                    h-5 w-5 rounded border transition-all duration-200 flex items-center justify-center
                    ${formData.firmCriteria.size === option.value 
                      ? `bg-${option.color}-500 border-${option.color}-500` 
                      : 'border-white/30 bg-white/5'}
                  `}>
                    {formData.firmCriteria.size === option.value && <Check className="h-3 w-3 text-white" />}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Globe2 className="h-5 w-5 text-teal-500" />
          <Label className="text-lg font-medium text-white">Geographic Focus</Label>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {[
            { value: GeographicFocus.LOCAL, label: "Local", color: "teal" },
            { value: GeographicFocus.REGIONAL, label: "Regional", color: "teal" },
            { value: GeographicFocus.NATIONAL, label: "National", color: "teal" },
            { value: GeographicFocus.REMOTE, label: "Remote", color: "teal" }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              className="relative group w-full text-left"
              onClick={() => onChange('geographicFocus', option.value)}
            >
              <div
                className={`
                  relative group rounded-lg border transition-all duration-200 p-4
                  ${formData.firmCriteria.geographicFocus === option.value 
                    ? `bg-${option.color}-500/10 border-${option.color}-500/50` 
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg bg-${option.color}-500/20 flex items-center justify-center`}>
                    <Globe2 className={`h-4 w-4 text-${option.color}-500`} />
                  </div>
                  <div className="flex-1">
                    <Label className="text-white font-medium">{option.label}</Label>
                  </div>
                  <div className={`
                    h-5 w-5 rounded border transition-all duration-200 flex items-center justify-center
                    ${formData.firmCriteria.geographicFocus === option.value 
                      ? `bg-${option.color}-500 border-${option.color}-500` 
                      : 'border-white/30 bg-white/5'}
                  `}>
                    {formData.firmCriteria.geographicFocus === option.value && <Check className="h-3 w-3 text-white" />}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-purple-500" />
          <Label className="text-lg font-medium text-white">Primary State (Optional)</Label>
        </div>
        <Select 
          value={formData.firmCriteria.location}
          onValueChange={(value) => onChange('location', value)}
        >
          <SelectTrigger className="bg-black/20 border-white/10 text-white h-12">
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] bg-black/90 border-white/10">
            {US_STATES.map(state => (
              <SelectItem 
                key={state} 
                value={state}
                className="text-white focus:bg-white/10 focus:text-white"
              >
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="h-5 w-5 text-rose-500" />
          <Label className="text-lg font-medium text-white">Deal Type</Label>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {[
            { value: DealType.ACQUISITION, label: "Acquisition", color: "rose" },
            { value: DealType.MERGER, label: "Merger", color: "rose" },
            { value: DealType.EQUITY_BUYOUT, label: "Equity Buyout", color: "rose" },
            { value: DealType.FRANCHISE, label: "Franchise", color: "rose" },
            { value: DealType.SUCCESSION, label: "Succession", color: "rose" }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              className="relative group w-full text-left"
              onClick={() => onChange('dealType', option.value)}
            >
              <div
                className={`
                  relative group rounded-lg border transition-all duration-200 p-4
                  ${formData.firmCriteria.dealType === option.value 
                    ? `bg-${option.color}-500/10 border-${option.color}-500/50` 
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg bg-${option.color}-500/20 flex items-center justify-center`}>
                    <Briefcase className={`h-4 w-4 text-${option.color}-500`} />
                  </div>
                  <div className="flex-1">
                    <Label className="text-white font-medium">{option.label}</Label>
                  </div>
                  <div className={`
                    h-5 w-5 rounded border transition-all duration-200 flex items-center justify-center
                    ${formData.firmCriteria.dealType === option.value 
                      ? `bg-${option.color}-500 border-${option.color}-500` 
                      : 'border-white/30 bg-white/5'}
                  `}>
                    {formData.firmCriteria.dealType === option.value && <Check className="h-3 w-3 text-white" />}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
