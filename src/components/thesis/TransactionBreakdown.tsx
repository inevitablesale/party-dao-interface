
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { FileText, Zap, HandCoins, Check, Loader2, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface TransactionStep {
  id: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  isGasless: boolean;
  estimatedGas?: string;
  hash?: string;
}

interface TransactionBreakdownProps {
  steps: TransactionStep[];
  currentStepId: string;
}

export const TransactionBreakdown = ({
  steps,
  currentStepId
}: TransactionBreakdownProps) => {
  const getStepIcon = (step: TransactionStep) => {
    switch (step.id) {
      case 'smart-wallet':
        return FileText;
      case 'gas-sponsorship':
        return Zap;
      case 'token-approval':
        return HandCoins;
      default:
        return FileText;
    }
  };

  return (
    <Card className="bg-black/40 border-white/10 p-6">
      <div className="space-y-6">
        {steps.map((step, index) => {
          const StepIcon = getStepIcon(step);
          const isCurrent = step.id === currentStepId;

          return (
            <div 
              key={step.id}
              className={cn(
                "relative flex items-start gap-4",
                index !== steps.length - 1 && "pb-6 border-l-2 border-white/10 ml-[19px]"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors",
                step.status === 'completed' ? "bg-green-500" :
                step.status === 'failed' ? "bg-red-500" :
                isCurrent ? "bg-purple-500" : "bg-white/10"
              )}>
                {step.status === 'completed' ? (
                  <Check className="w-5 h-5 text-white" />
                ) : step.status === 'failed' ? (
                  <AlertTriangle className="w-5 h-5 text-white" />
                ) : step.status === 'processing' ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <StepIcon className="w-5 h-5 text-white" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className={cn(
                    "font-medium",
                    step.status === 'completed' ? "text-green-400" :
                    step.status === 'failed' ? "text-red-400" :
                    isCurrent ? "text-purple-400" : "text-white/60"
                  )}>
                    {step.title}
                  </h4>
                  {step.isGasless && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      Gasless
                    </span>
                  )}
                </div>

                {step.hash && (
                  <a
                    href={`https://polygonscan.com/tx/${step.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-purple-400 hover:underline"
                  >
                    View on PolygonScan
                  </a>
                )}

                {step.estimatedGas && (
                  <p className="text-sm text-white/60">
                    Estimated Gas: {step.estimatedGas} MATIC
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
