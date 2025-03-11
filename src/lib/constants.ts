
import { ethers } from "ethers";

// Original RD Token and Factory addresses
export const FACTORY_ADDRESS = "0x3522fCA64A8F79b004fDbd9a383B56113B81130B";
export const RD_TOKEN_ADDRESS = "0x81137573408bCD23f801A56D68268cc0CE5206B5";
export const TREASURY_ADDRESS = "0x386f47AE974255c9486A2D4B91a3694E95A1EE81";
export const RD_PRICE_USD = 1.00; // $1.00 per RD token
export const MIN_LGR_REQUIRED = "100"; // 100 RD tokens minimum required

// Contract-specific constants
export const MIN_VOTING_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds
export const MAX_VOTING_DURATION = 90 * 24 * 60 * 60; // 90 days in seconds
export const MIN_TARGET_CAPITAL = ethers.utils.parseEther("1000"); // 1,000 RD
export const MAX_TARGET_CAPITAL = ethers.utils.parseEther("25000000"); // 25,000,000 RD
export const SUBMISSION_FEE = ethers.utils.parseEther("25"); // 25 RD to submit
export const VOTING_FEE = ethers.utils.parseEther("1"); // 1 RD to vote

// Contract addresses
export const AUTHORIZED_TEST_MODE_ADDRESS = "0x7b1B2b967923bC3EB4d9Bf5472EA017Ac644e4A2";

// Factory Contract ABI for RDProposalFactory
export const FACTORY_ABI = [
  // View functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function paused() view returns (bool)", // Added this line
  
  // RDProposalFactory specific functions
  "function RD_TOKEN() view returns (address)",
  "function treasury() view returns (address)",
  "function submissionFee() view returns (uint256)",
  "function VOTING_FEE() view returns (uint256)",
  "function MIN_TARGET_CAPITAL() view returns (uint128)",
  "function MAX_TARGET_CAPITAL() view returns (uint128)",
  "function proposals(uint256) view returns (address creator, string title, string metadataURI, uint128 targetCapital, uint256 votingEnds, uint256 launchTimestamp, uint256 lastActivityTimestamp, uint256 backerCount, uint256 totalPledged)",
  "function userProposals(address, uint256) view returns (uint256)",
  "function hasVoted(uint256, address) view returns (bool)",
  "function proposalVoters(uint256, uint256) view returns (address)",
  
  // State-modifying functions
  "function createProposal(string calldata title, string calldata metadataURI, uint128 targetCapital, uint256 votingDuration) returns (uint256)",
  "function vote(uint256 proposalId, uint128 pledgeAmount)",
  "function updateMetadata(uint256 proposalId, string calldata newMetadataURI)",
  
  // Events
  "event ProposalCreated(uint256 indexed proposalId, address indexed creator)",
  "event ProposalMetadataUpdated(uint256 indexed proposalId, string newMetadataURI)",
  "event ProposalVoted(uint256 indexed proposalId, address indexed voter, uint128 pledgeAmount, uint256 timestamp)",
  "event ProposalFullyPledged(uint256 indexed proposalId, uint128 totalPledged, uint256 backerCount, uint256 timestamp)",
  "event MilestoneReached(uint256 indexed proposalId, uint256 milestone, uint256 currentAmount, uint256 timestamp)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

// Party Protocol Constants on Polygon
export const PARTY_PROTOCOL = {
  // Polygon Mainnet addresses
  FACTORY_ADDRESS: "0x4ec46A5C10fd795CEc3bBC6F85b372465B1051f3",
  ETH_CROWDFUND_ADDRESS: "0x60534a0b5C8B8119c713f2dDb30f2eB31E31D1F9",
  PARTY_IMPLEMENTATION: "0x4ec46A5C10fd795CEc3bBC6F85b372465B1051f3",
  PARTY_HELPER_ADDRESS: "0xc48CF9807BC36b5859bc480bE4Cb6D18C1F5BB10",
  GOVERNANCE_ADDRESS: "0x87a86CAD115a46F515f3456AE63c39FedB0f8Ab4",
  EXECUTION_DELAY: 24 * 60 * 60, // 1 day in seconds
  PASS_THRESHOLD_BPS: 5000, // 50%
  FEE_BPS: 0 // No fees initially
};

// Party Protocol ABIs
export const PARTY_FACTORY_ABI = [
  // Core Functions
  "function createParty(tuple(string name, address[] hosts, uint40 votingDuration, uint40 executionDelay, uint16 passThresholdBps, bool allowPublicProposals, string metadataURI)) external returns (address)",
  // View Functions
  "function getGovernanceOpts(address governanceImpl) external view returns (tuple(address authority, uint40 votingDuration, uint40 executionDelay, uint16 passThresholdBps, address preciousTokenAddress, uint256 preciousTokenId, bool rageQuitTimestampMs, bool isBondingCurveAllowed, address[] allowedProposalExecutions) opts)",
  // Events
  "event PartyCreated(address indexed party, address[] hosts, uint256 timestamp)"
];

export const ETH_CROWDFUND_ABI = [
  // Core Functions
  "function createEthCrowdfund(address party, tuple(address initialContributor, uint96 minContribution, uint96 maxContribution, uint96 maxTotalContributions, uint40 duration, string metadataURI)) external returns (address)",
  "function contribute(address delegate) external payable returns (uint256)",
  "function contribute(address delegate, bytes memory gatekeeperData) external payable returns (uint256)",
  // View Functions
  "function getCrowdfundSettings() external view returns (tuple(address party, address initialContributor, uint96 minContribution, uint96 maxContribution, uint96 maxTotalContributions, uint40 duration, uint96 exchangeRate, uint96 fundingSplitBps, address fundingSplitRecipient, uint256 totalContributions, uint40 timestamp, string metadataURI, bool settled))",
  "function getContribution(address contributor) external view returns (uint256)",
  // Events
  "event Contributed(address indexed contributor, address indexed delegate, uint256 amount, uint256 timestamp)",
  "event CrowdfundCreated(address indexed crowdfund, address indexed party, uint256 timestamp)"
];

export const PARTY_GOVERNANCE_ABI = [
  // Core Functions
  "function propose(tuple(uint8 basicProposalEngineType, bytes[] targetAddresses, uint256[] values, bytes[] calldatas, string[] signatures) proposalEngineOpts, string description, bytes progressData) external returns (uint256 proposalId)",
  "function execute(uint256 proposalId, tuple(address[] targets, uint256[] values, bytes[] calldatas, string[] signatures) proposalData, uint256 flags, bytes progressData) external returns (bytes[] execResults)",
  "function vote(uint256 proposalId, uint8 vote) external",
  "function cancelProposal(uint256 proposalId) external",
  // View Functions
  "function getProposalStateInfo(uint256 proposalId) external view returns (tuple(uint8 status, uint40 executionTime, address proposer, uint24 votesFor, uint24 votesAgainst, uint24 passThresholdBps, uint40 totalVotingPower, bytes32 proposalHash))",
  "function getVotingPowerAt(address voter, uint40 timestamp) external view returns (uint96)",
  // Events
  "event ProposalCreated(uint256 indexed proposalId, address indexed proposer, tuple(uint8 status, uint40 executionTime, address proposer, uint24 votesFor, uint24 votesAgainst, uint24 passThresholdBps, uint40 totalVotingPower, bytes32 proposalHash) info, uint256 timestamp)",
  "event ProposalVoted(uint256 indexed proposalId, address indexed voter, uint8 vote, uint256 weight)",
  "event ProposalExecuted(uint256 indexed proposalId, address executor, bytes[] execResults)"
];

export const PARTY_HELPER_ABI = [
  "function getRageQuitETHAmount(address receiver, address party, uint256[] tokenIds) external view returns (uint256 ethAmount)",
  "function rageQuit(address party, uint256[] tokenIds, address receiver) external",
  "function getVotingPower(address party, address voter) external view returns (uint256)"
];

// Resistance NFT Contract - single contract for all roles (Sentinel, Survivor, Bounty Hunter)
export const RESISTANCE_NFT_ADDRESS = "0xdD44d15f54B799e940742195e97A30165A1CD285"; 
export const RESISTANCE_NFT_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)"
];

