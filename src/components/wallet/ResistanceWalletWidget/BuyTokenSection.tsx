
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Coins } from "lucide-react";
import { useState } from "react";

interface BuyTokenSectionProps {
  usdcBalance: string;
  onBuyUsdc: () => Promise<void>;
  onBuyRd: (amount: string) => Promise<void>;
}

export const BuyTokenSection = ({ usdcBalance, onBuyUsdc, onBuyRd }: BuyTokenSectionProps) => {
  const [purchaseAmount, setPurchaseAmount] = useState<string>("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleConfirmPurchase = async () => {
    if (!purchaseAmount) return;
    await onBuyRd(purchaseAmount);
    setIsConfirmOpen(false);
    setPurchaseAmount("");
  };

  const handleBuyUsdc = async () => {
    console.log("[Banxa] Initiating USDC purchase flow...");
    try {
      console.log("[Banxa] Current component state:", {
        purchaseAmount,
        usdcBalance,
        isConfirmOpen
      });

      console.log("[Banxa] Calling onBuyUsdc handler...");
      await onBuyUsdc();
      console.log("[Banxa] onBuyUsdc handler completed successfully");
    } catch (error) {
      console.error("[Banxa] Error in Buy USDC flow:", {
        error,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        errorStack: error instanceof Error ? error.stack : undefined
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-400">
        Price: $1.00 USD per RD
      </div>

      <div className="flex flex-col gap-2">
        <Button 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
          onClick={() => setIsConfirmOpen(true)}
        >
          <Coins className="w-4 h-4 mr-2" />
          Buy RD
        </Button>

        <Button
          onClick={handleBuyUsdc}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold flex items-center justify-center gap-2"
        >
          <img 
            src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
            alt="USDC"
            className="w-5 h-5"
          />
          Buy USDC
        </Button>
      </div>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="bg-black/95 border border-blue-500/20">
          <DialogHeader>
            <DialogTitle className="text-blue-400">Buy RD Tokens</DialogTitle>
            <DialogDescription>
              Enter the amount of USDC you want to spend
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Amount in USDC</label>
              <Input
                type="number"
                placeholder="Enter USDC amount"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                className="bg-black/50 border border-blue-500/20 text-white placeholder:text-gray-500"
              />
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-400">You will receive approximately:</p>
              <p className="text-lg font-bold text-blue-400">
                {Number(purchaseAmount || 0).toFixed(2)} RD
              </p>
            </div>

            <div className="text-sm text-gray-400">
              Your USDC Balance: {Number(usdcBalance).toFixed(2)} USDC
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPurchase}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              disabled={!purchaseAmount || Number(purchaseAmount) <= 0 || Number(purchaseAmount) > Number(usdcBalance)}
            >
              Confirm Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
