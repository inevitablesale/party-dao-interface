
/**
 * Price Calculator Utility for Party Protocol integration
 * Handles calculations for NFT sales with Party DAO fees and referral rewards
 */

export interface PriceBreakdown {
  grossPrice: number;      // Total price buyer pays (in ETH or MATIC)
  partyDaoFee: number;     // Fee taken by Party DAO (in ETH or MATIC)
  netAmount: number;       // Amount after DAO fee (in ETH or MATIC)
  referralAmount: number;  // Referral payment (in ETH or MATIC)
  finalRevenue: number;    // Final revenue after all fees (in ETH or MATIC)
}

/**
 * Constants for fee calculations
 */
export const PARTY_DAO_FEE_PERCENT = 0.025; // 2.5%
export const DEFAULT_REFERRAL_AMOUNT_ETH = 0.01; // 0.01 ETH (approximately $25)
export const DEFAULT_REFERRAL_AMOUNT_MATIC = 20; // 20 MATIC (approximately $20)

// Current conversion rates (in production, these would be fetched from an API)
export const ETH_USD_RATE = 2500; // 1 ETH = $2500 USD
export const MATIC_USD_RATE = 1; // 1 MATIC = $1 USD

/**
 * Currency type for price calculations
 */
export type CurrencyType = 'ETH' | 'MATIC';

/**
 * Convert amount between USD and the specified cryptocurrency
 * 
 * @param usdAmount Amount in USD
 * @param currency The target cryptocurrency (ETH or MATIC)
 * @returns Amount in the specified cryptocurrency
 */
export function usdToCrypto(usdAmount: number, currency: CurrencyType = 'ETH'): number {
  if (currency === 'ETH') {
    return usdAmount / ETH_USD_RATE;
  } else {
    return usdAmount / MATIC_USD_RATE;
  }
}

/**
 * Convert cryptocurrency amount to USD
 * 
 * @param cryptoAmount Amount in cryptocurrency
 * @param currency The source cryptocurrency (ETH or MATIC)
 * @returns Amount in USD
 */
export function cryptoToUsd(cryptoAmount: number, currency: CurrencyType = 'ETH'): number {
  if (currency === 'ETH') {
    return cryptoAmount * ETH_USD_RATE;
  } else {
    return cryptoAmount * MATIC_USD_RATE;
  }
}

/**
 * Get default referral amount for the specified currency
 * 
 * @param currency Cryptocurrency type (ETH or MATIC)
 * @returns Default referral amount in the specified currency
 */
export function getDefaultReferralAmount(currency: CurrencyType = 'ETH'): number {
  return currency === 'ETH' ? DEFAULT_REFERRAL_AMOUNT_ETH : DEFAULT_REFERRAL_AMOUNT_MATIC;
}

/**
 * Calculates price breakdown for NFT sales including Party DAO fees and referral rewards
 * 
 * @param desiredRevenue The amount you want to receive after all fees
 * @param currency Cryptocurrency type (ETH or MATIC)
 * @param referralAmount Fixed referral amount (defaults to appropriate value based on currency)
 * @param partyDaoFeePercent Party DAO fee percentage (default: 0.025 or 2.5%)
 * @returns Complete price breakdown
 */
export function calculatePriceStructure(
  desiredRevenue: number,
  currency: CurrencyType = 'ETH',
  referralAmount?: number,
  partyDaoFeePercent: number = PARTY_DAO_FEE_PERCENT
): PriceBreakdown {
  // Use provided referral amount or default based on currency
  const referralReward = referralAmount ?? getDefaultReferralAmount(currency);
  
  // Calculate gross price needed to achieve desired revenue after fees
  // Formula: (desiredRevenue + referralAmount) / (1 - partyDaoFeePercent)
  const grossPrice = (desiredRevenue + referralReward) / (1 - partyDaoFeePercent);
  
  // Calculate Party DAO fee
  const partyDaoFee = grossPrice * partyDaoFeePercent;
  
  // Net amount after Party DAO fee
  const netAmount = grossPrice - partyDaoFee;
  
  // Final revenue after referral payment
  const finalRevenue = netAmount - referralReward;
  
  return {
    grossPrice,
    partyDaoFee,
    netAmount,
    referralAmount: referralReward,
    finalRevenue
  };
}

/**
 * Format cryptocurrency amount with appropriate precision
 * 
 * @param amount Amount in cryptocurrency
 * @param currency Cryptocurrency type (ETH or MATIC)
 * @param decimals Number of decimal places (default: 4 for ETH, 2 for MATIC)
 * @returns Formatted cryptocurrency amount as string
 */
export function formatCryptoAmount(
  amount: number, 
  currency: CurrencyType = 'ETH',
  decimals?: number
): string {
  const defaultDecimals = currency === 'ETH' ? 4 : 2;
  const decimalPlaces = decimals ?? defaultDecimals;
  
  return amount.toFixed(decimalPlaces);
}

/**
 * Format ETH amount with appropriate precision (legacy function for backward compatibility)
 * 
 * @param amount Amount in ETH
 * @param decimals Number of decimal places (default: 4)
 * @returns Formatted ETH amount as string
 */
export function formatEthAmount(amount: number, decimals: number = 4): string {
  return formatCryptoAmount(amount, 'ETH', decimals);
}

/**
 * Calculate contribution breakdown for Party Protocol
 * Shows how a contribution is divided between party shares and protocol fees
 * 
 * @param contributionAmount Raw amount being contributed in cryptocurrency
 * @param currency Cryptocurrency type (ETH or MATIC)
 * @returns Detailed breakdown of contribution
 */
export function calculateContributionBreakdown(
  contributionAmount: number,
  currency: CurrencyType = 'ETH'
): {
  contributionAmount: number;
  partyDaoFee: number;
  partySharesAmount: number;
  estimatedVotingPower: number;
} {
  const partyDaoFee = contributionAmount * PARTY_DAO_FEE_PERCENT;
  const partySharesAmount = contributionAmount - partyDaoFee;
  
  // Simple estimation of voting power
  // This is a simplified model, actual voting power calculation depends on Party implementation
  // We normalize voting power based on currency value
  const votingPowerMultiplier = currency === 'ETH' ? 100 : 100 / ETH_USD_RATE * MATIC_USD_RATE;
  const estimatedVotingPower = partySharesAmount * votingPowerMultiplier;
  
  return {
    contributionAmount,
    partyDaoFee,
    partySharesAmount,
    estimatedVotingPower
  };
}

/**
 * Calculate governance voting threshold based on total contributions
 * 
 * @param totalContributions Total cryptocurrency contributed to party
 * @param thresholdPercent Percentage of total needed for proposal to pass (default: 51%)
 * @returns Voting threshold in cryptocurrency
 */
export function calculateGovernanceThreshold(
  totalContributions: number,
  thresholdPercent: number = 51
): number {
  return totalContributions * (thresholdPercent / 100);
}

/**
 * Example usage:
 * 
 * // ETH calculations
 * const priceEth = calculatePriceStructure(0.08, 'ETH');
 * console.log(`ETH Gross Price: ${formatCryptoAmount(priceEth.grossPrice, 'ETH')} ETH`);
 * 
 * // MATIC calculations
 * const priceMatic = calculatePriceStructure(80, 'MATIC');
 * console.log(`MATIC Gross Price: ${formatCryptoAmount(priceMatic.grossPrice, 'MATIC')} MATIC`);
 */
