import { cn } from "@/lib/utils";
import { Wallet, Check, AlertCircle, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ethers } from "ethers";
import { transactionQueue } from "@/services/transactionQueueService";
import { toast } from "@/hooks/use-toast";
import { TransactionStatus } from "@/components/thesis/TransactionStatus";
import { ProposalError } from "@/services/errorHandlingService";
import { gasOptimizer } from "@/services/gasOptimizationService";

export interface SmartWalletState {
  status: 'checking' | 'creating' | 'ready' | 'error';
  message: string;
  isFirstTime: boolean;
}

interface ZeroDevResponse {
  success: boolean;
  error?: string;
  walletAddress?: string;
  estimatedGas?: string;
}

const ZERODEV_FACTORY_ADDRESS = "0x5D07c471C0E12D89D9F27D4A5A7c29A04B393c8F"; // Polygon Mainnet
const ZERODEV_FACTORY_ABI = [
  "function createWallet(address owner) returns (address)",
  "function getWalletAddress(address owner) view returns (address)"
];

export const SmartWalletStatus = () => {
  const { primaryWallet } = useDynamicContext();
  const { address } = useWalletConnection();
  const [state, setState] = useState<SmartWalletState>({
    status: 'checking',
    message: 'Checking wallet status...',
    isFirstTime: false
  });
  const [deploymentTxId, setDeploymentTxId] = useState<string | null>(null);
  const [initializationAttempts, setInitializationAttempts] = useState(0);
  const MAX_INITIALIZATION_ATTEMPTS = 3;
  const RETRY_DELAY = 2000;

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const deploySmartWallet = async (signer: ethers.Signer): Promise<ZeroDevResponse> => {
    try {
      const ownerAddress = await signer.getAddress();
      console.log('Deploying smart wallet for owner:', ownerAddress);

      const txId = await transactionQueue.addTransaction({
        type: 'contract',
        description: 'Deploying Smart Wallet'
      });
      setDeploymentTxId(txId);

      const result = await transactionQueue.processTransaction(txId, async () => {
        const walletClient = await primaryWallet?.getWalletClient();
        if (!walletClient) {
          throw new ProposalError({
            category: 'wallet',
            message: 'Failed to initialize wallet client',
            recoverySteps: ['Please refresh and try again', 'Check wallet connection']
          });
        }

        const provider = new ethers.providers.Web3Provider(walletClient as any);
        const chainId = walletClient.chain?.id;
        
        if (chainId !== 137) {
          throw new ProposalError({
            category: 'network',
            message: 'Please switch to Polygon network',
            recoverySteps: ['Switch to Polygon Mainnet in your wallet']
          });
        }

        const factory = new ethers.Contract(
          ZERODEV_FACTORY_ADDRESS,
          ZERODEV_FACTORY_ABI,
          provider
        );

        const existingWalletAddress = await factory.getWalletAddress(ownerAddress);
        if (existingWalletAddress !== ethers.constants.AddressZero) {
          console.log('Existing wallet found:', existingWalletAddress);
          localStorage.setItem('zeroDevWalletAddress', existingWalletAddress);
          
          return {
            success: true,
            walletAddress: existingWalletAddress
          };
        }

        console.log('No existing wallet found, deploying new one...');
        const factoryWithSigner = factory.connect(signer);
        
        const gasEstimate = await factory.estimateGas.createWallet(ownerAddress);
        const optimizedGas = gasEstimate.mul(120).div(100); // 20% buffer
        
        const tx = await factoryWithSigner.createWallet(ownerAddress, {
          gasLimit: optimizedGas
        });

        console.log('Deployment transaction sent:', tx.hash);
        const receipt = await tx.wait();
        console.log('Deployment confirmed:', receipt);

        const deployedAddress = receipt.events?.[0]?.args?.wallet;
        if (!deployedAddress) {
          throw new ProposalError({
            category: 'contract',
            message: 'Failed to get deployed wallet address',
            recoverySteps: ['Please try again', 'Check transaction on explorer']
          });
        }

        localStorage.setItem('zeroDevWalletAddress', deployedAddress);
        return {
          success: true,
          walletAddress: deployedAddress,
          transaction: tx,
          receipt: receipt
        };
      });

      if ('error' in result) {
        throw result.error;
      }

      return result;
    } catch (error: any) {
      console.error('Smart wallet deployment error:', error);
      const proposalError = error instanceof ProposalError ? error : new ProposalError({
        category: 'unknown',
        message: error.message || 'Failed to deploy smart wallet',
        recoverySteps: ['Please try again', 'Check wallet connection']
      });

      toast({
        title: "Deployment Failed",
        description: proposalError.message,
        variant: "destructive"
      });

      return {
        success: false,
        error: proposalError.message
      };
    }
  };

  const initializeSmartWallet = async () => {
    if (!primaryWallet || !address) return;

    try {
      console.log('Checking wallet status for address:', address);
      
      let walletClient;
      try {
        console.log('Attempting to get wallet client...');
        walletClient = await primaryWallet.getWalletClient();
        console.log('Wallet client response:', walletClient);

        if (!walletClient && initializationAttempts < MAX_INITIALIZATION_ATTEMPTS) {
          console.log(`Retry ${initializationAttempts + 1}/${MAX_INITIALIZATION_ATTEMPTS}`);
          setInitializationAttempts(prev => prev + 1);
          await delay(RETRY_DELAY);
          return;
        }

        const provider = new ethers.providers.Web3Provider(walletClient as any);
        const network = await provider.getNetwork();
        console.log('Connected to network:', network.name);

        if (network.chainId !== 137) {
          throw new ProposalError({
            category: 'network',
            message: 'Please switch to Polygon network',
            recoverySteps: ['Switch to Polygon Mainnet in your wallet']
          });
        }
      } catch (error) {
        console.error('Error getting wallet client:', error);
        walletClient = null;
      }
      
      if (!walletClient) {
        console.log('No existing wallet found, initiating creation...');
        setState({
          status: 'creating',
          message: 'Setting up your smart wallet...',
          isFirstTime: true
        });

        try {
          const provider = new ethers.providers.Web3Provider(primaryWallet as any);
          const signer = provider.getSigner();
          
          const deploymentResult = await deploySmartWallet(signer);
          
          if (!deploymentResult.success) {
            throw new Error(deploymentResult.error || 'Deployment failed');
          }

          console.log('Smart wallet deployed successfully:', deploymentResult);

          toast({
            title: "Success",
            description: "Smart wallet deployed successfully",
          });

          setState({
            status: 'ready',
            message: 'Smart wallet is ready',
            isFirstTime: true
          });
        } catch (error) {
          console.error('Smart wallet creation error:', error);
          setState({
            status: 'error',
            message: error instanceof Error ? error.message : 'Failed to create smart wallet',
            isFirstTime: false
          });
          throw error;
        }
      } else {
        console.log('Existing wallet found');
        setState({
          status: 'ready',
          message: 'Smart wallet is ready',
          isFirstTime: false
        });
      }
    } catch (error: any) {
      console.error('Smart wallet setup error:', error);
      setState({
        status: 'error',
        message: error.message || 'Failed to setup smart wallet',
        isFirstTime: false
      });
    }
  };

  useEffect(() => {
    initializeSmartWallet();
  }, [primaryWallet, address, initializationAttempts]);

  return (
    <div className="space-y-4">
      <Card className={cn(
        "p-4 border transition-colors",
        state.status === 'ready' ? "border-green-500 bg-green-500/5" :
        state.status === 'error' ? "border-red-500 bg-red-500/5" :
        "border-blue-500 bg-blue-500/5"
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            state.status === 'ready' ? "bg-green-500" :
            state.status === 'error' ? "bg-red-500" :
            "bg-blue-500"
          )}>
            {state.status === 'ready' && <Check className="w-5 h-5 text-white" />}
            {state.status === 'error' && <AlertCircle className="w-5 h-5 text-white" />}
            {(state.status === 'checking' || state.status === 'creating') && (
              <Loader className="w-5 h-5 text-white animate-spin" />
            )}
          </div>

          <div className="flex-1">
            <h3 className="text-sm font-medium text-white">
              Smart Wallet Status
            </h3>
            <p className="text-sm text-white/60">
              {state.message}
            </p>
            {state.isFirstTime && state.status === 'ready' && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-green-400 mt-1"
              >
                Smart wallet created successfully!
              </motion.p>
            )}
          </div>
        </div>
      </Card>

      {deploymentTxId && (
        <div className="mt-4">
          <TransactionStatus
            transactionId={deploymentTxId}
            onComplete={() => setDeploymentTxId(null)}
            onError={(error) => {
              toast({
                title: "Deployment Error",
                description: error,
                variant: "destructive"
              });
            }}
          />
        </div>
      )}
    </div>
  );
};
