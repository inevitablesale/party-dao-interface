
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingState } from "@/types/loading";
import { Loader2 } from "lucide-react";

interface ProposalLoadingCardProps {
  loadingState: LoadingState;
}

export const loadingStates: LoadingState[] = [
  {
    message: "Connecting to wallet...",
    subtitle: "Please wait while we connect to your wallet",
    icon: Loader2,
    progress: 20
  },
  {
    message: "Checking permissions...",
    subtitle: "Verifying your access rights",
    icon: Loader2,
    progress: 40
  },
  {
    message: "Loading proposal data...",
    subtitle: "Fetching proposal information",
    icon: Loader2,
    progress: 60
  },
  {
    message: "Fetching metadata...",
    subtitle: "Retrieving additional details",
    icon: Loader2,
    progress: 80
  },
  {
    message: "Almost done...",
    subtitle: "Finalizing proposal details",
    icon: Loader2,
    progress: 95
  }
];

export const ProposalLoadingCard = ({ loadingState }: ProposalLoadingCardProps) => {
  const LoadingIcon = loadingState.icon;

  return (
    <Card className="bg-black/40 border-white/10">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <motion.div 
            className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <LoadingIcon className="w-8 h-8 text-purple-500" />
          </motion.div>
          
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-medium text-white mb-1">
              {loadingState.message}
            </h3>
            <p className="text-sm text-white/60">
              {loadingState.subtitle}
            </p>
          </motion.div>

          <div className="w-full max-w-xs bg-white/5 rounded-full h-2 mt-4">
            <motion.div
              className="h-full bg-purple-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${loadingState.progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
