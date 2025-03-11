
import { useNavigate } from "react-router-dom";
import { FileText, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useOnramp } from "@dynamic-labs/sdk-react-core";
import { OnrampProviders } from '@dynamic-labs/sdk-api-core';
import { useToast } from "@/hooks/use-toast";

export const CallToAction = () => {
  const navigate = useNavigate();
  const { primaryWallet } = useDynamicContext();
  const { enabled, open } = useOnramp();
  const { toast } = useToast();

  const handleBuyToken = async () => {
    if (!primaryWallet?.address) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to buy tokens",
        variant: "destructive"
      });
      return;
    }

    if (!enabled) {
      toast({
        title: "Onramp Not Available",
        description: "The onramp service is currently not available",
        variant: "destructive"
      });
      return;
    }

    try {
      await open({
        onrampProvider: OnrampProviders.Banxa,
        address: primaryWallet.address,
      });
      
      toast({
        title: "Purchase Initiated",
        description: "Your crypto purchase has been initiated successfully",
      });
    } catch (error) {
      console.error("Onramp error:", error);
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "Failed to initiate purchase",
        variant: "destructive"
      });
    }
  };

  return (
    <section className="py-16">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex gap-4 justify-center relative z-20">
            <Button
              onClick={handleBuyToken}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
              disabled={!enabled}
            >
              <Coins className="mr-2 h-4 w-4" />
              Join the Presale
            </Button>
            <Button
              onClick={() => navigate('/litepaper')}
              variant="outline"
              className="bg-white hover:bg-white/90 text-black border-white/20"
            >
              <FileText className="mr-2 h-4 w-4" />
              Read Litepaper
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

