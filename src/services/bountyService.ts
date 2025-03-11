import { ethers } from "ethers";
import { generateHoldingAddress } from "./tokenService";
import { WalletType } from "@/hooks/useWalletProvider";

// PartyDAO Contract Addresses by Network
const PARTY_DAO_ADDRESSES = {
  // Ethereum Mainnet
  1: {
    PartyFactory: "0x2dFA21A5EbF5CcBE62566458A1baEC6B1F33f292",
    BuyCrowdfund: "0x104db1e49b87c80ec2e2e9716e83a304415c15ce",
    ProposalExecutionEngine: "0xdf6a4d97dd2aa32a54b8a2b2711f210b711f28f0",
    TokenDistributor: "0x0b7b86DCEAa8015CeD8F625d3b7A961b31fB05FE",
    Party: "0xb676cfeeed5c7b739452a502f1eff9ab684a56da"
  },
  // Base Mainnet
  8453: {
    PartyFactory: "0xF8c8fC091C0Cc94a9029d6443050bDfF9097E38A",
    BuyCrowdfund: "0x104db1E49b87C80Ec2E2E9716e83A304415C15Ce",
    ProposalExecutionEngine: "0xaec4D40045DaF91Bc3049ea9136C7dF04bD8a6af",
    TokenDistributor: "0x65778953D291DD1e3a97c6b4d8BEea188B650077",
    Party: "0x65EBb1f88AA377ee56E8114234d5721eb4C5BAfd"
  },
  // Goerli Testnet
  5: {
    PartyFactory: "0x83e63E8bAba6C6dcb9F3F4324bEfA72AD8f43e44",
    BuyCrowdfund: "0x712Dca72Cc443A5f5e03A388b69ab09b4CDAC428",
    ProposalExecutionEngine: "0xc148E6f886CccdA5dEBbBA10d864d007E0C74c85",
    TokenDistributor: "0x510c2F7e19a8f2537A3fe3Cf847e6583b993FA60",
    Party: "0x72a4b63eceA9465e3984CDEe1354b9CF9030c043"
  }
} as const;

// Network names for user display
const NETWORK_NAMES = {
  1: "Ethereum",
  8453: "Base",
  5: "Goerli"
} as const;

// ABI snippets for PartyDAO contracts
const PARTY_FACTORY_ABI = [
  "function createParty(address authority, address preciousToken, uint256 preciousTokenId, address[] calldata hosts) external returns (address)",
  "function createBuyCrowdfund(tuple(string name, string symbol, uint256 customizationPresetId, address nftContract, uint256 nftTokenId, uint40 duration, uint96 maximumPrice, address payable splitRecipient, uint16 splitBps, address initialContributor, address initialDelegate, uint96 minContribution, uint96 maxContribution, address gateKeeper, bytes12 gateKeeperId, bool onlyHostCanBuy, tuple(address[] hosts, uint40 voteDuration, uint40 executionDelay, uint16 passThresholdBps) governanceOpts) opts) external payable returns (address)"
];

const PARTY_ABI = [
  "function propose(bytes calldata proposalData) external returns (uint256)",
  "function execute(uint256 proposalId, bytes calldata proposalData) external",
  "function distribute(address[] calldata tokens, uint256[] calldata tokenIds) external"
];

// Updated BountyStatus type to include "awaiting_tokens"
export type BountyStatus = "completed" | "active" | "paused" | "expired" | "awaiting_tokens";

export interface Bounty {
  id: string;
  creatorAddress: string;
  title: string;
  description: string;
  rewardAmount: number;
  rewardTokenAddress: string;
  criteria: string;
  createdDate: string;
  expirationDate: string;
  completedDate?: string;
  pausedDate?: string;
  resumedDate?: string;
  tokenVerificationStatus: "pending" | "verified" | "failed" | "awaiting";
  bountyHunterAddress?: string;
  submissionDetails?: string;
  submissionDate?: string;
  feedback?: string;
  rating?: number;
  payoutTransactionHash?: string;
  bountyHunterPayoutAddress?: string;
  holdingContractAddress?: string;
  securityLevel: "basic" | "multisig" | "timelock";
  creatorEnsName?: string;
  bountyHunterEnsName?: string;
  creatorDynamicName?: string;
  creatorDynamicAvatar?: string;
  hunterDynamicName?: string;
  hunterDynamicAvatar?: string;
}

