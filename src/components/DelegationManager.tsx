import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useDynamicPartySDK } from '../hooks/useDynamicPartySDK';

interface DelegationManagerProps {
  partyAddress: string;
  onDelegationUpdated?: () => void;
}

export function DelegationManager({ partyAddress, onDelegationUpdated }: DelegationManagerProps) {
  const {
    getVotingPower,
    delegate,
    getDelegationInfo,
    loading,
    error,
    isAuthenticated,
    primaryWallet
  } = useDynamicPartySDK();

  const [delegatee, setDelegatee] = useState('');
  const [currentDelegatee, setCurrentDelegatee] = useState('');
  const [votingPower, setVotingPower] = useState<ethers.BigNumber | null>(null);
  const [delegatedPower, setDelegatedPower] = useState<ethers.BigNumber | null>(null);

  useEffect(() => {
    const loadDelegationInfo = async () => {
      if (!isAuthenticated || !primaryWallet?.address) return;

      try {
        const info = await getDelegationInfo(partyAddress, primaryWallet.address);
        setCurrentDelegatee(info.delegatee);
        setVotingPower(info.votingPower);
        setDelegatedPower(info.delegatedPower);
      } catch (err) {
        console.error('Failed to load delegation info:', err);
      }
    };

    loadDelegationInfo();
  }, [partyAddress, isAuthenticated, primaryWallet?.address, getDelegationInfo]);

  const handleDelegate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      await delegate(partyAddress, delegatee);
      console.log('Successfully delegated to:', delegatee);
      
      // Refresh delegation info
      const info = await getDelegationInfo(partyAddress, primaryWallet!.address);
      setCurrentDelegatee(info.delegatee);
      setVotingPower(info.votingPower);
      setDelegatedPower(info.delegatedPower);
      
      setDelegatee('');
      if (onDelegationUpdated) {
        onDelegationUpdated();
      }
    } catch (err) {
      console.error('Failed to delegate:', err);
    }
  };

  const handleUndelegate = async () => {
    if (!isAuthenticated) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      await delegate(partyAddress, primaryWallet!.address); // Delegate to self to undelegate
      console.log('Successfully undelegated');
      
      // Refresh delegation info
      const info = await getDelegationInfo(partyAddress, primaryWallet!.address);
      setCurrentDelegatee(info.delegatee);
      setVotingPower(info.votingPower);
      setDelegatedPower(info.delegatedPower);
      
      if (onDelegationUpdated) {
        onDelegationUpdated();
      }
    } catch (err) {
      console.error('Failed to undelegate:', err);
    }
  };

  if (!isAuthenticated) {
    return <div>Please connect your wallet to manage delegation</div>;
  }

  return (
    <div className="delegation-manager">
      <h2>Manage Voting Power Delegation</h2>

      <div className="delegation-info">
        <h3>Current Delegation Status</h3>
        {votingPower && (
          <p>Your Voting Power: {ethers.utils.formatEther(votingPower)} ETH</p>
        )}
        {delegatedPower && (
          <p>Power Delegated to You: {ethers.utils.formatEther(delegatedPower)} ETH</p>
        )}
        {currentDelegatee && currentDelegatee !== primaryWallet?.address && (
          <p>Currently Delegated To: {currentDelegatee}</p>
        )}
      </div>
      
      <form onSubmit={handleDelegate}>
        <div>
          <label htmlFor="delegatee">Delegate To</label>
          <input
            id="delegatee"
            value={delegatee}
            onChange={(e) => setDelegatee(e.target.value)}
            placeholder="Enter delegate address"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Delegating...' : 'Delegate'}
        </button>
      </form>

      {currentDelegatee && currentDelegatee !== primaryWallet?.address && (
        <button 
          onClick={handleUndelegate}
          disabled={loading}
          className="undelegate-button"
        >
          {loading ? 'Undelegating...' : 'Undelegate'}
        </button>
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