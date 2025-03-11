import React, { useEffect, useState } from 'react';
import { usePartySDK } from '../hooks/usePartySDK';
import { Proposal, ProposalStatus } from '../types/party-protocol';

interface ProposalManagerProps {
  partyAddress: string;
  onProposalCreated?: (proposalId: number) => void;
}

export function ProposalManager({ partyAddress, onProposalCreated }: ProposalManagerProps) {
  const {
    createProposal,
    getProposals,
    vote,
    loading,
    error
  } = usePartySDK({
    onProposalCreated: (proposalId, proposer) => {
      console.log(`New proposal ${proposalId} created by ${proposer}`);
      onProposalCreated?.(proposalId);
    }
  });

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [newProposalData, setNewProposalData] = useState('');

  // Load existing proposals
  useEffect(() => {
    const loadProposals = async () => {
      try {
        const fetchedProposals = await getProposals(partyAddress);
        setProposals(fetchedProposals);
      } catch (err) {
        console.error('Failed to load proposals:', err);
      }
    };

    loadProposals();
  }, [partyAddress, getProposals]);

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProposal(partyAddress, {
        proposalData: newProposalData
      });
      setNewProposalData('');
    } catch (err) {
      console.error('Failed to create proposal:', err);
    }
  };

  const handleVote = async (proposalId: number, support: boolean) => {
    try {
      await vote(partyAddress, proposalId, support);
    } catch (err) {
      console.error('Failed to vote:', err);
    }
  };

  return (
    <div>
      <h2>Proposals</h2>
      
      {/* Create new proposal */}
      <form onSubmit={handleCreateProposal}>
        <textarea
          value={newProposalData}
          onChange={(e) => setNewProposalData(e.target.value)}
          placeholder="Enter proposal data..."
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Proposal'}
        </button>
      </form>

      {error && (
        <div style={{ color: 'red' }}>
          Error: {error.message}
          {error.reason && ` (${error.reason})`}
        </div>
      )}

      {/* List proposals */}
      <div>
        {proposals.map((proposal) => (
          <div key={proposal.id}>
            <h3>Proposal #{proposal.id}</h3>
            <p>Status: {proposal.status}</p>
            <p>Proposer: {proposal.proposer}</p>
            <p>Votes For: {proposal.votesFor.toString()}</p>
            <p>Votes Against: {proposal.votesAgainst.toString()}</p>
            
            {proposal.status === ProposalStatus.Active && (
              <div>
                <button onClick={() => handleVote(proposal.id, true)}>
                  Vote For
                </button>
                <button onClick={() => handleVote(proposal.id, false)}>
                  Vote Against
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 