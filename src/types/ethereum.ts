import { providers } from 'ethers';

export interface IEthereum {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (eventName: string, handler: (...args: any[]) => void) => void;
  removeListener: (eventName: string, handler: (...args: any[]) => void) => void;
  removeAllListeners: (eventName: string) => void;
  isMetaMask?: boolean;
  isConnected: () => boolean;
  chainId: string;
  networkVersion: string;
  selectedAddress: string | null;
  providers?: providers.Web3Provider[];
}

export interface TransactionResponse {
  hash: string;
  confirmations: number;
  from: string;
  wait: (confirmations?: number) => Promise<TransactionReceipt>;
}

export interface TransactionReceipt {
  to: string;
  from: string;
  contractAddress: string;
  transactionIndex: number;
  gasUsed: string;
  blockHash: string;
  transactionHash: string;
  logs: Array<Log>;
  blockNumber: number;
  confirmations: number;
  status: number;
  type: number;
  byzantium: boolean;
}

export interface Log {
  blockNumber: number;
  blockHash: string;
  transactionIndex: number;
  removed: boolean;
  address: string;
  data: string;
  topics: Array<string>;
  transactionHash: string;
  logIndex: number;
} 