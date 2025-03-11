import { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWalletConnection } from './useWalletConnection';
import { PARTY_GOVERNANCE_ABI, ProposalStateInfo } from '../constants/abis';
import { IProposal, ProposalStatus } from '../types/contracts/party-protocol/IParty';

interface ProposalError extends Error {
  code?: string;
  reason?: string;
}

export function usePartyProposal(partyAddress: string) {
  const { provider, address } = useWalletConnection();
  const [proposals, setProposals] = useState<IProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ProposalError | null>(null);

  const mapProposalStatus = (stateInfo: ProposalStateInfo): ProposalStatus => {
    if (stateInfo.completedAt > 0) return ProposalStatus.Complete;
    if (stateInfo.executedAt > 0) return ProposalStatus.InProgress;
    if (stateInfo.votingEnds > Date.now() / 1000) return ProposalStatus.Voting;
    if (stateInfo.totalVotes >= stateInfo.passThresholdVotes) return ProposalStatus.Passed;
    return ProposalStatus.Defeated;
  };

  useEffect(() => {
    if (!provider || !partyAddress) return;

    const loadProposals = async () => {
      try {
        setLoading(true);
        const contract = new ethers.Contract(partyAddress, PARTY_GOVERNANCE_ABI, provider);
        
        const proposalCount = await contract.getProposalCount();
        const proposals = await Promise.all(
          Array.from({ length: proposalCount.toNumber() }, async (_, id) => {
            const stateInfo = await contract.getProposalStateInfo(id);
            const proposalEvents = await contract.queryFilter(
              contract.filters.ProposalCreated(id)
            );
            
            if (proposalEvents.length === 0) {
              throw new Error(`No creation event found for proposal ${id}`);
            }

            const { proposer, votingEnds, executionDelay } = proposalEvents[0].args!;
            
            const votes = await Promise.all(
              (await contract.queryFilter(contract.filters.ProposalAccepted(id)))
                .map(async (v) => {
                  const block = await v.getBlock();
                  return {
                    voter: v.args!.voter,
                    power: v.args!.weight,
                    timestamp: block.timestamp,
                    support: true
                  };
                })
            );

            return {
              id,
              proposer,
              status: mapProposalStatus(stateInfo),
              votingEnds: votingEnds.toNumber(),
              executionDelay: executionDelay.toNumber(),
              votes,
              totalVotingPower: stateInfo.totalVotingPower
            };
          })
        );

        setProposals(proposals);
      } catch (err) {
        const error: ProposalError = err instanceof Error ? err : new Error('Failed to load proposals');
        if (err.reason) error.reason = err.reason;
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    loadProposals();
  }, [provider, partyAddress]);

  const createProposal = useCallback(async (proposalData: string) => {
    if (!provider) throw new Error('Provider not available');
    setLoading(true);
    setError(null);

    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(partyAddress, PARTY_GOVERNANCE_ABI, signer);

      const tx = await contract.propose(proposalData);
      const receipt = await tx.wait();

      const event = receipt.events?.find(e => e.event === 'ProposalCreated');
      if (!event) throw new Error('Proposal creation failed');

      return event.args?.proposalId;
    } catch (err) {
      const error: ProposalError = err instanceof Error ? err : new Error('Failed to create proposal');
      if (err.reason) error.reason = err.reason;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [provider, partyAddress]);

  const voteOnProposal = useCallback(async (proposalId: number, support: boolean) => {
    if (!provider) throw new Error('Provider not available');
    setLoading(true);
    setError(null);

    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(partyAddress, PARTY_GOVERNANCE_ABI, signer);

      const method = support ? 'accept' : 'reject';
      const tx = await contract[method](proposalId);
      await tx.wait();

      // Update local state
      const votingPower = await contract.getVotingPowerAt(
        await signer.getAddress(),
        Math.floor(Date.now() / 1000)
      );

      const voterAddress = await signer.getAddress();
      setProposals(prev =>
        prev.map(p =>
          p.id === proposalId
            ? {
                ...p,
                votes: [
                  ...p.votes,
                  {
                    voter: voterAddress,
                    power: votingPower,
                    timestamp: Math.floor(Date.now() / 1000),
                    support
                  }
                ]
              }
            : p
        )
      );
    } catch (err) {
      const error: ProposalError = err instanceof Error ? err : new Error('Failed to vote on proposal');
      if (err.reason) error.reason = err.reason;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [provider, partyAddress]);

  const executeProposal = useCallback(async (
    proposalId: number,
    proposalData: string,
    flags: number = 0
  ) => {
    if (!provider) throw new Error('Provider not available');
    setLoading(true);
    setError(null);

    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(partyAddress, PARTY_GOVERNANCE_ABI, signer);

      const tx = await contract.execute(proposalId, proposalData, flags);
      await tx.wait();

      // Update local state
      setProposals(prev =>
        prev.map(p =>
          p.id === proposalId
            ? { ...p, status: ProposalStatus.InProgress }
            : p
        )
      );
    } catch (err) {
      const error: ProposalError = err instanceof Error ? err : new Error('Failed to execute proposal');
      if (err.reason) error.reason = err.reason;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [provider, partyAddress]);

  return {
    proposals,
    createProposal,
    voteOnProposal,
    executeProposal,
    loading,
    error
  };
} 