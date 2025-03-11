export const PARTY_GOVERNANCE_ABI = [
  // Governance Functions
  "function propose(bytes calldata proposalData) external returns (uint256)",
  "function accept(uint256 proposalId) external",
  "function reject(uint256 proposalId) external",
  "function execute(uint256 proposalId, bytes calldata proposalData, uint256 flags) external payable returns (bytes memory)",
  "function getVotingPowerAt(address voter, uint40 timestamp) external view returns (uint256)",
  "function isHost(address account) external view returns (bool)",
  "function getProposalCount() external view returns (uint256)",
  "function getProposalStateInfo(uint256 proposalId) external view returns (tuple(uint40 executedAt, uint40 completedAt, uint40 votingEnds, uint96 totalVotes, uint96 passThresholdVotes, uint96 totalVotingPower, uint96 vetoVotes))",
  
  // Events
  "event ProposalCreated(uint256 indexed proposalId, address indexed proposer, uint40 votingEnds, uint40 executionDelay, bytes proposalData)",
  "event ProposalAccepted(uint256 indexed proposalId, address indexed voter, uint256 weight)",
  "event ProposalRejected(uint256 indexed proposalId, address indexed voter, uint256 weight)",
  "event ProposalVetoed(uint256 indexed proposalId, address indexed voter, uint256 weight)",
  "event ProposalExecuted(uint256 indexed proposalId, address indexed executor, bytes proposalData)",
  "event DistributionCreated(uint256 indexed distributionId, address indexed token, uint256 amount)"
];

export const CROWDFUND_ABI = [
  // Crowdfund Functions
  "function initialize(address payable initialContributor, uint96 minContribution, uint96 maxContribution, address gateKeeper, bytes12 gateKeeperId) external",
  "function contribute(address delegate) external payable returns (uint256)",
  "function totalContributions() external view returns (uint256)",
  "function minContribution() external view returns (uint256)",
  "function maxContribution() external view returns (uint256)",
  "function exchangeRate() external view returns (uint256)",
  "function getCrowdfundType() external pure returns (uint8)",
  "function finalize() external",
  
  // Events
  "event Contributed(address indexed sender, uint256 amount, address delegate)",
  "event Finalized(uint256 totalContributions, uint256 totalPartySupply)",
  "event EmergencyExecute(address target, bytes data, uint256 amountEth)"
];

export const PARTY_FACTORY_ABI = [
  "function createParty(address authority, address[] calldata hosts, uint40 voteDuration, uint40 executionDelay, uint16 passThresholdBps, uint96 totalVotingPower) external returns (address)",
  "function createCrowdfund(uint8 crowdfundType, bytes calldata initData) external returns (address)"
];

// Additional type definitions for contract interactions
export interface ProposalStateInfo {
  executedAt: number;
  completedAt: number;
  votingEnds: number;
  totalVotes: bigint;
  passThresholdVotes: bigint;
  totalVotingPower: bigint;
  vetoVotes: bigint;
}

export interface ContributionInfo {
  contributor: string;
  amount: bigint;
  delegate: string;
}

export interface DistributionInfo {
  distributionId: number;
  token: string;
  amount: bigint;
} 