export interface BountyCreationParams {
  creatorAddress: string;
  title: string;
  description: string;
  rewardAmount: number;
  rewardTokenAddress: string;
  criteria: string;
  expirationDate: string;
  securityLevel: "basic" | "multisig" | "timelock";
}

// Add NameServiceData interface
export interface NameServiceData {
  name?: string;
  avatar?: string;
}

// Add localStorage keys
const STORAGE_KEYS = {
  REFERRALS: 'bounty_referrals_',
  BOUNTY_METADATA: 'bounty_metadata_'
} as const;

// Add interface for referral data
interface ReferralData {
  referrerId: string;
  referredUser: string;
  timestamp: number;
  bountyId: string;
}

/**
 * Gets contract addresses for the current network
 * @param chainId Network chain ID
 * @returns Contract addresses for the network
 */
function getContractAddresses(chainId: number) {
  const addresses = PARTY_DAO_ADDRESSES[chainId as keyof typeof PARTY_DAO_ADDRESSES];
  if (!addresses) {
    throw new Error(`Unsupported network: ${chainId}`);
  }
  return addresses;
}

/**
 * Ensures the wallet is connected to the correct network
 * @param wallet Wallet instance
 * @param targetChainId Desired chain ID
 */
async function ensureNetwork(wallet: WalletType, targetChainId: number): Promise<void> {
  if (wallet.chain !== targetChainId.toString()) {
    await wallet.switchNetwork(targetChainId);
    await wallet.sync(); // Ensure wallet state is updated
  }
}

/**
 * Resolves ENS names for addresses
 * @param wallet Wallet instance
 * @param address Ethereum address
 * @returns ENS name if available
 */
async function resolveEnsName(wallet: WalletType, address: string): Promise<string | null> {
  try {
    const nameService = await wallet.getNameService();
    return nameService?.name || null;
  } catch (error) {
    console.warn("Failed to resolve ENS name:", error);
    return null;
  }
}

/**
 * Resolves user's Dynamic name service data
 * @param wallet Wallet instance
 * @returns Name service data if available
 */
async function resolveDynamicName(wallet: WalletType): Promise<NameServiceData | null> {
  try {
    const nameService = await wallet.getNameService();
    if (nameService) {
      return {
        name: nameService.name,
        avatar: nameService.avatar
      };
    }
    return null;
  } catch (error) {
    console.warn("Failed to resolve Dynamic name:", error);
    return null;
  }
}

/**
 * Get status of a bounty based on its data
 * @param bounty Bounty data object
 * @returns Current status of the bounty
 */
export function getBountyStatus(bounty: Bounty): BountyStatus {
  if (!bounty) return "expired";
  
  const now = Date.now();
  
  if (bounty.completedDate) {
    return "completed";
  }
  
  // Token verification pending
  if (bounty.tokenVerificationStatus === "awaiting") {
    return "awaiting_tokens";
  }
  
  if (bounty.pausedDate && !bounty.resumedDate) {
    return "paused";
  }
  
  if (bounty.expirationDate && new Date(bounty.expirationDate).getTime() < now) {
    return "expired";
  }
  
  return "active";
}

/**
 * Pauses a bounty
 * @param bountyId ID of the bounty to pause
 * @returns Promise resolving to boolean indicating success
 */
export async function pauseBounty(bountyId: string): Promise<boolean> {
  // Placeholder implementation
  console.log(`Pausing bounty with ID: ${bountyId}`);
  return true;
}

/**
 * Resumes a paused bounty
 * @param bountyId ID of the bounty to resume
 * @returns Promise resolving to boolean indicating success
 */
export async function resumeBounty(bountyId: string): Promise<boolean> {
  // Placeholder implementation
  console.log(`Resuming bounty with ID: ${bountyId}`);
  return true;
}

/**
 * Expires a bounty
 * @param bountyId ID of the bounty to expire
 * @returns Promise resolving to boolean indicating success
 */
export async function expireBounty(bountyId: string): Promise<boolean> {
  // Placeholder implementation
  console.log(`Expiring bounty with ID: ${bountyId}`);
  return true;
}

/**
 * Submits a solution to a bounty
 * @param bountyId ID of the bounty
 * @param submissionDetails Details of the submission
 * @param bountyHunterAddress Address of the bounty hunter
 * @returns Promise resolving to boolean indicating success
 */
