import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useDynamicPartySDK } from '../hooks/useDynamicPartySDK';

interface PartyCreatorProps {
  onPartyCreated?: (partyAddress: string) => void;
}

export function PartyCreator({ onPartyCreated }: PartyCreatorProps) {
  const {
    createParty,
    loading,
    error,
    isAuthenticated,
    primaryWallet
  } = useDynamicPartySDK();

  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [initialContribution, setInitialContribution] = useState('');
  const [votingPeriod, setVotingPeriod] = useState('72'); // Default 72 hours
  const [executionPeriod, setExecutionPeriod] = useState('48'); // Default 48 hours
  const [passThresholdBps, setPassThresholdBps] = useState('5100'); // Default 51%
  const [hosts, setHosts] = useState<string[]>([]);
  const [newHost, setNewHost] = useState('');

  const addHost = () => {
    if (ethers.utils.isAddress(newHost) && !hosts.includes(newHost)) {
      setHosts([...hosts, newHost]);
      setNewHost('');
    }
  };

  const removeHost = (address: string) => {
    setHosts(hosts.filter(host => host !== address));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const result = await createParty({
        name,
        symbol,
        description,
        hosts,
        votingPeriod: Number(votingPeriod) * 3600, // Convert hours to seconds
        executionPeriod: Number(executionPeriod) * 3600,
        passThresholdBps: Number(passThresholdBps),
        initialContribution: ethers.utils.parseEther(initialContribution || '0')
      });

      console.log('Party created:', result);
      if (onPartyCreated && result.partyAddress) {
        onPartyCreated(result.partyAddress);
      }

      // Reset form
      setName('');
      setSymbol('');
      setDescription('');
      setInitialContribution('');
      setHosts([]);
    } catch (err) {
      console.error('Failed to create party:', err);
    }
  };

  if (!isAuthenticated) {
    return <div>Please connect your wallet to create a party</div>;
  }

  return (
    <div className="party-creator">
      <h2>Create New Party</h2>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Party Name</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter party name"
            required
          />
        </div>

        <div>
          <label htmlFor="symbol">Token Symbol</label>
          <input
            id="symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="PRTY"
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your party's purpose"
            required
          />
        </div>

        <div>
          <label htmlFor="initialContribution">Initial Contribution (ETH)</label>
          <input
            id="initialContribution"
            type="number"
            step="0.000000000000000001"
            value={initialContribution}
            onChange={(e) => setInitialContribution(e.target.value)}
            placeholder="0.0"
          />
        </div>

        <div>
          <label htmlFor="votingPeriod">Voting Period (hours)</label>
          <input
            id="votingPeriod"
            type="number"
            value={votingPeriod}
            onChange={(e) => setVotingPeriod(e.target.value)}
            min="1"
            required
          />
        </div>

        <div>
          <label htmlFor="executionPeriod">Execution Period (hours)</label>
          <input
            id="executionPeriod"
            type="number"
            value={executionPeriod}
            onChange={(e) => setExecutionPeriod(e.target.value)}
            min="1"
            required
          />
        </div>

        <div>
          <label htmlFor="passThresholdBps">Pass Threshold (%)</label>
          <input
            id="passThresholdBps"
            type="number"
            value={Number(passThresholdBps) / 100}
            onChange={(e) => setPassThresholdBps((Number(e.target.value) * 100).toString())}
            min="1"
            max="100"
            required
          />
        </div>

        <div>
          <label>Hosts</label>
          <div className="hosts-input">
            <input
              value={newHost}
              onChange={(e) => setNewHost(e.target.value)}
              placeholder="Enter host address"
            />
            <button type="button" onClick={addHost}>Add Host</button>
          </div>
          <div className="hosts-list">
            {hosts.map(host => (
              <div key={host} className="host-item">
                <span>{host}</span>
                <button type="button" onClick={() => removeHost(host)}>Remove</button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Party...' : 'Create Party'}
        </button>
      </form>

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