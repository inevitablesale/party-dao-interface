import { useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import { Party, PartyFactory, CrowdfundFactory, TokenDistributor } from '@partydao/party-protocol';
import { useWalletConnection } from './useWalletConnection';

export function usePartyProtocol() {
  const { provider, chainId } = useWalletConnection();

  const contracts = useMemo(() => {
    if (!provider) return null;

    const signer = provider.getSigner();
    
    return {
      party: new Party(signer),
      partyFactory: new PartyFactory(signer),
      crowdfundFactory: new CrowdfundFactory(signer),
      tokenDistributor: new TokenDistributor(signer)
    };
  }, [provider]);

  const createParty = useCallback(async ({
    name,
    symbol,
    governanceOpts,
    proposalEngine,
    distributor,
    votingToken,
    feeBps,
    feeRecipient
  }) => {
    if (!contracts) throw new Error('Contracts not initialized');

    const tx = await contracts.partyFactory.createParty({
      name,
      symbol,
      governanceOpts,
      proposalEngine,
      distributor,
      votingToken,
      feeBps,
      feeRecipient
    });

    const receipt = await tx.wait();
    return receipt;
  }, [contracts]);

  const createCrowdfund = useCallback(async ({
    name,
    symbol,
    customizationPresetId,
    governanceOpts,
    proposalEngine,
    distributor,
    gateKeeper,
    gateKeeperId,
    minimumContribution,
    tokenAddress,
    tokenId,
    duration,
    maximumContribution,
    exchangeRateBps,
    splitRecipient,
    splitBps,
    initialContribution,
    initialDelegate
  }) => {
    if (!contracts) throw new Error('Contracts not initialized');

    const tx = await contracts.crowdfundFactory.createCrowdfund({
      name,
      symbol,
      customizationPresetId,
      governanceOpts,
      proposalEngine,
      distributor,
      gateKeeper,
      gateKeeperId,
      minimumContribution,
      tokenAddress,
      tokenId,
      duration,
      maximumContribution,
      exchangeRateBps,
      splitRecipient,
      splitBps,
      initialContribution,
      initialDelegate
    });

    const receipt = await tx.wait();
    return receipt;
  }, [contracts]);

  const distribute = useCallback(async (
    partyAddress: string,
    tokenId: string,
    amount: ethers.BigNumber
  ) => {
    if (!contracts) throw new Error('Contracts not initialized');

    const tx = await contracts.tokenDistributor.distribute(
      partyAddress,
      tokenId,
      amount
    );

    const receipt = await tx.wait();
    return receipt;
  }, [contracts]);

  const getParty = useCallback(async (partyAddress: string) => {
    if (!contracts) throw new Error('Contracts not initialized');
    return await contracts.party.attach(partyAddress);
  }, [contracts]);

  return {
    contracts,
    createParty,
    createCrowdfund,
    distribute,
    getParty
  };
} 