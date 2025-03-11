# PartyDAO SDK Integration

## Overview
This integration uses the official `@partydao/party-protocol` SDK to interact with PartyDAO contracts. The SDK provides a type-safe and efficient way to interact with all PartyDAO functionality.

## Setup

1. Install the SDK:
```bash
npm install @partydao/party-protocol
# or
yarn add @partydao/party-protocol
```

2. Import and use the hook:
```typescript
import { usePartySDK } from '../hooks/usePartySDK';

function YourComponent() {
  const {
    createParty,
    createCrowdfund,
    createProposal,
    vote,
    // ... other functions
  } = usePartySDK();
}
```

## Core Functions

### Party Creation
```typescript
const result = await createParty({
  name: "My Party",
  symbol: "PARTY",
  governanceOpts: {
    hosts: ["0x..."],
    voteDuration: 7200, // 2 hours
    executionDelay: 3600, // 1 hour
    passThresholdBps: 5100 // 51%
  },
  // ... other options
});
```

### Crowdfunding
```typescript
const result = await createCrowdfund({
  name: "My Crowdfund",
  symbol: "CROWD",
  minimumContribution: ethers.utils.parseEther("0.1"),
  duration: 604800, // 1 week
  // ... other options
});
```

### Governance
```typescript
// Create a proposal
const proposalId = await createProposal(partyAddress, {
  proposalData: "0x..."
});

// Vote on a proposal
await vote(partyAddress, proposalId, true); // true for yes, false for no
```

### Distribution
```typescript
await distribute(
  partyAddress,
  tokenId,
  ethers.utils.parseEther("1.0")
);
```

## Error Handling
All functions include proper error handling and loading states:

```typescript
try {
  const { loading, error } = usePartySDK();
  
  if (loading) {
    // Show loading state
  }
  
  if (error) {
    // Handle error
    console.error(error.reason);
  }
} catch (err) {
  // Handle unexpected errors
}
```

## Contract Addresses
The SDK automatically handles contract addresses based on the connected network (Ethereum Mainnet, Goerli, Base, Base Goerli).

## Type Safety
The SDK provides full TypeScript support for all parameters and return values. 