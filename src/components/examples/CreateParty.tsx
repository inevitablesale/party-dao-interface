import { useState } from 'react';
import { ethers } from 'ethers';
import { usePartyFactory } from '../../hooks/usePartyFactory';
import { useWalletConnection } from '../../hooks/useWalletConnection';
import { PartyOptions } from '../../types/contracts/party-protocol/IParty';

const FACTORY_ADDRESS = '0x...'; // Replace with actual factory address

export function CreateParty() {
  const { connect, address, isConnecting } = useWalletConnection();
  const { createParty, loading, error } = usePartyFactory(FACTORY_ADDRESS);
  const [formData, setFormData] = useState<PartyOptions>({
    hosts: [],
    voteDuration: 7 * 24 * 60 * 60, // 1 week
    executionDelay: 2 * 24 * 60 * 60, // 2 days
    passThresholdBps: 5100, // 51%
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      await connect();
      return;
    }

    try {
      const party = await createParty({
        ...formData,
        hosts: [...formData.hosts, address],
        totalVotingPower: ethers.utils.parseEther('100')
      });
      console.log('Party created:', party);
    } catch (err) {
      console.error('Failed to create party:', err);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create New Party</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Additional Hosts (comma-separated)
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="0x123..., 0x456..."
            onChange={(e) => setFormData({
              ...formData,
              hosts: e.target.value.split(',').map(h => h.trim()).filter(Boolean)
            })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Vote Duration (days)
          </label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={formData.voteDuration / (24 * 60 * 60)}
            onChange={(e) => setFormData({
              ...formData,
              voteDuration: parseInt(e.target.value) * 24 * 60 * 60
            })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Execution Delay (days)
          </label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={formData.executionDelay / (24 * 60 * 60)}
            onChange={(e) => setFormData({
              ...formData,
              executionDelay: parseInt(e.target.value) * 24 * 60 * 60
            })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Pass Threshold (%)
          </label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={formData.passThresholdBps / 100}
            onChange={(e) => setFormData({
              ...formData,
              passThresholdBps: parseInt(e.target.value) * 100
            })}
          />
        </div>

        <button
          type="submit"
          disabled={loading || isConnecting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : isConnecting ? 'Connecting...' : 'Create Party'}
        </button>

        {error && (
          <div className="text-red-600 text-sm mt-2">
            {error.message}
          </div>
        )}
      </form>
    </div>
  );
} 