
import { ethers } from "ethers";
import { Wallet, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SubmissionFeeDisplayProps {
  submissionFee: string;
  currentBalance?: string;
  className?: string;
}

export const SubmissionFeeDisplay = ({ submissionFee, currentBalance, className }: SubmissionFeeDisplayProps) => {
  const hasInsufficientBalance = currentBalance && 
    Number(currentBalance) < Number(submissionFee);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-4 rounded-lg border border-white/10 bg-white/5",
        hasInsufficientBalance && "border-red-500/20 bg-red-500/5",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wallet className="w-5 h-5 text-polygon-primary" />
          <div>
            <h3 className="text-sm font-medium text-white">Submission Fee</h3>
            <p className="text-lg font-bold text-polygon-primary">
              {ethers.utils.formatEther(submissionFee)} LGR
            </p>
          </div>
        </div>
        
        {currentBalance && (
          <div className="text-right">
            <p className="text-sm text-white/60">Your Balance</p>
            <p className={cn(
              "text-lg font-bold",
              hasInsufficientBalance ? "text-red-500" : "text-green-500"
            )}>
              {Number(currentBalance).toFixed(2)} LGR
            </p>
          </div>
        )}
      </div>

      {hasInsufficientBalance && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 flex items-center gap-2 text-sm text-red-500"
        >
          <AlertTriangle className="w-4 h-4" />
          <p>Insufficient balance for submission</p>
        </motion.div>
      )}
    </motion.div>
  );
};
