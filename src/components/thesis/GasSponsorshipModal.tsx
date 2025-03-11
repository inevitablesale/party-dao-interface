
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap, AlertCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ethers } from "ethers";

interface GasSponsorshipModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  estimatedGas?: string;
  isTestMode?: boolean;
}

export const GasSponsorshipModal = ({
  open,
  onOpenChange,
  onConfirm,
  estimatedGas,
  isTestMode
}: GasSponsorshipModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/95 border-purple-500/20 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            Gasless Transaction
          </DialogTitle>
          <DialogDescription>
            Your transaction will be sponsored by ZeroDev
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <h4 className="text-sm font-medium text-white mb-2">Estimated Gas Costs (Sponsored)</h4>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Gas Fee</span>
              <span className="text-sm font-medium text-white">
                {isTestMode ? "0.001 MATIC" : 
                  estimatedGas ? 
                    `${ethers.utils.formatEther(estimatedGas)} MATIC` : 
                    "Calculating..."
                }
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-white/60">You Pay</span>
              <span className="text-sm font-medium text-green-400">0 MATIC</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
            <AlertCircle className="w-5 h-5 text-purple-400 mt-0.5" />
            <div className="text-sm text-white/80">
              <p>Gas fees will be covered by ZeroDev's sponsorship service.</p>
              <p className="mt-1 text-white/60">This includes smart wallet deployment and transaction execution.</p>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
          >
            Continue with Gasless Transaction
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
