import { useEffect } from 'react';
import { usePartyProposal } from '../../hooks/usePartyProposal';
import { useWalletConnection } from '../../hooks/useWalletConnection';
import { ProposalStatus } from '../../types/contracts/party-protocol/IParty';

interface ProposalListProps {
  partyAddress: string;
}

export function ProposalList({ partyAddress }: ProposalListProps) {
  const { connect, address } = useWalletConnection();
  const {
    proposals,
    voteOnProposal,
    loading,
    error
  } = usePartyProposal(partyAddress);

  useEffect(() => {
    if (!address) {
      connect();
    }
  }, [address, connect]);

  const getStatusColor = (status: ProposalStatus) => {
    switch (status) {
      case ProposalStatus.Passed:
        return 'text-green-600';
      case ProposalStatus.Defeated:
        return 'text-red-600';
      case ProposalStatus.Voting:
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading proposals...</div>;
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-8">
        Error: {error.message}
      </div>
    );
  }

  if (!proposals.length) {
    return (
      <div className="text-center py-8 text-gray-600">
        No proposals found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Proposals</h2>
      <div className="space-y-4">
        {proposals.map((proposal) => (
          <div
            key={proposal.id}
            className="border rounded-lg p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  Proposal #{proposal.id}
                </h3>
                <p className="text-sm text-gray-600">
                  Proposed by: {proposal.proposer}
                </p>
              </div>
              <span className={`font-medium ${getStatusColor(proposal.status)}`}>
                {proposal.status}
              </span>
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-2">Voting Power</h4>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex justify-between text-sm">
                  <span>Total: {proposal.totalVotingPower.toString()}</span>
                  <span>
                    Votes: {proposal.votes.length}
                  </span>
                </div>
              </div>
            </div>

            {proposal.status === ProposalStatus.Voting && (
              <div className="flex space-x-2">
                <button
                  onClick={() => voteOnProposal(proposal.id, true)}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => voteOnProposal(proposal.id, false)}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 