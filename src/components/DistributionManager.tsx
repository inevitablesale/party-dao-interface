import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useDynamicPartySDK } from '../hooks/useDynamicPartySDK';
import { Distribution } from '../types/party-protocol';

interface DistributionManagerProps {
  partyAddress: string;
  onDistributionCreated?: (distributionId: number) => void;
}

export function DistributionManager({ partyAddress, onDistributionCreated }: DistributionManagerProps) {
  const {
    distribute,
    loading,
    error,
    isAuthenticated,
    primaryWallet
  } = useDynamicPartySDK();

  const [tokenId, setTokenId] = useState('');
  const [amount, setAmount] = useState('');

  const handleDistribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const result = await distribute(
        partyAddress,
        tokenId,
        ethers.utils.parseEther(amount)
      );
      console.log('Distribution created:', result);
      setTokenId('');
      setAmount('');
    } catch (err) {
      console.error('Failed to create distribution:', err);
    }
  };

  if (!isAuthenticated) {
    return <div>Please connect your wallet to manage distributions</div>;
  }

  return (
    <div>
      <h2>Create Distribution</h2>
      
      <form onSubmit={handleDistribute}>
        <div>
          <label htmlFor="tokenId">Token ID</label>
          <input
            id="tokenId"
            type="text"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            placeholder="Token ID"
            required
          />
        </div>

        <div>
          <label htmlFor="amount">Amount (ETH)</label>
          <input
            id="amount"
            type="number"
            step="0.000000000000000001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount in ETH"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Distribution...' : 'Create Distribution'}
        </button>
      </form>

      {error && (
        <div style={{ color: 'red' }}>
          Error: {error.message}
          {error.reason && ` (${error.reason})`}
        </div>
      )}

      <div>
        <p>Connected Wallet: {primaryWallet?.address}</p>
      </div>
    </div>
  );
} 