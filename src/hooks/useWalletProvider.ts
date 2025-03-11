export interface WalletAdditionalAddress {
  address: string;
  type: string;
}

export interface NameServiceData {
  // Name service data structure
  name?: string;
  avatar?: string;
}

export interface WalletConnector {
  // Wallet connector properties
  name: string;
  type: string;
}

export interface WalletType {
  // Core properties from Dynamic SDK
  additionalAddresses: WalletAdditionalAddress[];
  address: string;
  chain: string;
  connector: WalletConnector;
  id: string;
  isAuthenticated: boolean;
  key: string;
  provider: any;  // Web3Provider
  isConnected: boolean;

  // Methods from Dynamic SDK
  getBalance(): Promise<string | undefined>;
  getNameService(): Promise<NameServiceData | undefined>;
  proveOwnership(messageToSign: string): Promise<string | undefined>;
  signMessage(messageToSign: string): Promise<string | undefined>;
  switchNetwork(networkChainId: number | string): Promise<void>;
  sync(): Promise<void>;
} 