
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCustomWallet } from "@/hooks/useCustomWallet";
import { Progress } from "@/components/ui/progress";
import { createReferral, storeReferrerAddress } from "@/services/referralService";
import { Shield, Users, Zap } from "lucide-react";

const ReferralRedirect = () => {
  const { referrerAddress } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { address, isConnected } = useCustomWallet();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState("Validating referrer");

  useEffect(() => {
    let intervalId: number;
    
    // Start the progress animation
    if (referrerAddress) {
      setIsProcessing(true);
      
      intervalId = window.setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 5;
          if (newProgress >= 33 && newProgress < 66 && processingStep === "Validating referrer") {
            setProcessingStep("Storing referral data");
          } else if (newProgress >= 66 && newProgress < 100 && processingStep === "Storing referral data") {
            setProcessingStep("Completing setup");
          }
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 50);
    }
    
    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [referrerAddress, processingStep]);

  useEffect(() => {
    // If progress reaches 100%, redirect to the Hunt page instead of home
    if (progress === 100) {
      setTimeout(() => {
        navigate("/hunt");
      }, 500);
    }
  }, [progress, navigate]);

  useEffect(() => {
    const processReferral = async () => {
      // Store the referrer address in localStorage if it's valid
      if (referrerAddress && referrerAddress.length > 0) {
        console.log("Processing referrer address:", referrerAddress);
        // Store for all users, even if not connected yet
        storeReferrerAddress(referrerAddress);
        
        // If the user is connected, also create the referral relationship
        if (isConnected && address) {
          try {
            await createReferral(referrerAddress, address);
            console.log("Stored referral relationship between", referrerAddress, "and", address);
          } catch (error) {
            console.error("Error creating referral:", error);
          }
        }
        
        toast({
          title: "Welcome to Resistance DAO!",
          description: "You've been referred by a Bounty Hunter.",
        });
      }
    };
    
    processReferral();
  }, [referrerAddress, address, isConnected, toast]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="relative z-10 w-full max-w-md p-8 rounded-xl bg-gray-900/50 border border-gray-800 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-400 mb-4">Welcome to Resistance DAO</h1>
          <p className="text-white mb-6">Processing your Bounty Hunter referral...</p>
          
          <div className="w-full mb-4">
            <Progress value={progress} className="h-2 bg-gray-800" />
          </div>
          
          <div className="flex justify-between mb-6 text-sm">
            <div className={`flex items-center gap-1 ${progress >= 33 ? 'text-blue-400' : 'text-gray-500'}`}>
              <Shield className="w-4 h-4" /> 
              <span>Validating</span>
            </div>
            <div className={`flex items-center gap-1 ${progress >= 66 ? 'text-blue-400' : 'text-gray-500'}`}>
              <Zap className="w-4 h-4" /> 
              <span>Storing</span>
            </div>
            <div className={`flex items-center gap-1 ${progress >= 100 ? 'text-blue-400' : 'text-gray-500'}`}>
              <Users className="w-4 h-4" /> 
              <span>Complete</span>
            </div>
          </div>
          
          <p className="text-blue-400 font-medium mb-4">{processingStep}...</p>
          
          <p className="text-gray-400 text-sm">
            You're being referred by a Bounty Hunter from the wasteland. 
            They'll earn rewards when you purchase an NFT.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReferralRedirect;
