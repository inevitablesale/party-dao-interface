import { useCallback, useState } from 'react';
import { ethers } from 'ethers';
import { useWalletConnection } from './useWalletConnection';
import { usePartyContracts } from './usePartyContracts';

const METADATA_PROVIDER_ABI = [
  'function getMetadata(address party) external view returns (string memory)',
  'function setMetadata(address party, string calldata metadata) external',
  'event MetadataSet(address indexed party, string metadata)'
];

interface PartyMetadata {
  name?: string;
  description?: string;
  imageUrl?: string;
  externalUrl?: string;
  attributes?: Record<string, any>[];
}

interface MetadataProviderError extends Error {
  code?: string;
  reason?: string;
  transaction?: any;
}

export function usePartyMetadata(useBasicProvider: boolean = false) {
  const { provider } = useWalletConnection();
  const { MetadataProvider, BasicMetadataProvider } = usePartyContracts();
  const providerAddress = useBasicProvider ? BasicMetadataProvider : MetadataProvider;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<MetadataProviderError | null>(null);

  const getMetadata = useCallback(async (partyAddress: string): Promise<PartyMetadata> => {
    if (!provider) throw new Error('Provider not available');
    if (!ethers.utils.isAddress(providerAddress)) throw new Error('Invalid provider address');
    if (!ethers.utils.isAddress(partyAddress)) throw new Error('Invalid party address');

    try {
      const contract = new ethers.Contract(providerAddress, METADATA_PROVIDER_ABI, provider);
      const metadata = await contract.getMetadata(partyAddress);
      return JSON.parse(metadata);
    } catch (err: any) {
      const error: MetadataProviderError = new Error(err.reason || 'Failed to get metadata');
      error.code = err.code;
      error.reason = err.reason;
      setError(error);
      throw error;
    }
  }, [provider, providerAddress]);

  const setMetadata = useCallback(async (partyAddress: string, metadata: PartyMetadata) => {
    if (!provider) throw new Error('Provider not available');
    if (!ethers.utils.isAddress(providerAddress)) throw new Error('Invalid provider address');
    if (!ethers.utils.isAddress(partyAddress)) throw new Error('Invalid party address');
    
    setLoading(true);
    setError(null);

    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(providerAddress, METADATA_PROVIDER_ABI, signer);

      const tx = await contract.setMetadata(partyAddress, JSON.stringify(metadata));
      const receipt = await tx.wait();

      const event = receipt.events?.find(e => e.event === 'MetadataSet');
      if (!event) throw new Error('Metadata set event not found');

      return true;
    } catch (err: any) {
      const error: MetadataProviderError = new Error(err.reason || 'Failed to set metadata');
      error.code = err.code;
      error.reason = err.reason;
      error.transaction = err.transaction;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [provider, providerAddress]);

  return {
    getMetadata,
    setMetadata,
    loading,
    error
  };
} 