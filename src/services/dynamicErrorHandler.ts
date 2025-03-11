
import type { DynamicContextType } from "@dynamic-labs/sdk-react-core";
import { ProposalError, ErrorCategory } from "./errorHandlingService";

interface DynamicErrorMapping {
  category: ErrorCategory;
  message: string;
  recoverySteps: string[];
}

const ERROR_MAPPINGS: Record<string, DynamicErrorMapping> = {
  INITIALIZATION_ERROR: {
    category: 'initialization',
    message: 'Wallet initialization failed',
    recoverySteps: [
      'Please wait for initialization to complete',
      'Try refreshing the page',
      'Make sure your wallet is unlocked'
    ]
  },
  WALLET_CONNECTION_ERROR: {
    category: 'wallet',
    message: 'Failed to connect wallet',
    recoverySteps: [
      'Check if your wallet is unlocked',
      'Make sure you have a supported wallet installed',
      'Try refreshing the page'
    ]
  },
  TRANSACTION_ERROR: {
    category: 'transaction',
    message: 'Transaction failed',
    recoverySteps: [
      'Check if you have enough funds',
      'Try increasing gas price',
      'Wait a few minutes and try again'
    ]
  },
  NETWORK_ERROR: {
    category: 'network',
    message: 'Network error',
    recoverySteps: [
      'Check your internet connection',
      'Make sure you are on the Polygon network',
      'Try refreshing the page'
    ]
  },
  CONTRACT_ERROR: {
    category: 'contract',
    message: 'Contract interaction failed',
    recoverySteps: [
      'Verify contract is not paused',
      'Check transaction parameters',
      'Try again with higher gas limit'
    ]
  }
};

export const handleDynamicError = (error: unknown): ProposalError => {
  console.error('Dynamic error:', error);

  // Handle initialization-specific errors
  if (error instanceof Error && error.message.includes('wallet client')) {
    return new ProposalError({
      category: 'initialization',
      message: 'Wallet initialization in progress',
      recoverySteps: [
        'Please wait for initialization to complete',
        'Try refreshing the page if this persists'
      ]
    });
  }

  // Check if it's an error with a code property
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const dynamicError = error as { code: string; message: string; stack?: string };
    const mapping = ERROR_MAPPINGS[dynamicError.code] || ERROR_MAPPINGS.TRANSACTION_ERROR;
    return new ProposalError({
      category: mapping.category,
      message: `${mapping.message}: ${dynamicError.message}`,
      recoverySteps: mapping.recoverySteps,
      technicalDetails: dynamicError.stack
    });
  }

  // Handle regular errors
  return new ProposalError({
    category: 'unknown',
    message: error instanceof Error ? error.message : 'An unknown error occurred',
    recoverySteps: [
      'Try the operation again',
      'Check your wallet connection',
      'Contact support if the issue persists'
    ],
    technicalDetails: error instanceof Error ? error.stack : undefined
  });
};
