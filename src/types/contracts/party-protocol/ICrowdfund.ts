import { BigNumber } from 'ethers';

export enum CrowdfundType {
  ETH = 'ETH',
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155'
}

export interface ICrowdfund {
  type: CrowdfundType;
  minContribution: BigNumber;
  maxContribution: BigNumber;
  duration: number;
  exchangeRate: BigNumber;
  fundingVotingPower: BigNumber;
  totalContributions: BigNumber;
  governanceOpts: {
    hosts: string[];
    voteDuration: number;
    executionDelay: number;
    passThresholdBps: number;
  };
  gatekeeper?: {
    address: string;
    id: string;
    data?: string;
  };
}

export interface CrowdfundContribution {
  contributor: string;
  amount: BigNumber;
  timestamp: number;
  votingPower: BigNumber;
}

export interface GateKeeper {
  address: string;
  id: string;
  data?: string;
} 