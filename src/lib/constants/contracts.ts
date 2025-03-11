
// Addresses of deployed factory contracts on different networks
export const HOLDING_FACTORY_ADDRESSES: { [chainId: number]: string } = {
  1: "0x1ca20040ce6ad406bc2a6c89976388829e7fbade", // Ethereum Mainnet
  137: "0x2dFA21A5EbF5CcBE62566458A1baEC6B1F33f292", // Polygon
  80001: "0x83e63E8bAba6C6dcb9F3F4324bEfA72AD8f43e44", // Mumbai
  5: "0x72a4b63eceA9465e3984CDEe1354b9CF9030c043", // Goerli
  8453: "0xF8c8fC091C0Cc94a9029d6443050bDfF9097E38A", // Base
  84531: "0xa7C2ede6A4ebdE4EE86E600D339F9F236B8C1275", // Base Goerli
};

// Contract ABI for the HoldingFactory
export const HOLDING_FACTORY_ABI = [
  "function deployHoldingContract(address _creator, string _bountyId, uint8 _securityLevel) external returns (address)",
  "function isHoldingContract(address _contract) external view returns (bool)",
  "function getHoldingContract(address _creator, string _bountyId) external view returns (address)"
];

// Security levels for holding contracts
export const SECURITY_LEVELS = {
  BASIC: 0,
  MULTISIG: 1,
  TIMELOCK: 2
};
