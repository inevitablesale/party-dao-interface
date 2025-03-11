
import { useState } from "react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { WalletConnectModal } from "@/components/wallet/WalletConnectModal";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Linkedin, ArrowRight, Mail, Check, Loader2 } from "lucide-react";
import Nav from "@/components/Nav";
import { analyzeLinkedInProfile } from "@/services/linkedinService";

type FlowStep = 'linkedin' | 'email' | 'wallet' | 'complete';

const ShareToEarn = () => {
  const { isConnected, connect } = useWalletConnection();
  const [linkedInEmail, setLinkedInEmail] = useState("");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [modifiedEmail, setModifiedEmail] = useState("");
  const [currentStep, setCurrentStep] = useState<FlowStep>('linkedin');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleLinkedInConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Simulate LinkedIn OAuth for now
      // In production, this would be replaced with actual LinkedIn OAuth
      const mockEmail = "user@linkedin.com";
      setLinkedInEmail(mockEmail);
      setModifiedEmail(mockEmail);
      setCurrentStep('email');
      
      toast({
        title: "LinkedIn Connected",
        description: "Your LinkedIn account was successfully connected.",
      });
    } catch (error) {
      console.error("LinkedIn connection error:", error);
      toast({
        title: "Connection Failed",
        description: "Unable to connect LinkedIn account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEmailConfirm = async () => {
    if (!modifiedEmail) {
      toast({
        title: "Email Required",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Proceed with wallet creation using the confirmed email
      setCurrentStep('wallet');
      await connect();
      setCurrentStep('complete');
      
      toast({
        title: "Setup Complete",
        description: "Your wallet has been created and connected.",
      });
    } catch (error) {
      console.error("Wallet creation error:", error);
      toast({
        title: "Wallet Creation Failed",
        description: "Unable to create wallet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStepProgress = () => {
    switch (currentStep) {
      case 'linkedin': return 25;
      case 'email': return 50;
      case 'wallet': return 75;
      case 'complete': return 100;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Nav />
      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-300 to-yellow-400">
              Share LedgerFund, Earn $LGR
            </h1>
            <p className="text-lg text-gray-400">
              Connect your LinkedIn account and share LedgerFund updates to earn $LGR tokens
            </p>
          </div>

          <Progress value={getStepProgress()} className="h-2" />

          <Card className="bg-white/5 border-white/10 p-6">
            {currentStep === 'linkedin' && (
              <div className="space-y-6">
                <Button 
                  onClick={handleLinkedInConnect}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Linkedin className="w-5 h-5 mr-2" />
                      Connect with LinkedIn
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {currentStep === 'email' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Email Address for Wallet
                  </label>
                  {isEditingEmail ? (
                    <Input
                      type="email"
                      value={modifiedEmail}
                      onChange={(e) => setModifiedEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="bg-white/5 border-white/10"
                    />
                  ) : (
                    <div className="flex items-center justify-between p-2 bg-white/5 rounded-md">
                      <span className="text-gray-300">{linkedInEmail}</span>
                      <Button
                        variant="ghost"
                        onClick={() => setIsEditingEmail(true)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                </div>
                <Button 
                  onClick={handleEmailConfirm}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-yellow-500 via-teal-400 to-yellow-400 text-black font-semibold"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Wallet...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5 mr-2" />
                      Confirm Email & Create Wallet
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {currentStep === 'wallet' && (
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-400" />
                <p className="text-gray-300">Creating your wallet...</p>
              </div>
            )}

            {currentStep === 'complete' && (
              <div className="text-center space-y-6">
                <div className="flex flex-col items-center space-y-2">
                  <div className="rounded-full bg-green-500/20 p-3">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold">Setup Complete!</h3>
                  <p className="text-gray-400">
                    Your LinkedIn account and wallet are now connected.
                  </p>
                </div>
              </div>
            )}
          </Card>

          <div className="text-center text-sm text-gray-500">
            By connecting, you agree to the LedgerFund terms of service and our social sharing guidelines
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareToEarn;
