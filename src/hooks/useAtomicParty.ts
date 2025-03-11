import { useCallback, useState } from 'react';
import { ethers } from 'ethers';
import { useWalletConnection } from './useWalletConnection';

const ATOMIC_PARTY_ABI = [
  'function propose(bytes calldata proposalData) external returns (uint256)',
  'function execute(uint256 proposalId, bytes calldata proposalData, bytes calldata progressData) external payable returns (bytes memory)',
  'function veto(uint256 proposalId) external',
  'event ProposalCreated(uint256 indexed proposalId, address indexed proposer, bytes proposalData)',
  'event ProposalExecuted(uint256 indexed proposalId, address indexed executor, bytes progressData)',
  'event ProposalVetoed(uint256 indexed proposalId, address indexed vetoer)'
];

interface AtomicPartyError extends Error {
  code?: string;
  reason?: string;
  transaction?: any;
}

export function useAtomicParty(partyAddress: string) {
  const { provider } = useWalletConnection();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AtomicPartyError | null>(null);

  const propose = useCallback(async (proposalData: string) => {
    if (!provider) throw new Error('Provider not available');
    if (!ethers.utils.isAddress(partyAddress)) throw new Error('Invalid party address');
    
    setLoading(true);
    setError(null);

    try {
      const signer = provider.getSigner();
      const party = new ethers.Contract(partyAddress, ATOMIC_PARTY_ABI, signer);

      const tx = await party.propose(proposalData);
      const receipt = await tx.wait();

      const event = receipt.events?.find(e => e.event === 'ProposalCreated');
      if (!event) throw new Error('Proposal creation event not found');

      return event.args.proposalId;
    } catch (err: any) {
      const error: AtomicPartyError = new Error(err.reason || 'Failed to create proposal');
      error.code = err.code;
      error.reason = err.reason;
      error.transaction = err.transaction;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [provider, partyAddress]);

  const execute = useCallback(async (
    proposalId: ethers.BigNumber,
    proposalData: string,
    progressData: string,
    value: ethers.BigNumber = ethers.constants.Zero
  ) => {
    if (!provider) throw new Error('Provider not available');
    if (!ethers.utils.isAddress(partyAddress)) throw new Error('Invalid party address');
    
    setLoading(true);
    setError(null);

    try {
      const signer = provider.getSigner();
      const party = new ethers.Contract(partyAddress, ATOMIC_PARTY_ABI, signer);

      const tx = await party.execute(proposalId, proposalData, progressData, { value });
      const receipt = await tx.wait();

      const event = receipt.events?.find(e => e.event === 'ProposalExecuted');
      if (!event) throw new Error('Proposal execution event not found');

      return event.args.progressData;
    } catch (err: any) {
      const error: AtomicPartyError = new Error(err.reason || 'Failed to execute proposal');
      error.code = err.code;
      error.reason = err.reason;
      error.transaction = err.transaction;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [provider, partyAddress]);

  const veto = useCallback(async (proposalId: ethers.BigNumber) => {
    if (!provider) throw new Error('Provider not available');
    if (!ethers.utils.isAddress(partyAddress)) throw new Error('Invalid party address');
    
    setLoading(true);
    setError(null);

    try {
      const signer = provider.getSigner();
      const party = new ethers.Contract(partyAddress, ATOMIC_PARTY_ABI, signer);

      const tx = await party.veto(proposalId);
      const receipt = await tx.wait();

      const event = receipt.events?.find(e => e.event === 'ProposalVetoed');
      if (!event) throw new Error('Proposal veto event not found');

      return true;
    } catch (err: any) {
      const error: AtomicPartyError = new Error(err.reason || 'Failed to veto proposal');
      error.code = err.code;
      error.reason = err.reason;
      error.transaction = err.transaction;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [provider, partyAddress]);

  return {
    propose,
    execute,
    veto,
    loading,
    error
  };
} 