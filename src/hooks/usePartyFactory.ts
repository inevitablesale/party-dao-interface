import { useCallback, useState } from 'react';
import { ethers } from 'ethers';
import { useWalletConnection } from './useWalletConnection';
import { usePartyContracts } from './usePartyContracts';
import { PARTY_FACTORY_ABI } from '../constants/abis';
import { CrowdfundType } from '../types/contracts/party-protocol/ICrowdfund';

interface CreatePartyParams {
  hosts: string[];
  voteDuration: number;
  executionDelay: number;
  passThresholdBps: number;
  totalVotingPower: ethers.BigNumber;
}

interface CreateCrowdfundParams {
  type: CrowdfundType;
  minContribution: ethers.BigNumber;
  maxContribution: ethers.BigNumber;
  duration: number;
  exchangeRate: ethers.BigNumber;
  fundingVotingPower: ethers.BigNumber;
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

interface PartyFactoryError extends Error {
  code?: string;
  reason?: string;
  transaction?: any;
}

export function usePartyFactory() {
  const { provider } = useWalletConnection();
  const { PartyFactory: factoryAddress } = usePartyContracts();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PartyFactoryError | null>(null);

  const createParty = useCallback(async (params: CreatePartyParams) => {
    if (!provider) throw new Error('Provider not available');
    if (!ethers.utils.isAddress(factoryAddress)) throw new Error('Invalid factory address');
    setLoading(true);
    setError(null);

    try {
      const signer = provider.getSigner();
      const factory = new ethers.Contract(factoryAddress, PARTY_FACTORY_ABI, signer);

      const tx = await factory.createParty(
        await signer.getAddress(),
        params.hosts,
        params.voteDuration,
        params.executionDelay,
        params.passThresholdBps,
        params.totalVotingPower
      );

      const receipt = await tx.wait();
      const partyCreatedEvent = receipt.events?.find(e => e.event === 'PartyCreated');
      if (!partyCreatedEvent) throw new Error('Party creation event not found');
      
      return partyCreatedEvent.args.party;
    } catch (err: any) {
      const error: PartyFactoryError = new Error(err.reason || 'Failed to create party');
      error.code = err.code;
      error.reason = err.reason;
      error.transaction = err.transaction;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [provider, factoryAddress]);

  const crowdfundTypeToIndex = {
    [CrowdfundType.ETH]: 0,
    [CrowdfundType.ERC20]: 1,
    [CrowdfundType.ERC721]: 2,
    [CrowdfundType.ERC1155]: 3
  };

  const createCrowdfund = useCallback(async (params: CreateCrowdfundParams) => {
    if (!provider) throw new Error('Provider not available');
    if (!ethers.utils.isAddress(factoryAddress)) throw new Error('Invalid factory address');
    setLoading(true);
    setError(null);

    try {
      const signer = provider.getSigner();
      const factory = new ethers.Contract(factoryAddress, PARTY_FACTORY_ABI, signer);

      const initData = ethers.utils.defaultAbiCoder.encode(
        [
          'address',
          'uint96',
          'uint96',
          'uint40',
          'uint96',
          'address',
          'bytes12',
          'bytes',
          'tuple(address[],uint40,uint40,uint16)'
        ],
        [
          await signer.getAddress(),
          params.minContribution,
          params.maxContribution,
          params.duration,
          params.fundingVotingPower,
          params.gatekeeper?.address || ethers.constants.AddressZero,
          params.gatekeeper?.id || ethers.constants.HashZero,
          params.gatekeeper?.data || '0x',
          [
            params.governanceOpts.hosts,
            params.governanceOpts.voteDuration,
            params.governanceOpts.executionDelay,
            params.governanceOpts.passThresholdBps
          ]
        ]
      );

      const typeIndex = crowdfundTypeToIndex[params.type];
      if (typeIndex === undefined) {
        throw new Error(`Invalid crowdfund type: ${params.type}`);
      }

      const tx = await factory.createCrowdfund(
        typeIndex,
        initData
      );

      const receipt = await tx.wait();
      const crowdfundCreatedEvent = receipt.events?.find(e => e.event === 'CrowdfundCreated');
      if (!crowdfundCreatedEvent) throw new Error('Crowdfund creation event not found');

      return crowdfundCreatedEvent.args.crowdfund;
    } catch (err: any) {
      const error: PartyFactoryError = new Error(err.reason || 'Failed to create crowdfund');
      error.code = err.code;
      error.reason = err.reason;
      error.transaction = err.transaction;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [provider, factoryAddress]);

  return {
    createParty,
    createCrowdfund,
    loading,
    error
  };
} 