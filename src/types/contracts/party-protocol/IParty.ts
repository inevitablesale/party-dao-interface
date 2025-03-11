import { BigNumber } from 'ethers';

export enum ProposalStatus {
  Invalid = 'Invalid',
  Voting = 'Voting',
  Passed = 'Passed',
  Ready = 'Ready',
  InProgress = 'InProgress',
  Complete = 'Complete',
  Cancelled = 'Cancelled',
  Defeated = 'Defeated'
}

export interface ProposalVote {
  voter: string;
  power: BigNumber;
  timestamp: number;
  support: boolean;
}

export interface IProposal {
  id: number;
  proposer: string;
  status: ProposalStatus;
  votingEnds: number;
  executionDelay: number;
  votes: ProposalVote[];
  totalVotingPower: BigNumber;
}

export interface IParty {
  address: string;
  votingPower: BigNumber;
  isHost: boolean;
  proposalCount: number;
  proposals?: IProposal[];
}

export interface PartyOptions {
  voteDuration: number;
  executionDelay: number;
  passThresholdBps: number;
  hosts: string[];
  feeBps?: number;
  feeRecipient?: string;
} 