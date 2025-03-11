import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useDynamicPartySDK } from '../hooks/useDynamicPartySDK';

interface CrowdfundManagerProps {
  onCrowdfundCreated?: (crowdfundAddress: string) => void;
}

export function CrowdfundManager({ onCrowdfundCreated }: CrowdfundManagerProps) {
  const {
    createCrowdfund,
    loading,
    error,
    isAuthenticated,
    primaryWallet
  } = useDynamicPartySDK();

  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [target, setTarget] = useState('');
  const [minContribution, setMinContribution] = useState('');
  const [maxContribution, setMaxContribution] = useState('');
  const [duration, setDuration] = useState('72'); // Default 72 hours
  const [exchangeRate, setExchangeRate] = useState('100'); // 1:1 by default
  const [fundingRecipient, setFundingRecipient] = useState('');
  const [gatekeeper, setGatekeeper] = useState('');
  const [isNFT, setIsNFT] = useState(false);

  useEffect(() => {
    if (isAuthenticated && primaryWallet?.address) {
      setFundingRecipient(primaryWallet.address);
    }
  }, [isAuthenticated, primaryWallet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const result = await createCrowdfund({
        name,
        symbol,
        description,
        target: ethers.utils.parseEther(target),
        minContribution: ethers.utils.parseEther(minContribution),
        maxContribution: ethers.utils.parseEther(maxContribution),
        duration: Number(duration) * 3600, // Convert hours to seconds
        exchangeRate: Number(exchangeRate),
        fundingRecipient,
        gatekeeper: gatekeeper || ethers.constants.AddressZero,
        tokenType: isNFT ? 'ERC721' : 'ERC20'
      });

      console.log('Crowdfund created:', result);
      if (onCrowdfundCreated && result.crowdfundAddress) {
        onCrowdfundCreated(result.crowdfundAddress);
      }

      // Reset form
      setName('');
      setSymbol('');
      setDescription('');
      setTarget('');
      setMinContribution('');
      setMaxContribution('');
      setDuration('72');
      setExchangeRate('100');
      setGatekeeper('');
    } catch (err) {
      console.error('Failed to create crowdfund:', err);
    }
  };

  if (!isAuthenticated) {
    return <div>Please connect your wallet to create a crowdfund</div>;
  }

  return (
    <div className="crowdfund-manager">
      <h2>Create Crowdfunding Campaign</h2>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Campaign Name</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter campaign name"
            required
          />
        </div>

        <div>
          <label htmlFor="symbol">Token Symbol</label>
          <input
            id="symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="CRWD"
            required
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your crowdfunding campaign"
            required
          />
        </div>

        <div>
          <label htmlFor="target">Target Amount (ETH)</label>
          <input
            id="target"
            type="number"
            step="0.000000000000000001"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="0.0"
            required
          />
        </div>

        <div>
          <label htmlFor="minContribution">Minimum Contribution (ETH)</label>
          <input
            id="minContribution"
            type="number"
            step="0.000000000000000001"
            value={minContribution}
            onChange={(e) => setMinContribution(e.target.value)}
            placeholder="0.0"
            required
          />
        </div>

        <div>
          <label htmlFor="maxContribution">Maximum Contribution (ETH)</label>
          <input
            id="maxContribution"
            type="number"
            step="0.000000000000000001"
            value={maxContribution}
            onChange={(e) => setMaxContribution(e.target.value)}
            placeholder="0.0"
            required
          />
        </div>

        <div>
          <label htmlFor="duration">Duration (hours)</label>
          <input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min="1"
            required
          />
        </div>

        <div>
          <label htmlFor="exchangeRate">Exchange Rate (tokens per ETH)</label>
          <input
            id="exchangeRate"
            type="number"
            value={exchangeRate}
            onChange={(e) => setExchangeRate(e.target.value)}
            min="1"
            required
          />
        </div>

        <div>
          <label htmlFor="fundingRecipient">Funding Recipient</label>
          <input
            id="fundingRecipient"
            value={fundingRecipient}
            onChange={(e) => setFundingRecipient(e.target.value)}
            placeholder="0x..."
            required
          />
        </div>

        <div>
          <label htmlFor="gatekeeper">Gatekeeper Contract (Optional)</label>
          <input
            id="gatekeeper"
            value={gatekeeper}
            onChange={(e) => setGatekeeper(e.target.value)}
            placeholder="0x..."
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={isNFT}
              onChange={(e) => setIsNFT(e.target.checked)}
            />
            Issue NFTs instead of ERC20 tokens
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Crowdfund...' : 'Create Crowdfund'}
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