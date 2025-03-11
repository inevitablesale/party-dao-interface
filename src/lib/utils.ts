import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ethers } from "ethers";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRDAmount(amount: string | number | ethers.BigNumber): string {
  if (!amount) return "0 RD";
  
  try {
    if (typeof amount === 'string' && amount.includes('.')) {
      return `${amount} RD`;
    }
    
    const formattedAmount = ethers.utils.formatEther(
      typeof amount === 'string' || typeof amount === 'number' 
        ? ethers.utils.parseEther(amount.toString())
        : amount
    );
    
    return `${formattedAmount} RD`;
  } catch (error) {
    console.error('Error formatting RD amount:', error);
    return `${amount} RD`;
  }
}

/**
 * Truncates an Ethereum address to a more readable format
 * @param address The full Ethereum address
 * @param startChars Number of characters to show at the start (default: 6)
 * @param endChars Number of characters to show at the end (default: 4)
 * @returns The truncated address string
 */
export function truncateAddress(address: string, startChars: number = 6, endChars: number = 4): string {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Shortens an Ethereum address for display purposes
 * @param address The full Ethereum address to shorten
 * @param chars Number of characters to keep at each end (default: 4)
 * @returns Shortened address in the format 0x1234...5678
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  
  if (!address.startsWith('0x') || address.length !== 42) {
    return address;
  }
  
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
}

/**
 * Generates a verification status message based on token transfer status
 * @param status The current status of token transfer
 * @returns A user-friendly status message
 */
export function getTokenTransferStatusMessage(status: TokenTransferStatus): string {
  switch(status) {
    case 'awaiting_tokens':
      return 'Waiting for token transfer...';
    case 'verifying':
      return 'Verifying token transfer...';
    case 'completed':
      return 'Token transfer verified!';
    case 'failed':
      return 'Token transfer failed. Please try again.';
    case 'not_started':
    default:
      return 'Ready to receive tokens';
  }
}

/**
 * Calculates the percentage of tokens transferred compared to expected
 * @param currentAmount Current amount of tokens transferred
 * @param targetAmount Target amount of tokens to transfer
 * @returns Percentage as a number between 0-100
 */
export function getTokenTransferProgress(currentAmount: number, targetAmount: number): number {
  if (targetAmount <= 0) return 0;
  const percentage = (currentAmount / targetAmount) * 100;
  return Math.min(Math.max(percentage, 0), 100);
}

// Token transfer status types
export type TokenTransferStatus = 'not_started' | 'awaiting_tokens' | 'verifying' | 'completed' | 'failed';

/**
 * Get security level description for holding contract
 * @param securityLevel The security level of the holding contract
 * @returns A user-friendly description of the security features
 */
export function getSecurityLevelDescription(securityLevel: "basic" | "multisig" | "timelock"): string {
  switch(securityLevel) {
    case 'basic':
      return 'Basic security with single-signature control';
    case 'multisig':
      return 'Multi-signature security requiring multiple approvals for withdrawals';
    case 'timelock':
      return 'Time-locked security with delays on withdrawals for extra protection';
    default:
      return 'Standard security features';
  }
}

/**
 * Format contract creation timestamp
 * @param timestamp Unix timestamp in seconds
 * @returns Formatted date string
 */
export function formatContractCreationTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
}

/**
 * Check if an address is a valid contract
 * @param provider Ethereum provider
 * @param address Contract address to check
 * @returns Promise resolving to boolean indicating if the address is a contract
 */
export async function isContract(provider: ethers.providers.Provider, address: string): Promise<boolean> {
  try {
    const code = await provider.getCode(address);
    return code !== '0x';
  } catch (error) {
    console.error("Error checking if address is a contract:", error);
    return false;
  }
}

/**
 * Detect wallet type based on provider and wallet features
 * @param provider Ethereum provider
 * @param walletInfo Additional wallet information
 * @returns Detected wallet type and capabilities
 */
