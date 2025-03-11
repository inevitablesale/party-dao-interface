import { useMemo } from 'react';
import { useWalletConnection } from './useWalletConnection';
import { PARTY_ADDRESSES } from '../constants/contracts';
import { ChainId } from '../types/network';

export function usePartyContracts() {
  const { chainId } = useWalletConnection();

  const addresses = useMemo(() => {
    if (!chainId || !PARTY_ADDRESSES[chainId as ChainId]) {
      throw new Error(`Unsupported chain ID: ${chainId}`);
    }
    return PARTY_ADDRESSES[chainId as ChainId];
  }, [chainId]);

  return addresses;
} 