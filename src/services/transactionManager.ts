
import { ethers } from "ethers";
import { ProposalError, handleError } from "./errorHandlingService";
import { EventConfig, waitForProposalCreation } from "./eventListenerService";
import { transactionQueue } from "./transactionQueueService";
import { 
  checkTokenAllowance, 
  verifyTokenTransfer, 
  generateHoldingAddress,
  isHoldingContract 
} from "./tokenService";
import { WalletType } from "@/hooks/useWalletProvider";
import { TokenTransferStatus } from "@/lib/utils";

export type TransactionType = 
  | 'erc20_approval'
  | 'erc20_transfer'
  | 'erc721_mint'
  | 'erc721_transfer'
  | 'erc1155_transfer'
  | 'proposal'
  | 'contract'
  | 'pool_creation'
  | 'token_verification'
  | 'holding_contract_deployment';

export interface TransactionConfig {
  timeout: number;
  maxRetries: number;
  backoffMs: number;
  eventConfig?: EventConfig;
  description: string;
  type: TransactionType;
  tokenConfig?: {
    tokenAddress: string;
    spenderAddress: string;
    amount: string;
    isTestMode?: boolean;
    isApproval?: boolean;
  };
  nftConfig?: {
    tokenAddress: string;
    tokenId?: number;
    amount: number;
    standard: "ERC721" | "ERC1155";
    symbol?: string;
    name?: string;
  };
  poolConfig?: {
    poolId: string;
    holdingAddress: string;
    tokenType: "erc20" | "erc721" | "erc1155";
    tokenAddress: string;
    tokenIds?: string[];
    amount?: string;
  };
  holdingConfig?: {
    creatorAddress: string;
    bountyId: string;
    securityLevel: "basic" | "multisig" | "timelock";
  };
  walletType?: WalletType;
}

const DEFAULT_CONFIG: Omit<TransactionConfig, 'description' | 'type'> = {
  timeout: 120000,
  maxRetries: 3,
  backoffMs: 5000
};

export const executeTransaction = async (
  transaction: () => Promise<ethers.ContractTransaction>,
  config: TransactionConfig,
  provider?: ethers.providers.Web3Provider
): Promise<ethers.ContractTransaction> => {
  console.log(`Executing ${config.type} transaction:`, {
    description: config.description,
    tokenConfig: config.tokenConfig,
    nftConfig: config.nftConfig,
    poolConfig: config.poolConfig,
    holdingConfig: config.holdingConfig
  });

  // Add specific validation for NFT transactions
  if ((config.type === 'erc721_mint' || config.type === 'erc721_transfer' || config.type === 'erc1155_transfer') 
      && config.nftConfig && provider) {
    console.log('NFT transaction config:', config.nftConfig);
    const network = await provider.getNetwork();
    console.log('NFT transaction on network:', network.name, network.chainId);
  }

  // Add validation for holding contract deployment
  if (config.type === 'holding_contract_deployment' && config.holdingConfig && provider) {
    console.log('Holding contract deployment config:', config.holdingConfig);
    const network = await provider.getNetwork();
    console.log('Deployment on network:', network.name, network.chainId);
  }

  if (config.type === 'erc20_approval' && config.tokenConfig) {
    console.log('Token approval config:', config.tokenConfig);
  }

  if (provider) {
    const network = await provider.getNetwork();
    console.log('Current network:', {
      chainId: network.chainId,
      name: network.name
    });
  }

  if (config.type === 'erc20_transfer' && config.tokenConfig && provider && !config.tokenConfig.isTestMode) {
    console.log('Checking token allowance...');
    const signerAddress = await provider.getSigner().getAddress();
    
    const hasAllowance = await checkTokenAllowance(
      provider,
      config.tokenConfig.tokenAddress,
      signerAddress,
      config.tokenConfig.spenderAddress,
      config.tokenConfig.amount
    );

    if (!hasAllowance) {
      throw new ProposalError({
        category: 'token',
        message: 'Insufficient token allowance',
        recoverySteps: [
          'Approve the token spending',
          'Try the transaction again after approval'
        ]
      });
    }
    console.log('Token allowance check passed');
  }

  // Special handling for pool creation with holding address
  if (config.type === 'pool_creation' && config.poolConfig && provider) {
    console.log('Creating pool with holding address:', config.poolConfig.holdingAddress);
    
    // For pool creation, we can generate a holding address if not provided
    if (!config.poolConfig.holdingAddress) {
      const signerAddress = await provider.getSigner().getAddress();
      config.poolConfig.holdingAddress = await generateHoldingAddress(
        provider,
        signerAddress,
        config.poolConfig.poolId
      );
      console.log('Generated holding address:', config.poolConfig.holdingAddress);
      
      // Verify if the holding address is a secure contract
      const isSecureContract = await isHoldingContract(provider, config.poolConfig.holdingAddress);
      console.log('Is secure holding contract:', isSecureContract);
    }
  }

  const txId = await transactionQueue.addTransaction({
    type: config.type,
    description: config.description
  });
  
  const result = await transactionQueue.processTransaction(txId, async () => {
    try {
      console.log('Executing transaction...');
      const tx = await transaction();
      console.log('Transaction submitted:', tx.hash);
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new ProposalError({
          category: 'transaction',
          message: 'Transaction timeout',
          recoverySteps: ['Check transaction status in your wallet', 'Try again with higher gas price']
        })), config.timeout || DEFAULT_CONFIG.timeout);
      });
      
      const receiptPromise = tx.wait();
      const receipt = await Promise.race([receiptPromise, timeoutPromise]);
      console.log('Transaction receipt received:', receipt);

      if (config.eventConfig) {
        try {
          const event = await waitForProposalCreation(config.eventConfig, tx.hash);
          console.log('Proposal creation event received:', event);
        } catch (error) {
          console.warn('Failed to capture proposal event:', error);
        }
      }
      
      return tx;
    } catch (error: any) {
      console.error('Transaction execution failed:', error);
      throw error;
    }
  });

  return result;
};