export type WalletType = 
  | 'regular'           // Standard EOA wallet like MetaMask
  | 'smart_wallet'      // Smart contract wallet like Safe, ZeroDev
  | 'hardware_wallet'   // Hardware wallet like Ledger, Trezor
  | 'multisig'          // Multi-signature wallet
  | 'social'            // Social login wallet (email, OAuth)
  | 'mobile'            // Mobile wallet like Rainbow, Trust
  | 'unknown';          // Unknown wallet type

export interface WalletCapabilities {
  supportsBatchTransactions: boolean;   // Can execute multiple transactions in one
  supportsGasless: boolean;             // Supports gasless/sponsored transactions
  requiresExternalSignature: boolean;   // Requires external device to sign
  isContractWallet: boolean;            // Is a smart contract wallet
  supportsEIP1559: boolean;             // Supports EIP-1559 gas model
  supportsEIP4337: boolean;             // Supports account abstraction
}

/**
 * Detect wallet capabilities based on provider and connector information
 * @param provider Ethereum provider
 * @param walletInfo Additional wallet information (connector name, etc)
 * @returns Object with wallet type and capabilities
 */
export async function detectWalletFeatures(
  provider: ethers.providers.Provider,
  walletInfo?: {
    connectorName?: string;
    address?: string;
    isWalletConnect?: boolean;
  }
): Promise<{
  type: WalletType;
  capabilities: WalletCapabilities;
}> {
  // Default capabilities
  const capabilities: WalletCapabilities = {
    supportsBatchTransactions: false,
    supportsGasless: false,
    requiresExternalSignature: false,
    isContractWallet: false,
    supportsEIP1559: true, // Most modern wallets support this
    supportsEIP4337: false,
  };

  // Default type
  let type: WalletType = 'unknown';

  try {
    // Check connector name for initial classification
    const connectorName = walletInfo?.connectorName?.toLowerCase() || '';
    const address = walletInfo?.address || '';
    
    // Smart wallet detection
    if (connectorName.includes('zerodev') || 
        connectorName.includes('safe') || 
        connectorName.includes('ambire')) {
      type = 'smart_wallet';
      capabilities.supportsBatchTransactions = true;
      capabilities.supportsGasless = true;
      capabilities.isContractWallet = true;
      capabilities.supportsEIP4337 = connectorName.includes('zerodev');
    }
    // Hardware wallet detection
    else if (connectorName.includes('ledger') || 
             connectorName.includes('trezor') || 
             connectorName.includes('lattice')) {
      type = 'hardware_wallet';
      capabilities.requiresExternalSignature = true;
    }
    // Multisig detection
    else if (connectorName.includes('gnosis') || 
             connectorName.includes('multisig')) {
      type = 'multisig';
      capabilities.isContractWallet = true;
      capabilities.supportsBatchTransactions = true;
    }
    // Social login detection
    else if (connectorName.includes('social') || 
             connectorName.includes('magic') || 
             connectorName.includes('web3auth')) {
      type = 'social';
    }
    // Mobile wallet detection
    else if (connectorName.includes('walletconnect') || 
             walletInfo?.isWalletConnect ||
             connectorName.includes('rainbow') || 
             connectorName.includes('trust')) {
      type = 'mobile';
    }
    // Regular EOA wallet (default for MetaMask, etc)
    else if (connectorName.includes('injected') || 
             connectorName.includes('metamask') || 
             connectorName.includes('coinbase')) {
      type = 'regular';
    }

    // If we have an address and provider, check if it's a contract
    if (address && provider) {
      try {
        const code = await provider.getCode(address);
        if (code !== '0x') {
          capabilities.isContractWallet = true;
          if (type === 'unknown' || type === 'regular') {
            type = 'smart_wallet';
          }
        }
      } catch (error) {
        console.warn('Error checking if address is a contract:', error);
      }
    }

    return { type, capabilities };
  } catch (error) {
    console.error('Error detecting wallet features:', error);
    return { 
      type: 'unknown', 
      capabilities 
    };
  }
}
