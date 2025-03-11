import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useDynamicPartySDK } from '../hooks/useDynamicPartySDK';

interface BatchOperationsProps {
  partyAddress: string;
  onBatchComplete?: () => void;
}

interface ProposalData {
  proposalType: 'text' | 'transfer' | 'custom';
  title: string;
  description: string;
  amount?: string;
  recipient?: string;
  customData?: string;
}

export function BatchOperations({ partyAddress, onBatchComplete }: BatchOperationsProps) {
  const {
    createBatchProposals,
    batchVote,
    loading,
    error,
    isAuthenticated,
    primaryWallet
  } = useDynamicPartySDK();

  const [proposals, setProposals] = useState<ProposalData[]>([]);
  const [newProposal, setNewProposal] = useState<ProposalData>({
    proposalType: 'text',
    title: '',
    description: ''
  });

  const addProposal = () => {
    setProposals([...proposals, newProposal]);
    setNewProposal({
      proposalType: 'text',
      title: '',
      description: ''
    });
  };

  const removeProposal = (index: number) => {
    setProposals(proposals.filter((_, i) => i !== index));
  };

  const handleSubmitBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const formattedProposals = proposals.map(prop => ({
        type: prop.proposalType,
        title: prop.title,
        description: prop.description,
        amount: prop.amount ? ethers.utils.parseEther(prop.amount) : undefined,
        recipient: prop.recipient,
        customData: prop.customData ? JSON.parse(prop.customData) : undefined
      }));

      const result = await createBatchProposals(partyAddress, formattedProposals);
      console.log('Batch proposals created:', result);

      setProposals([]);
      if (onBatchComplete) {
        onBatchComplete();
      }
    } catch (err) {
      console.error('Failed to create batch proposals:', err);
    }
  };

  const handleBatchVote = async (support: boolean) => {
    if (!isAuthenticated) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const result = await batchVote(partyAddress, proposals.map((_, index) => ({
        proposalId: index,
        support
      })));
      console.log('Batch vote submitted:', result);

      if (onBatchComplete) {
        onBatchComplete();
      }
    } catch (err) {
      console.error('Failed to submit batch vote:', err);
    }
  };

  if (!isAuthenticated) {
    return <div>Please connect your wallet to use batch operations</div>;
  }

  return (
    <div className="batch-operations">
      <h2>Batch Operations</h2>

      <div className="new-proposal">
        <h3>Add New Proposal</h3>
        <div>
          <label htmlFor="proposalType">Proposal Type</label>
          <select
            id="proposalType"
            value={newProposal.proposalType}
            onChange={(e) => setNewProposal({
              ...newProposal,
              proposalType: e.target.value as ProposalData['proposalType']
            })}
          >
            <option value="text">Text</option>
            <option value="transfer">Transfer</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={newProposal.title}
            onChange={(e) => setNewProposal({
              ...newProposal,
              title: e.target.value
            })}
            placeholder="Proposal title"
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={newProposal.description}
            onChange={(e) => setNewProposal({
              ...newProposal,
              description: e.target.value
            })}
            placeholder="Proposal description"
          />
        </div>

        {newProposal.proposalType === 'transfer' && (
          <>
            <div>
              <label htmlFor="amount">Amount (ETH)</label>
              <input
                id="amount"
                type="number"
                step="0.000000000000000001"
                value={newProposal.amount || ''}
                onChange={(e) => setNewProposal({
                  ...newProposal,
                  amount: e.target.value
                })}
                placeholder="0.0"
              />
            </div>

            <div>
              <label htmlFor="recipient">Recipient Address</label>
              <input
                id="recipient"
                value={newProposal.recipient || ''}
                onChange={(e) => setNewProposal({
                  ...newProposal,
                  recipient: e.target.value
                })}
                placeholder="0x..."
              />
            </div>
          </>
        )}

        {newProposal.proposalType === 'custom' && (
          <div>
            <label htmlFor="customData">Custom Data (JSON)</label>
            <textarea
              id="customData"
              value={newProposal.customData || ''}
              onChange={(e) => setNewProposal({
                ...newProposal,
                customData: e.target.value
              })}
              placeholder="{'key': 'value'}"
            />
          </div>
        )}

        <button type="button" onClick={addProposal}>
          Add to Batch
        </button>
      </div>

      <div className="proposals-list">
        <h3>Proposals in Batch ({proposals.length})</h3>
        {proposals.map((prop, index) => (
          <div key={index} className="proposal-item">
            <h4>{prop.title}</h4>
            <p>{prop.description}</p>
            {prop.proposalType === 'transfer' && (
              <p>Transfer {prop.amount} ETH to {prop.recipient}</p>
            )}
            <button onClick={() => removeProposal(index)}>Remove</button>
          </div>
        ))}
      </div>

      {proposals.length > 0 && (
        <div className="batch-actions">
          <button onClick={handleSubmitBatch} disabled={loading}>
            {loading ? 'Creating Proposals...' : 'Create All Proposals'}
          </button>
          <button onClick={() => handleBatchVote(true)} disabled={loading}>
            {loading ? 'Voting...' : 'Vote Yes on All'}
          </button>
          <button onClick={() => handleBatchVote(false)} disabled={loading}>
            {loading ? 'Voting...' : 'Vote No on All'}
          </button>
        </div>
      )}

      {error && (
        <div className="error">
          Error: {error.message}
          {error.reason && ` (${error.reason})`}
        </div>
      )}

      <div className="wallet-info">
        <p>Connected Wallet: {primaryWallet?.address}</p>
      </div>
    </div>
  );
} 