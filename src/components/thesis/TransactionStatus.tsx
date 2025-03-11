
import { useEffect } from "react";
import { QueuedTransaction, transactionQueue } from "@/services/transactionQueueService";
import { motion } from "framer-motion";
import { Check, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionStatusProps {
  transactionId: string;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

export const TransactionStatus = ({ transactionId, onComplete, onError }: TransactionStatusProps) => {
  useEffect(() => {
    const interval = setInterval(() => {
      const transaction = transactionQueue.getTransaction(transactionId);
      if (transaction) {
        if (transaction.status === 'completed' && onComplete) {
          onComplete();
          clearInterval(interval);
        } else if (transaction.status === 'failed' && onError && transaction.error) {
          onError(transaction.error);
          clearInterval(interval);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [transactionId, onComplete, onError]);

  const transaction = transactionQueue.getTransaction(transactionId);
  if (!transaction) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "p-4 rounded-lg border transition-colors",
        transaction.status === 'completed' ? "border-green-500 bg-green-500/5" :
        transaction.status === 'failed' ? "border-red-500 bg-red-500/5" :
        transaction.status === 'processing' ? "border-polygon-primary bg-polygon-primary/5" :
        "border-white/10 bg-white/5"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          transaction.status === 'completed' ? "bg-green-500" :
          transaction.status === 'failed' ? "bg-red-500" :
          transaction.status === 'processing' ? "bg-polygon-primary" :
          "bg-white/10"
        )}>
          {transaction.status === 'completed' && <Check className="w-4 h-4 text-white" />}
          {transaction.status === 'failed' && <AlertTriangle className="w-4 h-4 text-white" />}
          {transaction.status === 'processing' && <Loader2 className="w-4 h-4 text-white animate-spin" />}
          {transaction.status === 'pending' && <RefreshCw className="w-4 h-4 text-white" />}
        </div>
        
        <div>
          <h3 className={cn(
            "text-sm font-medium",
            transaction.status === 'completed' ? "text-green-500" :
            transaction.status === 'failed' ? "text-red-500" :
            transaction.status === 'processing' ? "text-polygon-primary" :
            "text-white"
          )}>
            {transaction.description}
          </h3>
          {transaction.status === 'processing' && (
            <p className="text-sm text-white/60">
              Attempt {transaction.retryCount + 1} of 3
            </p>
          )}
          {transaction.status === 'failed' && transaction.error && (
            <p className="text-sm text-red-500">
              {transaction.error}
            </p>
          )}
          {transaction.hash && (
            <a
              href={`https://polygonscan.com/tx/${transaction.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-polygon-primary hover:underline"
            >
              View on PolygonScan
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};