// Removing incorrect separate NFT addresses
// These variables are used in the codebase and need to reference the correct address
export const SURVIVOR_NFT_ADDRESS = RESISTANCE_NFT_ADDRESS;
export const SENTINEL_NFT_ADDRESS = RESISTANCE_NFT_ADDRESS;

// Bounty Factory Contract
export const BOUNTY_FACTORY_ADDRESS = "0x4a5EA76571F47E7d92B5040E8C7FF12eacd35087"; // Polygon mainnet
export const BOUNTY_FACTORY_ABI = [
  // Core Functions
  "function createBounty(string name, string metadataURI, uint256 rewardAmount, uint256 totalBudget, uint256 duration) external returns (uint256)",
  "function getBounty(uint256 bountyId) external view returns (tuple(address creator, string name, string metadataURI, uint256 rewardAmount, uint256 totalBudget, uint256 remainingBudget, uint256 duration, uint256 createdAt, uint256 expiresAt, bool active))",
  "function updateBountyStatus(uint256 bountyId, bool active) external",
  "function fundBounty(uint256 bountyId) external payable",
  
  // View Functions
  "function getBountyCount() external view returns (uint256)",
  "function getBountyIdsByCreator(address creator) external view returns (uint256[])",
  "function getBountyIdsByHunter(address hunter) external view returns (uint256[])",
  
  // Events
  "event BountyCreated(uint256 indexed bountyId, address indexed creator, string name, uint256 timestamp)",
  "event BountyFunded(uint256 indexed bountyId, address funder, uint256 amount, uint256 timestamp)",
  "event BountyStatusUpdated(uint256 indexed bountyId, bool active, uint256 timestamp)",
  "event ReferralSubmitted(uint256 indexed bountyId, address indexed hunter, address referred, uint256 timestamp)",
  "event ReferralVerified(uint256 indexed bountyId, address indexed hunter, address referred, bool approved, uint256 timestamp)",
  "event RewardDistributed(uint256 indexed bountyId, address indexed hunter, uint256 amount, uint256 timestamp)"
];
