import { BigNumber } from 'ethers';

export interface GovernanceOpts {
  hosts: string[];
  voteDuration: number;
  executionDelay: number;
  passThresholdBps: number;
}

export interface CreatePartyParams {
  name: string;
  symbol: string;
  governanceOpts: GovernanceOpts;
  proposalEngine?: string;
  distributor?: string;
  votingToken?: string;
  feeBps?: number;
  feeRecipient?: string;
}

export interface CreateCrowdfundParams {
  name: string;
  symbol: string;
  customizationPresetId?: number;
  governanceOpts: GovernanceOpts;
  proposalEngine?: string;
  distributor?: string;
  gateKeeper?: string;
  gateKeeperId?: string;
  minimumContribution: BigNumber;
  tokenAddress?: string;
  tokenId?: string;
  duration: number;
  maximumContribution?: BigNumber;
  exchangeRateBps?: number;
  splitRecipient?: string;
  splitBps?: number;
  initialContribution?: BigNumber;
  initialDelegate?: string;
}

export interface Proposal {
  id: number;
  proposer: string;
  proposalData: string;
  status: ProposalStatus;
  votesFor: BigNumber;
  votesAgainst: BigNumber;
  createdAt: number;
  executedAt?: number;
}

export enum ProposalStatus {
  Active = 'Active',
  Cancelled = 'Cancelled',
  Defeated = 'Defeated',
  Executed = 'Executed',
  Ready = 'Ready',
  InProgress = 'InProgress'
}

export interface PartyInfo {
  name: string;
  symbol: string;
  governanceOpts: GovernanceOpts;
  proposalCount: number;
  totalVotingPower: BigNumber;
  delegationsByVoter: Record<string, string>;
}

export interface Distribution {
  partyAddress: string;
  tokenId: string;
  amount: BigNumber;
  distributionId: number;
  merkleRoot: string;
  tokenType: 'ERC20' | 'ERC721' | 'ERC1155';
}

export interface VotingPowerSnapshot {
  timestamp: number;
  votingPower: BigNumber;
  delegatedVotingPower: BigNumber;
  intrinsicVotingPower: BigNumber;
  delegatedTo: string;
} 