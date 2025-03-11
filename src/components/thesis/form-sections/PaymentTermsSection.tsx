
import { Label } from "@/components/ui/label";
import { ProposalMetadata, PaymentTerm } from "@/types/proposals";
import { motion } from "framer-motion";
import { CreditCard, Briefcase, ChartBar, Users2, Building2, Check } from "lucide-react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

export interface PaymentTermsSectionProps {
  formData: ProposalMetadata;
  formErrors: FieldErrors<ProposalMetadata>;
  register: UseFormRegister<ProposalMetadata>;
  onChange: (field: string, value: PaymentTerm[]) => void;
}

export const PaymentTermsSection = ({ formData, formErrors, register, onChange }: PaymentTermsSectionProps) => {
  const handleTermChange = (term: PaymentTerm, checked: boolean) => {
    const newTerms = checked 
      ? [...formData.paymentTerms, term]
      : formData.paymentTerms.filter(t => t !== term);
    onChange('paymentTerms', newTerms);
  };

  const paymentOptions = [
    { term: PaymentTerm.CASH, label: "Cash", icon: CreditCard, color: "yellow" },
    { term: PaymentTerm.SELLER_FINANCING, label: "Seller Financing", icon: Briefcase, color: "teal" },
    { term: PaymentTerm.EARNOUT, label: "Earnout", icon: ChartBar, color: "purple" },
    { term: PaymentTerm.EQUITY_ROLLOVER, label: "Equity Rollover", icon: Users2, color: "rose" },
    { term: PaymentTerm.BANK_FINANCING, label: "Bank Financing", icon: Building2, color: "blue" }
  ];

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
          <CreditCard className="h-5 w-5 text-yellow-500" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Payment Terms
          </h2>
          <p className="text-sm text-white/60">Select 1-5 preferred payment methods</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentOptions.map(({ term, label, icon: Icon, color }) => {
          const isSelected = formData.paymentTerms.includes(term);
          return (
            <button
              key={term}
              type="button"
              className="relative group w-full text-left"
              onClick={() => handleTermChange(term, !isSelected)}
            >
              <div 
                className={`
                  p-4 rounded-xl border transition-all duration-200
                  ${isSelected 
                    ? `border-${color}-500/50 bg-${color}-500/10` 
                    : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg bg-${color}-500/20 flex items-center justify-center`}>
                    <Icon className={`h-4 w-4 text-${color}-500`} />
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
      </motion.div>

      {formErrors.paymentTerms && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-400"
        >
          {formErrors.paymentTerms.message || "Please select at least one payment term"}
        </motion.p>
      )}
    </motion.div>
  );
};
