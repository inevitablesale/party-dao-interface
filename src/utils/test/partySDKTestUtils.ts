import { ethers } from 'ethers';
import { PartySDKError } from '../../hooks/usePartySDK';

export const mockProvider = {
  getSigner: () => ({
    getAddress: async () => '0x123...',
    signMessage: async (message: string) => '0xsignature...'
  })
};

export const mockContracts = {
  party: {
    attach: () => ({
      propose: async () => ({ wait: async () => ({ events: [] }) }),
      vote: async () => ({ wait: async () => ({ events: [] }) }),
      getProposals: async () => [],
      getVotingPower: async () => ethers.BigNumber.from(0)
    })
  },
  partyFactory: {
    createParty: async () => ({ wait: async () => ({ events: [] }) }),
    filters: {
      ProposalCreated: () => ({}),
      VoteCast: () => ({}),
      PartyCreated: () => ({})
    },
    on: () => {},
    removeAllListeners: () => {}
  },
  crowdfundFactory: {
    createCrowdfund: async () => ({ wait: async () => ({ events: [] }) })
  },
  tokenDistributor: {
    distribute: async () => ({ wait: async () => ({ events: [] }) }),
    filters: {
      Distribution: () => ({})
    },
    on: () => {},
    removeAllListeners: () => {}
  }
};

export const mockPartySDKHook = {
  contracts: mockContracts,
  loading: false,
  error: null as PartySDKError | null,
  createParty: async () => ({ events: [] }),
  createCrowdfund: async () => ({ events: [] }),
  createProposal: async () => ({ events: [] }),
  vote: async () => ({ events: [] }),
  distribute: async () => ({ events: [] }),
  getParty: async () => mockContracts.party,
  getProposals: async () => [],
  getVotingPower: async () => ethers.BigNumber.from(0)
};

export const mockDynamicContext = {
  isAuthenticated: true,
  primaryWallet: {
    address: '0x123...',
    connector: {},
    chain: 'ethereum'
  },
  network: 1
}; 