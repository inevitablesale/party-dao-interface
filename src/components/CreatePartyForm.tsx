import React, { useState } from 'react';
import { ethers } from 'ethers';
import { usePartyProtocol } from '../hooks/usePartyProtocol';

export function CreatePartyForm() {
  const { createParty } = usePartyProtocol();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      
      const result = await createParty({
        name: formData.get('name') as string,
        symbol: formData.get('symbol') as string,
        governanceOpts: {
          hosts: [formData.get('host') as string],
          voteDuration: parseInt(formData.get('voteDuration') as string),
          executionDelay: parseInt(formData.get('executionDelay') as string),
          passThresholdBps: parseInt(formData.get('passThresholdBps') as string),
        },
        proposalEngine: formData.get('proposalEngine') as string,
        distributor: formData.get('distributor') as string,
        votingToken: formData.get('votingToken') as string,
        feeBps: parseInt(formData.get('feeBps') as string),
        feeRecipient: formData.get('feeRecipient') as string
      });

      console.log('Party created:', result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create party'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name">Party Name</label>
        <input type="text" id="name" name="name" required />
      </div>

      <div>
        <label htmlFor="symbol">Symbol</label>
        <input type="text" id="symbol" name="symbol" required />
      </div>

      <div>
        <label htmlFor="host">Host Address</label>
        <input type="text" id="host" name="host" required />
      </div>

      <div>
        <label htmlFor="voteDuration">Vote Duration (in seconds)</label>
        <input type="number" id="voteDuration" name="voteDuration" required />
      </div>

      <div>
        <label htmlFor="executionDelay">Execution Delay (in seconds)</label>
        <input type="number" id="executionDelay" name="executionDelay" required />
      </div>

      <div>
        <label htmlFor="passThresholdBps">Pass Threshold (in basis points)</label>
        <input type="number" id="passThresholdBps" name="passThresholdBps" required />
      </div>

      <div>
        <label htmlFor="proposalEngine">Proposal Engine Address</label>
        <input type="text" id="proposalEngine" name="proposalEngine" required />
      </div>

      <div>
        <label htmlFor="distributor">Distributor Address</label>
        <input type="text" id="distributor" name="distributor" required />
      </div>

      <div>
        <label htmlFor="votingToken">Voting Token Address</label>
        <input type="text" id="votingToken" name="votingToken" required />
      </div>

      <div>
        <label htmlFor="feeBps">Fee (in basis points)</label>
        <input type="number" id="feeBps" name="feeBps" required />
      </div>

      <div>
        <label htmlFor="feeRecipient">Fee Recipient Address</label>
        <input type="text" id="feeRecipient" name="feeRecipient" required />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Creating...' : 'Create Party'}
      </button>

      {error && (
        <div className="text-red-500">
          {error.message}
        </div>
      )}
    </form>
  );
} 