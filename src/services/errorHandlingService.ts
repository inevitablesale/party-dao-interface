
export type ErrorCategory = 
  | 'wallet'
  | 'contract'
  | 'network'
  | 'validation'
  | 'transaction'
  | 'token'
  | 'initialization'  // Added this category
  | 'unknown';

export interface ErrorDetails {
  category: ErrorCategory;
  message: string;
  recoverySteps?: string[];
  technicalDetails?: string;
}

export class ProposalError extends Error {
  public readonly category: ErrorCategory;
  public readonly recoverySteps?: string[];
  public readonly technicalDetails?: string;

  constructor(details: ErrorDetails) {
    super(details.message);
    this.category = details.category;
    this.recoverySteps = details.recoverySteps;
    this.technicalDetails = details.technicalDetails;
    this.name = 'ProposalError';
  }
}

export const categorizeError = (error: any): ErrorDetails => {
  console.log('Categorizing error:', error);

  // Wallet errors
  if (
    error.code === 4001 || // User rejected
    error.message?.includes('User denied') ||
    error.message?.includes('User rejected')
  ) {
    return {
      category: 'wallet',
      message: 'Transaction was rejected by the wallet',
      recoverySteps: [
        'Try submitting the transaction again',
        'Make sure you have enough funds',
        'Check if your wallet is properly connected'
      ]
    };
  }

  // Network errors
  if (
    error.message?.includes('network') ||
    error.message?.includes('connection') ||
    error.code === 'NETWORK_ERROR'
  ) {
    return {
      category: 'network',
      message: 'Network connection issue detected',
      recoverySteps: [
        'Check your internet connection',
        'Verify you are connected to the correct network',
        'Try again in a few minutes'
      ]
    };
  }

  // Contract errors
  if (
    error.message?.includes('execution reverted') ||
    error.message?.includes('out of gas')
  ) {
    return {
      category: 'contract',
      message: 'Contract execution failed',
      recoverySteps: [
        'Verify you have enough ETH for gas',
        'Check if the contract is paused',
        'Verify your input parameters'
      ],
      technicalDetails: error.message
    };
  }

  // Validation errors
  if (error.message?.includes('validation')) {
    return {
      category: 'validation',
      message: 'Invalid input parameters',
      recoverySteps: [
        'Review your input values',
        'Make sure all required fields are filled',
        'Check for any formatting issues'
      ]
    };
  }

  // Transaction errors
  if (
    error.message?.includes('transaction') ||
    error.message?.includes('timeout')
  ) {
    return {
      category: 'transaction',
      message: 'Transaction processing failed',
      recoverySteps: [
        'Check transaction status in your wallet',
        'Wait a few minutes and try again',
        'Verify the transaction details'
      ]
    };
  }

  // Token errors
  if (error.message?.includes('allowance') || error.message?.includes('balance')) {
    return {
      category: 'token',
      message: 'Token operation failed',
      recoverySteps: [
        'Check your token balance',
        'Verify token approval status',
        'Try the transaction again'
      ]
    };
  }

  // Default unknown error
  return {
    category: 'unknown',
    message: error.message || 'An unexpected error occurred',
    recoverySteps: [
      'Try the operation again',
      'Check your wallet connection',
      'Contact support if the issue persists'
    ],
    technicalDetails: error.message
  };
};

export const handleError = (error: any): ErrorDetails => {
  const errorDetails = categorizeError(error);
  console.error(`[${errorDetails.category}] ${errorDetails.message}`, {
    technicalDetails: errorDetails.technicalDetails,
    recoverySteps: errorDetails.recoverySteps
  });
  return errorDetails;
};
