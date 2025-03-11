import { ChainId } from '../types/network';

interface ContractAddresses {
  PartyFactory: string;
  MetadataProvider: string;
  AtomicManualParty: string;
  ContributionRouter: string;
  BasicMetadataProvider: string;
}

type NetworkAddresses = {
  [key in ChainId]: ContractAddresses;
};

export const PARTY_ADDRESSES: NetworkAddresses = {
  // Ethereum Mainnet
  1: {
    PartyFactory: '0x4615F5A1B5B10cdAe212BD105c02Acf35BBeb619',
    MetadataProvider: '0xBC98Afde1DDCc9c17a8E69157b83b8971007cF92',
    AtomicManualParty: '0x4a4D5126F99e58466Ceb051d17661bAF0BE2Cf93',
    ContributionRouter: '0x2A93E97E84a532009DcAcC897295c6387Fd5c7e9',
    BasicMetadataProvider: '0x70f80ae910081409DF29c6D779Cd83208B751636'
  },
  // Goerli Testnet
  5: {
    PartyFactory: '0x4615F5A1B5B10cdAe212BD105c02Acf35BBeb619',
    MetadataProvider: '0xC9846AD49F40bc66217280731Fc8EaEA37231979',
    AtomicManualParty: '0xb24aa5a8E4a6bb691DF4B722E79Da7842BFB8A68',
    ContributionRouter: '0x2EAf43684FF4655FC2Dd5827Ce9302c82eEc7a51',
    BasicMetadataProvider: '0x8816cec81d3221a8bc6c0760bcb33e646d355efb'
  },
  // Base Mainnet
  8453: {
    PartyFactory: '0x4615F5A1B5B10cdAe212BD105c02Acf35BBeb619',
    MetadataProvider: '0xe06e71867bB25Fe6b56b854500961D4D9dd7c12e',
    AtomicManualParty: '0xA138Bc79434Be2e134174f59277092F22b23bA91',
    ContributionRouter: '0xD9F65f0d2135BeE238db9c49558632Eb6030CAa7',
    BasicMetadataProvider: '0x39244498E639C4B24910E73DFa3622881D456724'
  },
  // Base Goerli Testnet
  84531: {
    PartyFactory: '0x4615F5A1B5B10cdAe212BD105c02Acf35BBeb619',
    MetadataProvider: '0x480f02Ca2E29A71bac6E314879E487a49a237E1B',
    AtomicManualParty: '0x1B78e1801C83c176161101d448E27FbCD66f178e',
    ContributionRouter: '0x53998d625B7Bb9252af9C5324a639e5Ca7bc50bF',
    BasicMetadataProvider: '0x104db1E49b87C80Ec2E2E9716e83A304415C15Ce'
  }
}; 