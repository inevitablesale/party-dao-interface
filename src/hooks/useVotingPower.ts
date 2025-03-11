
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useNFTRoles } from "./useNFTRoles";
import { useNFTBalance } from "./useNFTBalance";

export interface VotingPowerInfo {
  votingPower: number;
  multiplier: number;
  baseVotingUnits: number;
  canVote: boolean;
  canPropose: boolean;
  canExecute: boolean;
  powerDetails: {
    sentinelPower: number;
    survivorPower: number;
    bountyHunterPower: number;
  };
}

export const useVotingPower = (): VotingPowerInfo => {
  const { primaryWallet } = useDynamicContext();
  const { primaryRole, isSentinel, isSurvivor, isBountyHunter } = useNFTRoles();
  const { data: nftBalanceData } = useNFTBalance(primaryWallet?.address);

  // Define power multipliers by role
  const sentinelMultiplier = 3;
  const survivorMultiplier = 2;
  const bountyHunterMultiplier = 1;

  // Calculate base units (number of NFTs owned)
  const baseVotingUnits = nftBalanceData?.balance || 0;

  // Calculate role-specific multiplier
  const getMultiplier = () => {
    if (isSentinel) return sentinelMultiplier;
    if (isSurvivor) return survivorMultiplier;
    if (isBountyHunter) return bountyHunterMultiplier;
    return 0;
  };

  // Calculate total voting power
  const multiplier = getMultiplier();
  const votingPower = baseVotingUnits * multiplier;

  // Calculate power details by type
  const powerDetails = {
    sentinelPower: isSentinel ? baseVotingUnits * sentinelMultiplier : 0,
    survivorPower: isSurvivor ? baseVotingUnits * survivorMultiplier : 0,
    bountyHunterPower: isBountyHunter ? baseVotingUnits * bountyHunterMultiplier : 0
  };

  // Determine governance capabilities
  const canVote = votingPower > 0;
  const canPropose = isSentinel || (baseVotingUnits >= 2 && (isSurvivor || isBountyHunter));
  const canExecute = isSentinel;

  return {
    votingPower,
    multiplier,
    baseVotingUnits,
    canVote,
    canPropose,
    canExecute,
    powerDetails
  };
};