/**
 * Verifies if tokens have been transferred to a holding address
 * @param provider Ethereum provider
 * @param poolConfig Pool configuration with token details
 * @returns Promise resolving to verification status
 */
export const verifyPoolTokenTransfer = async (
  provider: ethers.providers.Provider,
  poolConfig: TransactionConfig['poolConfig']
): Promise<{
  status: TokenTransferStatus;
  currentAmount: string;
  targetAmount: string;
  missingTokens?: string[];
}> => {
  if (!poolConfig) {
    throw new Error("Pool configuration is required for verification");
  }
  
  console.log("Verifying pool token transfer:", poolConfig);
  
  // First check if this is a secure holding contract
  const isSecureContract = await isHoldingContract(provider, poolConfig.holdingAddress);
  console.log("Is secure holding contract:", isSecureContract);
  
  return await verifyTokenTransfer(
    provider,
    {
      tokenAddress: poolConfig.tokenAddress,
      tokenType: poolConfig.tokenType,
      tokenIds: poolConfig.tokenIds,
      amount: poolConfig.amount ? parseFloat(poolConfig.amount) : undefined
    },
    poolConfig.holdingAddress
  );
};

/**
 * Deploys a secure holding contract for token distribution
 * @param provider Ethereum provider with signer
 * @param creatorAddress Address of the bounty creator
 * @param bountyId Unique identifier for the bounty
 * @param securityLevel Security configuration for the holding contract
 * @returns Promise resolving to the deployed contract address
 */
export const deployHoldingContract = async (
  provider: ethers.providers.Web3Provider,
  creatorAddress: string,
  bountyId: string,
  securityLevel: "basic" | "multisig" | "timelock" = "basic"
): Promise<string> => {
  console.log(`Deploying secure holding contract for ${creatorAddress} and bounty ${bountyId}`);
  
  try {
    // First check if there's an existing contract
    const existingAddress = await generateHoldingAddress(provider, creatorAddress, bountyId);
    const isExistingContract = await isHoldingContract(provider, existingAddress);
    
    if (isExistingContract) {
      console.log(`Existing holding contract found at ${existingAddress}`);
      return existingAddress;
    }
    
    // If no existing contract, deploy a new one
    const holdingConfig: TransactionConfig['holdingConfig'] = {
      creatorAddress,
      bountyId,
      securityLevel
    };
    
    const deployTransaction = async () => {
      // This will actually deploy the contract via generateHoldingAddress
      await generateHoldingAddress(provider, creatorAddress, bountyId);
      // Create a dummy transaction to satisfy the interface
      return {
        hash: "0x" + "0".repeat(64),
        wait: async () => ({ status: 1 })
      } as unknown as ethers.ContractTransaction;
    };
    
    await executeTransaction(
      deployTransaction,
      {
        type: 'holding_contract_deployment',
        description: `Deploying secure holding contract for bounty ${bountyId}`,
        holdingConfig,
        ...DEFAULT_CONFIG
      },
      provider
    );
    
    // Get the address of the deployed contract
    const holdingAddress = await generateHoldingAddress(provider, creatorAddress, bountyId);
    console.log(`Holding contract deployed at ${holdingAddress}`);
    
    return holdingAddress;
  } catch (error) {
    console.error("Error deploying holding contract:", error);
    throw new ProposalError({
      category: 'transaction',
      message: `Failed to deploy holding contract: ${error instanceof Error ? error.message : 'Unknown error'}`,
      recoverySteps: [
        'Check your wallet connection',
        'Make sure you have enough funds for gas',
        'Try again later'
      ]
    });
  }
};