export async function submitBountySolution(
  bountyId: string,
  submissionDetails: string,
  bountyHunterAddress: string
): Promise<boolean> {
  // Placeholder implementation
  console.log(`Submitting solution for bounty ${bountyId} by ${bountyHunterAddress}`);
  return true;
}

/**
 * Approves a bounty submission
 * @param bountyId ID of the bounty
 * @param feedback Feedback for the submission
 * @param rating Rating for the submission
 * @returns Promise resolving to boolean indicating success
 */
export async function approveBountySubmission(
  bountyId: string,
  feedback: string,
  rating: number
): Promise<boolean> {
  // Placeholder implementation
  console.log(`Approving submission for bounty ${bountyId} with rating ${rating}`);
  return true;
}

/**
 * Rejects a bounty submission
 * @param bountyId ID of the bounty
 * @param feedback Feedback for the submission
 * @returns Promise resolving to boolean indicating success
 */
export async function rejectBountySubmission(
  bountyId: string,
  feedback: string
): Promise<boolean> {
  // Placeholder implementation
  console.log(`Rejecting submission for bounty ${bountyId} with feedback: ${feedback}`);
  return true;
}

/**
 * Pays out the bounty reward to the bounty hunter
 * @param bountyId ID of the bounty
 * @param payoutTransactionHash Transaction hash of the payout
 * @returns Promise resolving to boolean indicating success
 */
export async function payoutBounty(bountyId: string, payoutTransactionHash: string): Promise<boolean> {
  // Placeholder implementation
  console.log(`Paying out bounty ${bountyId} with transaction hash: ${payoutTransactionHash}`);
  return true;
}

/**
 * Gets a bounty by its ID
 * @param bountyId ID of the bounty to retrieve
 * @returns Promise resolving to the bounty object or null if not found
 */
export async function getBounty(bountyId: string): Promise<Bounty | null> {
  try {
    // Get metadata from localStorage
    const metadata = localStorage.getItem(STORAGE_KEYS.BOUNTY_METADATA + bountyId);
    const storedData = metadata ? JSON.parse(metadata) : {};

    // Get crowdfund contract
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const crowdfund = new ethers.Contract(
      storedData.holdingContractAddress || '',
      [
        "function name() view returns (string)",
        "function getBalance() view returns (uint256)",
        "function maximumPrice() view returns (uint256)",
        "function duration() view returns (uint40)",
        "function splitRecipient() view returns (address)",
        "function tokenContract() view returns (address)"
      ],
      provider
    );

    // Get on-chain data
    const [name, balance, maxPrice, duration, splitRecipient, tokenContract] = await Promise.all([
      crowdfund.name(),
      crowdfund.getBalance(),
      crowdfund.maximumPrice(),
      crowdfund.duration(),
      crowdfund.splitRecipient(),
      crowdfund.tokenContract()
    ]);

    return {
      ...storedData,
      id: bountyId,
      title: name,
      rewardAmount: parseFloat(ethers.utils.formatEther(maxPrice)),
      rewardTokenAddress: tokenContract,
      currentParticipation: parseFloat(ethers.utils.formatEther(balance)),
      expirationDate: new Date(Date.now() + duration * 1000).toISOString(),
      creatorAddress: splitRecipient,
      tokenVerificationStatus: balance.gte(maxPrice) ? "verified" : "awaiting",
      securityLevel: storedData.securityLevel || "basic"
    };
  } catch (error) {
    console.error("Error fetching bounty:", error);
    return null;
  }
}

/**
 * Creates a bounty with given parameters
 * @param bountyData Bounty creation parameters
 * @param provider Ethereum provider with signer
 * @returns Promise resolving to created bounty ID
 */
export async function createBounty(
  bountyData: BountyCreationParams,
  provider: ethers.providers.Web3Provider
): Promise<string> {
  try {
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    
    // Generate a unique bounty ID
    const bountyId = `${Date.now()}-${signerAddress.slice(2, 8)}`;
    
    // Store metadata in localStorage
    const metadata = {
      description: bountyData.description,
      criteria: bountyData.criteria,
      createdDate: new Date().toISOString(),
      creatorAddress: signerAddress,
      securityLevel: bountyData.securityLevel
    };
    
    localStorage.setItem(STORAGE_KEYS.BOUNTY_METADATA + bountyId, JSON.stringify(metadata));
    
    return bountyId;
  } catch (error) {
    console.error("Error creating bounty:", error);
    throw error;
  }
}

