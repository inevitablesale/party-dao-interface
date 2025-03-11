import React, { useState } from 'react';
import { PartyCreator } from './PartyCreator';
import { CrowdfundManager } from './CrowdfundManager';
import { ProposalManager } from './ProposalManager';
import { DistributionManager } from './DistributionManager';
import { VotingPowerDisplay } from './VotingPowerDisplay';
import { DelegationManager } from './DelegationManager';
import { BatchOperations } from './BatchOperations';
import { useDynamicPartySDK } from '../hooks/useDynamicPartySDK';
import '../styles/PartyDashboard.css';

interface PartyDashboardProps {
  initialPartyAddress?: string;
}

export function PartyDashboard({ initialPartyAddress }: PartyDashboardProps) {
  const { isAuthenticated, primaryWallet } = useDynamicPartySDK();
  const [activePartyAddress, setActivePartyAddress] = useState(initialPartyAddress || '');
  const [activeTab, setActiveTab] = useState<'create' | 'crowdfund' | 'proposals' | 'distributions' | 'voting' | 'delegation' | 'batch'>('create');

  if (!isAuthenticated) {
    return (
      <div className="party-dashboard">
        <h1>Party Dashboard</h1>
        <p>Please connect your wallet to access the dashboard</p>
      </div>
    );
  }

  return (
    <div className="party-dashboard">
      <header className="dashboard-header">
        <h1>Party Dashboard</h1>
        <div className="wallet-info">
          <p>Connected: {primaryWallet?.address}</p>
        </div>
      </header>

      {activePartyAddress && (
        <div className="active-party">
          <h2>Active Party: {activePartyAddress}</h2>
          <button onClick={() => setActivePartyAddress('')}>
            Change Party
          </button>
        </div>
      )}

      <nav className="dashboard-nav">
        <button
          className={activeTab === 'create' ? 'active' : ''}
          onClick={() => setActiveTab('create')}
        >
          Create Party
        </button>
        <button
          className={activeTab === 'crowdfund' ? 'active' : ''}
          onClick={() => setActiveTab('crowdfund')}
        >
          Crowdfunding
        </button>
        {activePartyAddress && (
          <>
            <button
              className={activeTab === 'proposals' ? 'active' : ''}
              onClick={() => setActiveTab('proposals')}
            >
              Proposals
            </button>
            <button
              className={activeTab === 'distributions' ? 'active' : ''}
              onClick={() => setActiveTab('distributions')}
            >
              Distributions
            </button>
            <button
              className={activeTab === 'voting' ? 'active' : ''}
              onClick={() => setActiveTab('voting')}
            >
              Voting Power
            </button>
            <button
              className={activeTab === 'delegation' ? 'active' : ''}
              onClick={() => setActiveTab('delegation')}
            >
              Delegation
            </button>
            <button
              className={activeTab === 'batch' ? 'active' : ''}
              onClick={() => setActiveTab('batch')}
            >
              Batch Operations
            </button>
          </>
        )}
      </nav>

      <main className="dashboard-content">
        {activeTab === 'create' && (
          <PartyCreator
            onPartyCreated={(address) => {
              setActivePartyAddress(address);
              setActiveTab('proposals');
            }}
          />
        )}

        {activeTab === 'crowdfund' && (
          <CrowdfundManager
            onCrowdfundCreated={(address) => {
              setActivePartyAddress(address);
              setActiveTab('proposals');
            }}
          />
        )}

        {activePartyAddress && activeTab === 'proposals' && (
          <ProposalManager
            partyAddress={activePartyAddress}
          />
        )}

        {activePartyAddress && activeTab === 'distributions' && (
          <DistributionManager
            partyAddress={activePartyAddress}
          />
        )}

        {activePartyAddress && activeTab === 'voting' && (
          <VotingPowerDisplay
            partyAddress={activePartyAddress}
          />
        )}

        {activePartyAddress && activeTab === 'delegation' && (
          <DelegationManager
            partyAddress={activePartyAddress}
          />
        )}

        {activePartyAddress && activeTab === 'batch' && (
          <BatchOperations
            partyAddress={activePartyAddress}
          />
        )}
      </main>
    </div>
  );
} 