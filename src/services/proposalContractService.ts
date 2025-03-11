import { ethers } from "ethers";
import { ProposalError, handleError } from "./errorHandlingService";
import { EventConfig, waitForProposalCreation } from "./eventListenerService";
import { transactionQueue } from "./transactionQueueService";
import { checkTokenAllowance } from "./tokenService";
import { WalletType } from "@/hooks/useWalletProvider";
import { executeTransaction } from "./transactionManager";
import { FACTORY_ADDRESS, FACTORY_ABI, RD_TOKEN_ADDRESS, SUBMISSION_FEE } from "@/lib/constants";
import { uploadToIPFS } from "./ipfsService";
import { 
  ProposalMetadata, 
  ProposalConfig, 
  ProposalContractInput,
  ProposalContractTuple
} from "@/types/proposals";
import type { DynamicContextType } from "@dynamic-labs/sdk-react-core";

export interface ContractStatus {
  submissionFee: ethers.BigNumber;
  isPaused: boolean;
  isTestMode: boolean;
  treasury: string;
  minTargetCapital: ethers.BigNumber;
  maxTargetCapital: ethers.BigNumber;
  minVotingDuration: number;
  maxVotingDuration: number;
  votingFee: ethers.BigNumber;
  lgrTokenAddress: string;
  owner: string;
  tester: string;
}

async function getProvider(wallet: NonNullable<DynamicContextType['primaryWallet']>) {
  try {
    const walletClient = await wallet.getWalletClient();
    if (!walletClient) {
      throw new Error("No wallet client available");
    }
    return new ethers.providers.Web3Provider(walletClient as any);
  } catch (error) {
    console.error("Error getting provider:", error);
    throw new Error("Failed to initialize provider");
  }
}

export const createProposal = async (
  metadata: ProposalMetadata,
  wallet: NonNullable<DynamicContextType['primaryWallet']>
): Promise<ethers.ContractTransaction> => {
  console.log("Starting proposal creation with metadata:", metadata);
  
  const provider = await getProvider(wallet);
  const signer = provider.getSigner();
  const signerAddress = await signer.getAddress();

  // Get network to verify we're on the correct chain
  const network = await provider.getNetwork();
  console.log("Current network:", network);

  // Verify contract existence and code
  const contractCode = await provider.getCode(FACTORY_ADDRESS);
  if (contractCode === '0x') {
    throw new Error(`No contract found at address ${FACTORY_ADDRESS}`);
  }

  console.log("Contract verified at:", FACTORY_ADDRESS);
  
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);
  
  try {
    // Verify the contract is not paused
    const isPaused = await factory.paused();
    if (isPaused) {
      throw new Error("Contract is currently paused");
    }

    // Check if user has enough RD token balance
    const rdToken = new ethers.Contract(
      RD_TOKEN_ADDRESS,
      ["function balanceOf(address) view returns (uint256)"],
      provider
    );
    const balance = await rdToken.balanceOf(signerAddress);
    if (balance.lt(SUBMISSION_FEE)) {
      throw new Error(`Insufficient RD balance. Required: ${ethers.utils.formatUnits(SUBMISSION_FEE, 18)} RD`);
    }

    // Check token allowance using the raw wei amount
    const hasAllowance = await checkTokenAllowance(
      provider,
      RD_TOKEN_ADDRESS,
      signerAddress,
      FACTORY_ADDRESS,
      SUBMISSION_FEE.toString()
    );

    if (!hasAllowance) {
      throw new Error("Please approve RD token spending first");
    }

    // Upload metadata to IPFS first
    console.log("Uploading metadata to IPFS...");
    const ipfsHash = await uploadToIPFS(metadata);
    console.log("IPFS upload successful:", ipfsHash);

    // Convert target capital to proper format
    const targetCapital = ethers.utils.parseUnits(metadata.investment.targetCapital, 18);

    const contractInput: ProposalContractInput = {
      title: metadata.title,
      metadataURI: `ipfs://${ipfsHash}`,
      targetCapital,
      votingDuration: metadata.votingDuration
    };

    // Validate the input before sending
    validateProposalInput(contractInput);

    // Log important transaction details
    console.log("Creating proposal with parameters:", {
      title: contractInput.title,
      metadataURI: contractInput.metadataURI,
      targetCapital: ethers.utils.formatUnits(contractInput.targetCapital, 18),
      votingDuration: contractInput.votingDuration,
      senderAddress: signerAddress,
      contractAddress: FACTORY_ADDRESS
    });

    // Submit proposal with explicit gas settings and proper error handling
    return await executeTransaction(
      () => factory.createProposal(
        contractInput.title,
        contractInput.metadataURI,
        contractInput.targetCapital,
        contractInput.votingDuration,
        {
          gasLimit: 1000000,
        }
      ),
      {
        type: 'proposal',
        description: `Creating proposal "${contractInput.title}"`,
        timeout: 180000,
        maxRetries: 3,
        backoffMs: 5000
      }
    );
  } catch (error) {
    console.error("Error creating proposal:", error);
    throw error;
  }
};