/**
 * Records a referral in localStorage
 * @param referralData Referral data to store
 */
function storeReferral(referralData: ReferralData): void {
  const key = STORAGE_KEYS.REFERRALS + referralData.bountyId;
  const existing = localStorage.getItem(key);
  const referrals = existing ? JSON.parse(existing) : [];
  referrals.push(referralData);
  localStorage.setItem(key, JSON.stringify(referrals));
}

/**
 * Gets referrals for a bounty
 * @param bountyId Bounty ID to get referrals for
 * @returns Array of referral data
 */
export function getBountyReferrals(bountyId: string): ReferralData[] {
  const key = STORAGE_KEYS.REFERRALS + bountyId;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Records a successful referral
 * @param bountyId ID of the bounty
 * @param referrerId ID of the referrer
 * @param referredUser Address of the referred user
 * @param wallet Wallet instance for signing
 * @param targetChainId Target network chain ID
 * @returns Promise resolving to success status
 */
export async function recordSuccessfulReferral(
  bountyId: string,
  referrerId: string,
  referredUser: string,
  wallet: WalletType,
  targetChainId: number = 1
): Promise<{ success: boolean; error?: string }> {
  try {
    // Store referral in localStorage
    storeReferral({
      referrerId,
      referredUser,
      timestamp: Date.now(),
      bountyId
    });

    // Rest of the existing function...
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

/**
 * Updates bounty information
 * @param bountyId ID of the bounty to update
 * @param updates Object with the updates
 * @returns Promise resolving to boolean indicating success
 */
export async function updateBounty(
  bountyId: string,
  updates: Partial<Bounty>
): Promise<boolean> {
  try {
    const key = STORAGE_KEYS.BOUNTY_METADATA + bountyId;
    const existing = localStorage.getItem(key);
    const data = existing ? JSON.parse(existing) : {};
    
    localStorage.setItem(key, JSON.stringify({
      ...data,
      ...updates,
      lastUpdated: new Date().toISOString()
    }));
    
    return true;
  } catch (error) {
    console.error("Error updating bounty:", error);
    return false;
  }
}

/**
 * Gets all bounties, optionally filtered by status
 * @param status Optional status to filter bounties by
 * @returns Promise resolving to an array of bounty objects
 */
export async function getBounties(status?: BountyStatus): Promise<Bounty[]> {
  // Placeholder implementation
  console.log(`Getting bounties${status ? ` with status: ${status}` : ''}`);
  
  // For now, return sample data
  const sampleBounties: Bounty[] = [
    {
      id: "1",
      creatorAddress: "0x123...",
      title: "Sample Active Bounty",
      description: "This is a sample active bounty.",
      rewardAmount: 100,
      rewardTokenAddress: "0x...",
      criteria: "Complete the task",
      createdDate: new Date().toISOString(),
      expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      tokenVerificationStatus: "verified",
      securityLevel: "basic"
    }
  ];

  // If status is provided, filter the bounties
  if (status) {
    return sampleBounties.filter(bounty => getBountyStatus(bounty) === status);
  }

  return sampleBounties;
}

/**
 * Verifies and approves token funding for a bounty
 * @param bountyId ID of the bounty to verify funding for
 * @param provider Ethereum provider with signer
 * @returns Promise resolving to verification result
 */
export async function verifyBountyFunding(
  bountyId: string,
  provider: ethers.providers.Web3Provider // Changed from Provider to Web3Provider
): Promise<{
  verified: boolean;
  status: BountyStatus;
  message: string;
}> {
  try {
    // Placeholder logic to verify token transfer
    console.log(`Verifying token transfer for bounty ${bountyId}`);
    
    // Simulate successful verification
    const isTransferVerified = true;
    
    if (isTransferVerified) {
      // Update bounty status to verified
      console.log(`Token transfer verified for bounty ${bountyId}`);
      return {
        verified: true,
        status: "active",
        message: "Token transfer verified successfully"
      };
    } else {
      // Update bounty status to failed
      console.log(`Token transfer verification failed for bounty ${bountyId}`);
      return {
        verified: false,
        status: "awaiting_tokens", // Now valid with updated type
        message: "Token transfer verification failed"
      };
    }
  } catch (error) {
    console.error("Error verifying bounty funding:", error);
    return {
      verified: false,
      status: "awaiting_tokens", // Now valid with updated type
      message: "Failed to verify token transfer"
    };
  }
}

/**
 * Deploys a bounty to the blockchain using PartyDAO's BuyCrowdfund contract
 * @param params Bounty creation parameters
 * @param wallet Wallet instance for signing transactions
 * @param targetChainId Target network chain ID
 * @returns Promise resolving to the deployed bounty details
 */
export async function deployBountyToBlockchain(
  params: BountyCreationParams,
  wallet: WalletType,
  targetChainId: number = 1 // Default to Ethereum mainnet
): Promise<{ partyAddress: string; success: boolean }> {
  try {
    // Ensure wallet is connected and on correct network
    await ensureNetwork(wallet, targetChainId);
    
    const provider = new ethers.providers.Web3Provider(wallet.provider);
    const signer = provider.getSigner();
    
    // Verify wallet has sufficient balance
    const balance = await wallet.getBalance();
    if (!balance || ethers.utils.parseEther(balance).lt(ethers.utils.parseEther(params.rewardAmount.toString()))) {
      throw new Error(`Insufficient balance in wallet for bounty creation`);
    }

    // Create the bounty first to get the ID
    const bountyId = await createBounty(params, provider);
    
    // Get network-specific contract addresses
    const addresses = getContractAddresses(targetChainId);
    
    // Connect to PartyFactory contract
    const partyFactory = new ethers.Contract(
      addresses.PartyFactory,
      PARTY_FACTORY_ABI,
      signer
    );
    
    // Resolve ENS name for creator if available
    const creatorEns = await resolveEnsName(wallet, params.creatorAddress);
    
    // Initialize BuyCrowdfund options
    const crowdfundOptions = {
      name: params.title,
      symbol: "BNTY",
      customizationPresetId: 0,
      nftContract: params.rewardTokenAddress,
      nftTokenId: ethers.BigNumber.from(bountyId),
      duration: Math.floor((new Date(params.expirationDate).getTime() - Date.now()) / 1000),
      maximumPrice: ethers.utils.parseEther(params.rewardAmount.toString()),
      splitRecipient: await signer.getAddress(),
      splitBps: 0,
      initialContributor: await signer.getAddress(),
      initialDelegate: await signer.getAddress(),
      minContribution: ethers.utils.parseEther("0.01"),
      maxContribution: ethers.utils.parseEther(params.rewardAmount.toString()),
      gateKeeper: ethers.constants.AddressZero,
      gateKeeperId: ethers.constants.HashZero,
      onlyHostCanBuy: false,
      governanceOpts: {
        hosts: [await signer.getAddress()],
        voteDuration: 3 * 24 * 60 * 60,
        executionDelay: 24 * 60 * 60,
        passThresholdBps: 5100
      }
    };

    // Deploy crowdfund contract
    const tx = await partyFactory.createBuyCrowdfund(crowdfundOptions);
    const receipt = await tx.wait();
    
    // Get party address from event logs
    const partyCreatedEvent = receipt.events?.find(e => e.event === "PartyCreated");
    const partyAddress = partyCreatedEvent?.args?.party;

    // Store ENS name if available
    if (creatorEns) {
      await updateBounty(bountyId, { 
        creatorEnsName: creatorEns 
      });
    }

    // Resolve Dynamic name service data for creator
    const creatorNameService = await resolveDynamicName(wallet);
    if (creatorNameService) {
      await updateBounty(bountyId, {
        creatorDynamicName: creatorNameService.name,
        creatorDynamicAvatar: creatorNameService.avatar
      });
    }

    return {
      partyAddress,
      success: true
    };
  } catch (error) {
    console.error("Error deploying bounty to blockchain:", error);
    throw error;
  }
}

/**
 * Updates the status of a bounty and handles governance transition
 * @param bountyId ID of the bounty
 * @param newStatus New status to set
 * @param wallet Wallet instance for signing
 * @param targetChainId Target network chain ID
 * @returns Promise resolving to success status
 */
export async function updateBountyStatus(
  bountyId: string,
  newStatus: BountyStatus,
  wallet: WalletType,
  targetChainId: number = 1
): Promise<{ success: boolean; error?: string }> {
  try {
    // Ensure correct network
    await ensureNetwork(wallet, targetChainId);
    
    const provider = new ethers.providers.Web3Provider(wallet.provider);
    const signer = provider.getSigner();
    
    const bounty = await getBounty(bountyId);
    if (!bounty) throw new Error("Bounty not found");
    
    // Get network-specific addresses
    const addresses = getContractAddresses(targetChainId);
    
    // Update local status
    await updateBounty(bountyId, { 
      completedDate: newStatus === "completed" ? new Date().toISOString() : undefined,
      pausedDate: newStatus === "paused" ? new Date().toISOString() : undefined,
      resumedDate: newStatus === "active" && bounty.pausedDate ? new Date().toISOString() : undefined
    });
    
    // If status is completed, trigger the party transition
    if (newStatus === "completed") {
      const party = new ethers.Contract(bounty.holdingContractAddress!, PARTY_ABI, signer);
      
      // Resolve ENS for bounty hunter if available
      const hunterEns = await resolveEnsName(wallet, bounty.bountyHunterAddress!);
      if (hunterEns) {
        await updateBounty(bountyId, { bountyHunterEnsName: hunterEns });
      }
      
      // Create governance transition proposal
      const proposalData = ethers.utils.defaultAbiCoder.encode(
        ["address", "uint256"],
        [bounty.bountyHunterPayoutAddress, ethers.utils.parseEther(bounty.rewardAmount.toString())]
      );
      
      const tx = await party.propose(proposalData);
      await tx.wait();
    }
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

/**
 * Adds funds to a bounty's crowdfund contract
 * @param bountyId ID of the bounty
 * @param amount Amount to fund in ETH
 * @param wallet Wallet instance for signing
 * @param targetChainId Target network chain ID
 * @returns Promise resolving to success status
 */
export async function fundBounty(
  bountyId: string,
  amount: number,
  wallet: WalletType,
  targetChainId: number = 1
): Promise<{ success: boolean; error?: string }> {
  try {
    // Ensure correct network
    await ensureNetwork(wallet, targetChainId);
    
    const provider = new ethers.providers.Web3Provider(wallet.provider);
    const signer = provider.getSigner();
    
    // Verify wallet has sufficient balance
    const balance = await wallet.getBalance();
    if (!balance || ethers.utils.parseEther(balance).lt(ethers.utils.parseEther(amount.toString()))) {
      throw new Error(`Insufficient balance in wallet for funding`);
    }
    
    const bounty = await getBounty(bountyId);
    if (!bounty) throw new Error("Bounty not found");
    
    // Get network-specific addresses
    const addresses = getContractAddresses(targetChainId);
    
    // Connect to BuyCrowdfund contract
    const crowdfund = new ethers.Contract(
      bounty.holdingContractAddress!,
      ["function contribute() external payable"],
      signer
    );
    
    // Contribute to the crowdfund
    const tx = await crowdfund.contribute({
      value: ethers.utils.parseEther(amount.toString())
    });
    await tx.wait();
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

/**
 * Distributes rewards using Party governance voting
 * @param bountyId ID of the bounty
 * @param wallet Wallet instance for signing
 * @param targetChainId Target network chain ID
 * @returns Promise resolving to success status
 */
export async function distributeRewards(
  bountyId: string,
  wallet: WalletType,
  targetChainId: number = 1
): Promise<{ success: boolean; error?: string }> {
  try {
    // Ensure correct network
    await ensureNetwork(wallet, targetChainId);
    
    const provider = new ethers.providers.Web3Provider(wallet.provider);
    const signer = provider.getSigner();
    
    const bounty = await getBounty(bountyId);
    if (!bounty) throw new Error("Bounty not found");
    
    // Get network-specific addresses
    const addresses = getContractAddresses(targetChainId);
    
    const party = new ethers.Contract(bounty.holdingContractAddress!, PARTY_ABI, signer);
    
    // Create distribution proposal
    const distributionData = ethers.utils.defaultAbiCoder.encode(
      ["address[]", "uint256[]"],
      [
        [bounty.rewardTokenAddress],
        [ethers.utils.parseEther(bounty.rewardAmount.toString())]
      ]
    );
    
    // Submit distribution proposal
    const proposeTx = await party.propose(distributionData);
    await proposeTx.wait();
    
    // Execute distribution (in real implementation, this would happen after voting period)
    const executeTx = await party.distribute(
      [bounty.rewardTokenAddress],
      [ethers.utils.parseEther(bounty.rewardAmount.toString())]
    );
    await executeTx.wait();
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}
