import { useCallback, useState } from 'react';
import { ethers } from 'ethers';
import { useWalletConnection } from './useWalletConnection';
import { usePartyContracts } from './usePartyContracts';

const CONTRIBUTION_ROUTER_ABI = [
  'function contribute(address party, address contributor) payable external returns (uint96)',
  'function contributeERC20(address party, address contributor, address token, uint256 amount) external returns (uint96)',
  'function batchContributeERC20(address[] calldata parties, address[] calldata contributors, address[] calldata tokens, uint256[] calldata amounts) external returns (uint96[] memory)',
  'event ContributionRouted(address indexed party, address indexed contributor, uint96 amount)'
];

interface ContributionRouterError extends Error {
  code?: string;
  reason?: string;
  transaction?: any;
}

export function useContributionRouter() {
  const { provider } = useWalletConnection();
  const { ContributionRouter: routerAddress } = usePartyContracts();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ContributionRouterError | null>(null);

  const contribute = useCallback(async (partyAddress: string, amount: ethers.BigNumber) => {
    if (!provider) throw new Error('Provider not available');
    if (!ethers.utils.isAddress(routerAddress)) throw new Error('Invalid router address');
    if (!ethers.utils.isAddress(partyAddress)) throw new Error('Invalid party address');
    
    setLoading(true);
    setError(null);

    try {
      const signer = provider.getSigner();
      const router = new ethers.Contract(routerAddress, CONTRIBUTION_ROUTER_ABI, signer);

      const tx = await router.contribute(partyAddress, await signer.getAddress(), {
        value: amount
      });

      const receipt = await tx.wait();
      const contributionEvent = receipt.events?.find(e => e.event === 'ContributionRouted');
      if (!contributionEvent) throw new Error('Contribution event not found');

      return contributionEvent.args.amount;
    } catch (err: any) {
      const error: ContributionRouterError = new Error(err.reason || 'Failed to contribute');
      error.code = err.code;
      error.reason = err.reason;
      error.transaction = err.transaction;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [provider, routerAddress]);

  const contributeERC20 = useCallback(async (
    partyAddress: string,
    tokenAddress: string,
    amount: ethers.BigNumber
  ) => {
    if (!provider) throw new Error('Provider not available');
    if (!ethers.utils.isAddress(routerAddress)) throw new Error('Invalid router address');
    if (!ethers.utils.isAddress(partyAddress)) throw new Error('Invalid party address');
    if (!ethers.utils.isAddress(tokenAddress)) throw new Error('Invalid token address');
    
    setLoading(true);
    setError(null);

    try {
      const signer = provider.getSigner();
      const router = new ethers.Contract(routerAddress, CONTRIBUTION_ROUTER_ABI, signer);

      // First approve the router to spend tokens
      const token = new ethers.Contract(
        tokenAddress,
        ['function approve(address spender, uint256 amount) external returns (bool)'],
        signer
      );
      const approveTx = await token.approve(routerAddress, amount);
      await approveTx.wait();

      const tx = await router.contributeERC20(
        partyAddress,
        await signer.getAddress(),
        tokenAddress,
        amount
      );

      const receipt = await tx.wait();
      const contributionEvent = receipt.events?.find(e => e.event === 'ContributionRouted');
      if (!contributionEvent) throw new Error('Contribution event not found');

      return contributionEvent.args.amount;
    } catch (err: any) {
      const error: ContributionRouterError = new Error(err.reason || 'Failed to contribute ERC20');
      error.code = err.code;
      error.reason = err.reason;
      error.transaction = err.transaction;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [provider, routerAddress]);

  return {
    contribute,
    contributeERC20,
    loading,
    error
  };
} 