function sanitizeString(str: string): string {
  return str
    .replace(/[^\w\s.,'-]/g, '') 
    .replace(/\s+/g, ' ')
    .trim();
}

function processText(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return text.trim().replace(/[^\w\s.,'-]/g, '').replace(/\s+/g, ' ');
}

function validateTextLength(text: string, field: string, min?: number, max?: number): void {
  if (min !== undefined && text.length < min) {
    throw new Error(`${field} must be at least ${min} characters (current: ${text.length})`);
  }
  if (max !== undefined && text.length > max) {
    throw new Error(`${field} must not exceed ${max} characters (current: ${text.length})`);
  }
}

function validateProposalInput(input: ProposalContractInput) {
  try {
    validateTextLength(input.title, "Title", 10, 100);
    
    if (!input.metadataURI || input.metadataURI.length === 0) {
      throw new Error("Metadata URI is required");
    }

    // Convert target capital to BigNumber if it isn't already
    const targetCapitalBN = ethers.BigNumber.isBigNumber(input.targetCapital) 
      ? input.targetCapital 
      : ethers.BigNumber.from(input.targetCapital);

    const minTarget = ethers.utils.parseUnits("1000", 18); // 1,000 RD
    const maxTarget = ethers.utils.parseUnits("25000000", 18); // 25M RD

    if (targetCapitalBN.lt(minTarget) || targetCapitalBN.gt(maxTarget)) {
      throw new Error("Target capital must be between 1,000 and 25,000,000 RD");
    }

    if (input.votingDuration < 7 * 24 * 60 * 60 || input.votingDuration > 90 * 24 * 60 * 60) {
      throw new Error("Voting duration must be between 7 and 90 days");
    }
  } catch (error) {
    console.error("Validation error:", error);
    throw error;
  }
}

function transformToContractTuple(input: ProposalContractInput): ProposalContractTuple {
  if (!ethers.BigNumber.isBigNumber(input.targetCapital)) {
    throw new Error("targetCapital must be a BigNumber");
  }

  return {
    title: input.title,
    metadataURI: input.metadataURI,
    targetCapital: input.targetCapital.toString(),
    votingDuration: input.votingDuration
  };
}

function transformConfigToContractInput(config: ProposalConfig): ProposalContractInput {
  console.log("Transforming config to contract input:", config);
  
  try {
    const contractInput: ProposalContractInput = {
      title: processText(config.metadata.title),
      metadataURI: config.metadataURI,
      targetCapital: config.targetCapital,
      votingDuration: config.votingDuration
    };

    // Validate the input before returning
    validateProposalInput(contractInput);

    return contractInput;
  } catch (error) {
    console.error("Error transforming config:", error);
    throw error;
  }
}

export const setTestMode = async (
  enabled: boolean,
  wallet: NonNullable<DynamicContextType['primaryWallet']>
): Promise<ethers.ContractTransaction> => {
  const provider = await getProvider(wallet);
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider.getSigner());
  
  const signerAddress = await provider.getSigner().getAddress();
  const status = await getContractStatus(wallet);
  
  if (signerAddress.toLowerCase() !== status.tester.toLowerCase()) {
    throw new Error("Not authorized - must be the tester address");
  }

  console.log('Setting test mode with tester wallet:', {
    signerAddress,
    testerAddress: status.tester,
    enabled
  });

  return await executeTransaction(
    () => factory.setTestMode(enabled),
    {
      type: 'contract',
      description: `Setting test mode to ${enabled}`,
      timeout: 60000,
      maxRetries: 2,
      backoffMs: 3000
    }
  );
};

export const estimateProposalGas = async (
  config: ProposalConfig,
  wallet: NonNullable<DynamicContextType['primaryWallet']>
): Promise<ethers.BigNumber> => {
  const provider = await getProvider(wallet);
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider.getSigner());
  
  const input = {
    title: config.metadata.title,
    ipfsMetadata: config.ipfsHash,
    targetCapital: config.targetCapital,
    votingDuration: config.votingDuration,
    investmentDrivers: config.metadata.investment.drivers,
    additionalCriteria: config.metadata.investment.additionalCriteria,
    firmSize: config.metadata.firmCriteria.size,
    location: config.metadata.firmCriteria.location,
    dealType: config.metadata.firmCriteria.dealType,
    geographicFocus: config.metadata.firmCriteria.geographicFocus,
    paymentTerms: config.metadata.paymentTerms,
    operationalStrategies: config.metadata.strategies.operational,
    growthStrategies: config.metadata.strategies.growth,
    integrationStrategies: config.metadata.strategies.integration
  };
  
  try {
    const gasEstimate = await factory.estimateGas.createProposal(input, config.linkedInURL);
    return gasEstimate.mul(120).div(100);
  } catch (error) {
    console.error("Gas estimation error:", error);
    throw error;
  }
};

export const getContractStatus = async (wallet: NonNullable<DynamicContextType['primaryWallet']>): Promise<ContractStatus> => {
  const provider = await getProvider(wallet);
  const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);

  try {
    const [
      submissionFee,
      isPaused,
      isTestMode,
      treasury,
      minTargetCapital,
      maxTargetCapital,
      minVotingDuration,
      maxVotingDuration,
      votingFee,
      lgrTokenAddress,
      owner,
      tester
    ] = await Promise.all([
      factory.submissionFee(),
      factory.paused(),
      factory.testModeEnabled(),
      factory.treasury(),
      factory.MIN_TARGET_CAPITAL(),
      factory.MAX_TARGET_CAPITAL(),
      factory.MIN_VOTING_DURATION(),
      factory.MAX_VOTING_DURATION(),
      factory.VOTING_FEE(),
      factory.LGR_TOKEN(),
      factory.owner(),
      factory.tester()
    ]);

    return {
      submissionFee,
      isPaused,
      isTestMode,
      treasury,
      minTargetCapital,
      maxTargetCapital,
      minVotingDuration: Number(minVotingDuration),
      maxVotingDuration: Number(maxVotingDuration),
      votingFee,
      lgrTokenAddress,
      owner,
      tester
    };
  } catch (error) {
    console.error("Error getting contract status:", error);
    throw new Error("Failed to get contract status");
  }
};
