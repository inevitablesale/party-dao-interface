import { useDynamicContext } from '@dynamic-labs/sdk-react';
import { usePartySDK } from './usePartySDK';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { PartySDKError } from './usePartySDK';

export interface DelegationInfo {
  delegatee: string;
  votingPower: ethers.BigNumber;
  delegatedPower: ethers.BigNumber;
}

export interface BatchProposal {
  type: 'text' | 'transfer' | 'custom';
  title: string;
  description: string;
  amount?: ethers.BigNumber;
  recipient?: string;
  customData?: any;
}

export interface BatchVote {
  proposalId: number;
  support: boolean;
}

export function useDynamicPartySDK() {
  const { primaryWallet, isAuthenticated, network } = useDynamicContext();
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const partySDK = usePartySDK();

  // Set up provider when wallet is connected
  useEffect(() => {
    if (isAuthenticated && primaryWallet?.connector) {
      const web3Provider = new ethers.providers.Web3Provider(
        primaryWallet.connector as any
      );
      setProvider(web3Provider);
    } else {
      setProvider(null);
    }
  }, [isAuthenticated, primaryWallet]);

  // Enhanced methods with proper error handling
  const delegate = async (partyAddress: string, delegatee: string) => {
    try {
      const party = await partySDK.contracts.party.attach(partyAddress);
      const tx = await party.delegate(delegatee);
      await tx.wait();
      return tx;
    } catch (err) {
      throw new PartySDKError('Failed to delegate', err);
    }
  };

  const getDelegationInfo = async (partyAddress: string, address: string): Promise<DelegationInfo> => {
    try {
      const party = await partySDK.contracts.party.attach(partyAddress);
      const [delegatee, votingPower, delegatedPower] = await Promise.all([
        party.delegates(address),
        party.getVotingPower(address),
        party.getDelegatedPower(address)
      ]);
      return { delegatee, votingPower, delegatedPower };
    } catch (err) {
      throw new PartySDKError('Failed to get delegation info', err);
    }
  };

  const createBatchProposals = async (partyAddress: string, proposals: BatchProposal[]) => {
    try {
      const party = await partySDK.contracts.party.attach(partyAddress);
      const tx = await party.createBatchProposals(proposals);
      const receipt = await tx.wait();
      return { tx, receipt };
    } catch (err) {
      throw new PartySDKError('Failed to create batch proposals', err);
    }
  };

  const batchVote = async (partyAddress: string, votes: BatchVote[]) => {
    try {
      const party = await partySDK.contracts.party.attach(partyAddress);
      const tx = await party.batchVote(votes);
      const receipt = await tx.wait();
      return { tx, receipt };
    } catch (err) {
      throw new PartySDKError('Failed to submit batch votes', err);
    }
  };

  return {
    ...partySDK,
    isAuthenticated,
    network,
    primaryWallet,
    provider,
    delegate,
    getDelegationInfo,
    createBatchProposals,
    batchVote
  };
} 