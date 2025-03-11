
import { ethers } from "ethers";
import { ContractStatus } from "./proposalContractService";
import { ProposalMetadata } from "@/types/proposals";

export interface ValidationConfig {
  maxPaymentTerms: number;
  maxStrategiesPerCategory: number;
  maxSummaryLength: number;
  minTitleLength: number;
  maxTitleLength: number;
  minDriversLength: number;
  maxDriversLength: number;
  maxAdditionalCriteriaLength: number;
  targetCapitalMin: ethers.BigNumber;
  targetCapitalMax: ethers.BigNumber;
  minLinkedInURLLength: number;
  maxLinkedInURLLength: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

const DEFAULT_CONFIG: ValidationConfig = {
  maxPaymentTerms: 5,
  maxStrategiesPerCategory: 3,
  maxSummaryLength: 500,
  minTitleLength: 10,
  maxTitleLength: 100,
  minDriversLength: 50,
  maxDriversLength: 500,
  maxAdditionalCriteriaLength: 500,
  targetCapitalMin: ethers.utils.parseEther("1000"),
  targetCapitalMax: ethers.utils.parseEther("25000000"),
  minLinkedInURLLength: 1,
  maxLinkedInURLLength: 200
};

export const validateProposalMetadata = (
  metadata: ProposalMetadata,
  config: ValidationConfig = DEFAULT_CONFIG
): ValidationResult => {
  const errors: Record<string, string[]> = {};

  // Title validation
  if (!metadata.title) {
    errors.title = ['Title is required'];
  } else if (metadata.title.length < config.minTitleLength || metadata.title.length > config.maxTitleLength) {
    errors.title = [`Title must be between ${config.minTitleLength} and ${config.maxTitleLength} characters`];
  }

  // Target Capital validation
  if (!metadata.investment.targetCapital) {
    errors['investment.targetCapital'] = ['Target capital amount is required'];
  } else {
    try {
      const targetCapitalWei = ethers.utils.parseEther(metadata.investment.targetCapital);
      if (targetCapitalWei.lt(config.targetCapitalMin)) {
        errors['investment.targetCapital'] = [`Minimum target capital is ${ethers.utils.formatEther(config.targetCapitalMin)} ETH`];
      }
      if (targetCapitalWei.gt(config.targetCapitalMax)) {
        errors['investment.targetCapital'] = [`Maximum target capital is ${ethers.utils.formatEther(config.targetCapitalMax)} ETH`];
      }
    } catch (error) {
      errors['investment.targetCapital'] = ['Invalid target capital amount'];
    }
  }

  // Investment Drivers validation
  if (!metadata.investment.drivers) {
    errors['investment.drivers'] = ['Investment drivers are required'];
  } else if (metadata.investment.drivers.length < config.minDriversLength || 
             metadata.investment.drivers.length > config.maxDriversLength) {
    errors['investment.drivers'] = [`Investment drivers must be between ${config.minDriversLength} and ${config.maxDriversLength} characters`];
  }

  // Additional Criteria validation
  if (metadata.investment.additionalCriteria && 
      metadata.investment.additionalCriteria.length > config.maxAdditionalCriteriaLength) {
    errors['investment.additionalCriteria'] = [`Maximum length is ${config.maxAdditionalCriteriaLength} characters`];
  }

  // LinkedIn URL validation
  if (!metadata.linkedInURL) {
    errors.linkedInURL = ['LinkedIn URL is required'];
  } else if (metadata.linkedInURL.length < config.minLinkedInURLLength || 
             metadata.linkedInURL.length > config.maxLinkedInURLLength) {
    errors.linkedInURL = [`LinkedIn URL must be between ${config.minLinkedInURLLength} and ${config.maxLinkedInURLLength} characters`];
  }

  // Payment Terms validation
  if (!Array.isArray(metadata.paymentTerms) || metadata.paymentTerms.length === 0) {
    errors.paymentTerms = ['Please select at least one payment term'];
  } else if (metadata.paymentTerms.length > config.maxPaymentTerms) {
    errors.paymentTerms = [`Maximum ${config.maxPaymentTerms} payment terms allowed`];
  }

  // Strategies validation
  const validateStrategyCategory = (
    category: keyof typeof metadata.strategies,
    strategies: any[]
  ) => {
    if (!Array.isArray(strategies) || strategies.length === 0) {
      errors[`strategies.${category}`] = [`Please select at least one ${category} strategy`];
    } else if (strategies.length > config.maxStrategiesPerCategory) {
      errors[`strategies.${category}`] = [
        `Maximum ${config.maxStrategiesPerCategory} strategies allowed`
      ];
    }
  };

  validateStrategyCategory('operational', metadata.strategies.operational);
  validateStrategyCategory('growth', metadata.strategies.growth);
  validateStrategyCategory('integration', metadata.strategies.integration);

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateIPFSHash = (hash: string): boolean => {
  // IPFS hash validation (for CIDv0 and CIDv1)
  const cidv0Regex = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;
  const cidv1Regex = /^b[A-Za-z2-7]{58}$/;
  
  return cidv0Regex.test(hash) || cidv1Regex.test(hash);
};

export const validateContractParameters = (
  config: { targetCapital: ethers.BigNumber; votingDuration: number },
  status: ContractStatus
): ValidationResult => {
  const errors: Record<string, string[]> = {};

  if (!config.targetCapital) {
    errors.targetCapital = ['Target capital is required'];
  } else {
    if (config.targetCapital.lt(status.minTargetCapital)) {
      errors.targetCapital = [`Target capital must be at least ${ethers.utils.formatEther(status.minTargetCapital)} ETH`];
    }
    if (config.targetCapital.gt(status.maxTargetCapital)) {
      errors.targetCapital = [`Target capital must not exceed ${ethers.utils.formatEther(status.maxTargetCapital)} ETH`];
    }
  }

  if (!config.votingDuration) {
    errors.votingDuration = ['Voting duration is required'];
  } else {
    if (config.votingDuration < status.minVotingDuration) {
      errors.votingDuration = [`Voting duration must be at least ${status.minVotingDuration / (24 * 3600)} days`];
    }
    if (config.votingDuration > status.maxVotingDuration) {
      errors.votingDuration = [`Voting duration must not exceed ${status.maxVotingDuration / (24 * 3600)} days`];
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

