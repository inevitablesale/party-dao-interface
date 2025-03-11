import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useDynamicPartySDK } from '../hooks/useDynamicPartySDK';
import { VotingPowerSnapshot } from '../types/party-protocol';

interface VotingPowerDisplayProps {
  partyAddress: string;
}

export function VotingPowerDisplay({ partyAddress }: VotingPowerDisplayProps) {
  const {
    getVotingPower,
    loading,
    error,
    isAuthenticated,
    primaryWallet
  } = useDynamicPartySDK();

  const [votingPower, setVotingPower] = useState<ethers.BigNumber | null>(null);

  useEffect(() => {
    const loadVotingPower = async () => {
      if (!isAuthenticated || !primaryWallet?.address) return;

      try {
        const power = await getVotingPower(partyAddress, primaryWallet.address);
        setVotingPower(power);
      } catch (err) {
        console.error('Failed to load voting power:', err);
      }
    };

    loadVotingPower();
  }, [partyAddress, isAuthenticated, primaryWallet?.address, getVotingPower]);

  if (!isAuthenticated) {
    return <div>Please connect your wallet to view voting power</div>;
  }

  return (
    <div>
      <h2>Your Voting Power</h2>
      
      {loading && <div>Loading voting power...</div>}
      
      {error && (
        <div style={{ color: 'red' }}>
          Error: {error.message}
          {error.reason && ` (${error.reason})`}
        </div>
      )}

      {votingPower && (
        <div>
          <p>Total Voting Power: {ethers.utils.formatEther(votingPower)} ETH</p>
          <p>Wallet Address: {primaryWallet?.address}</p>
        </div>
      )}
    </div>
  );
} 