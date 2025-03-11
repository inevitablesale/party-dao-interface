import { useCallback, useMemo, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  Party,
  PartyFactory,
  CrowdfundFactory,
  TokenDistributor,
  ProposalExecutionEngine,
  Globals,
  PartyGovernance,
  CrowdfundGatekeeper
} from '@partydao/party-protocol';
import { useWalletConnection } from './useWalletConnection';
import {
  CreatePartyParams,
  CreateCrowdfundParams,
  Proposal,
  PartyInfo,
  Distribution,
  VotingPowerSnapshot
} from '../types/party-protocol';

export interface PartySDKError extends Error {
  code?: string;
  reason?: string;
  transaction?: any;
  context?: string;
}

interface PartyEvents {
  onProposalCreated?: (proposalId: number, proposer: string) => void;
  onVoteCast?: (proposalId: number, voter: string, support: boolean, weight: BigNumber) => void;
  onDistribution?: (distributionId: number, amount: BigNumber) => void;
  onPartyCreated?: (partyAddress: string, creator: string) => void;
}

export function usePartySDK(events?: PartyEvents) {
  const { provider, chainId } = useWalletConnection();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PartySDKError | null>(null);

  // Contract initialization with error handling
  const contracts = useMemo(() => {
    if (!provider) return null;
    try {
      const signer = provider.getSigner();
      return {
        party: new Party(signer),
        partyFactory: new PartyFactory(signer),
        crowdfundFactory: new CrowdfundFactory(signer),
        tokenDistributor: new TokenDistributor(signer),
        proposalEngine: new ProposalExecutionEngine(signer),
        globals: new Globals(signer),
        governance: new PartyGovernance(signer),
        gatekeeper: new CrowdfundGatekeeper(signer)
      };
    } catch (err: any) {
      setError({
        ...new Error('Failed to initialize contracts'),
        reason: err.reason,
        context: 'initialization'
      });
      return null;
    }
  }, [provider]);

  // Event listeners setup
  useEffect(() => {
    if (!contracts || !events) return;

    const partyFactory = contracts.partyFactory;
    const filters = {
      ProposalCreated: partyFactory.filters.ProposalCreated(),
      VoteCast: partyFactory.filters.VoteCast(),
      Distribution: contracts.tokenDistributor.filters.Distribution(),
      PartyCreated: partyFactory.filters.PartyCreated()
    };

    if (events.onProposalCreated) {
      partyFactory.on(filters.ProposalCreated, events.onProposalCreated);
    }
    if (events.onVoteCast) {
      partyFactory.on(filters.VoteCast, events.onVoteCast);
    }
    if (events.onDistribution) {
      contracts.tokenDistributor.on(filters.Distribution, events.onDistribution);
    }
    if (events.onPartyCreated) {
      partyFactory.on(filters.PartyCreated, events.onPartyCreated);
    }

    return () => {
      partyFactory.removeAllListeners();
      contracts.tokenDistributor.removeAllListeners();
    };
  }, [contracts, events]);

  // Party Creation and Management
  const createParty = useCallback(async (params) => {
    if (!contracts) throw new Error('Contracts not initialized');
    setLoading(true);
    try {
      const tx = await contracts.partyFactory.createParty(params);
      const receipt = await tx.wait();
      return receipt;
    } catch (err: any) {
      const error: PartySDKError = new Error(err.reason || 'Failed to create party');
      error.code = err.code;
      error.reason = err.reason;
      error.transaction = err.transaction;
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contracts]);

  // Crowdfunding
  const createCrowdfund = useCallback(async (params) => {
    if (!contracts) throw new Error('Contracts not initialized');
    setLoading(true);
    try {
      const tx = await contracts.crowdfundFactory.createCrowdfund(params);
      const receipt = await tx.wait();
      return receipt;
    } catch (err: any) {
      const error: PartySDKError = new Error(err.reason || 'Failed to create crowdfund');
      error.code = err.code;
      error.reason = err.reason;
      error.transaction = err.transaction;
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contracts]);

  // Governance
  const createProposal = useCallback(async (
    partyAddress: string,
    proposal: any
  ) => {
    if (!contracts) throw new Error('Contracts not initialized');
    setLoading(true);
    try {
      const party = await contracts.party.attach(partyAddress);
      const tx = await party.propose(proposal);
      const receipt = await tx.wait();
      return receipt;
    } catch (err: any) {
      const error: PartySDKError = new Error(err.reason || 'Failed to create proposal');
      error.code = err.code;
      error.reason = err.reason;
      error.transaction = err.transaction;
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contracts]);

  const vote = useCallback(async (
    partyAddress: string,
    proposalId: number,
    support: boolean
  ) => {
    if (!contracts) throw new Error('Contracts not initialized');
    setLoading(true);
    try {
      const party = await contracts.party.attach(partyAddress);
      const tx = await party.vote(proposalId, support);
      const receipt = await tx.wait();
      return receipt;
    } catch (err: any) {
      const error: PartySDKError = new Error(err.reason || 'Failed to vote');
      error.code = err.code;
      error.reason = err.reason;
      error.transaction = err.transaction;
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contracts]);

  // Distribution
  const distribute = useCallback(async (
    partyAddress: string,
    tokenId: string,
    amount: ethers.BigNumber
  ) => {
    if (!contracts) throw new Error('Contracts not initialized');
    setLoading(true);
    try {
      const tx = await contracts.tokenDistributor.distribute(
        partyAddress,
        tokenId,
        amount
      );
      const receipt = await tx.wait();
      return receipt;
    } catch (err: any) {
      const error: PartySDKError = new Error(err.reason || 'Failed to distribute');
      error.code = err.code;
      error.reason = err.reason;
      error.transaction = err.transaction;
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contracts]);

  // Queries
  const getParty = useCallback(async (partyAddress: string) => {
    if (!contracts) throw new Error('Contracts not initialized');
    return await contracts.party.attach(partyAddress);
  }, [contracts]);

  const getProposals = useCallback(async (partyAddress: string) => {
    if (!contracts) throw new Error('Contracts not initialized');
    const party = await contracts.party.attach(partyAddress);
    return await party.getProposals();
  }, [contracts]);

  const getVotingPower = useCallback(async (
    partyAddress: string,
    voter: string
  ) => {
    if (!contracts) throw new Error('Contracts not initialized');
    const party = await contracts.party.attach(partyAddress);
    return await party.getVotingPower(voter);
  }, [contracts]);

  // New batch operations
  const batchCreateProposals = useCallback(async (
    partyAddress: string,
    proposals: Omit<Proposal, 'id' | 'status' | 'votesFor' | 'votesAgainst' | 'createdAt' | 'executedAt'>[]
  ) => {
    if (!contracts) throw new Error('Contracts not initialized');
    setLoading(true);
    try {
      const party = await contracts.party.attach(partyAddress);
      const txs = await Promise.all(
        proposals.map(proposal => party.propose(proposal.proposalData))
      );
      const receipts = await Promise.all(txs.map(tx => tx.wait()));
      return receipts;
    } catch (err: any) {
      const error: PartySDKError = new Error(err.reason || 'Failed to batch create proposals');
      error.code = err.code;
      error.reason = err.reason;
      error.transaction = err.transaction;
      error.context = 'batchCreateProposals';
      throw error;
    } finally {
      setLoading(false);
    }
  }, [contracts]);

  // Advanced queries
  const getPartyHistory = useCallback(async (
    partyAddress: string,
    fromBlock: number = 0
  ) => {
    if (!contracts || !provider) throw new Error('Contracts not initialized');
    try {
      const party = await contracts.party.attach(partyAddress);
      const events = await party.queryFilter(party.filters.PartyCreated(), fromBlock);
      return events.map(event => ({
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
        args: event.args
      }));
    } catch (err: any) {
      const error: PartySDKError = new Error(err.reason || 'Failed to get party history');
      error.code = err.code;
      error.reason = err.reason;
      error.context = 'getPartyHistory';
      throw error;
    }
  }, [contracts, provider]);

  return {
    contracts,
    createParty,
    createCrowdfund,
    createProposal,
    vote,
    distribute,
    getParty,
    getProposals,
    getVotingPower,
    // New functions
    batchCreateProposals,
    getPartyHistory,
    // State
    loading,
    error
  };
} 