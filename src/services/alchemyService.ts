import { Network, Alchemy } from "alchemy-sdk";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";

// NFT Contract address for Resistance DAO
export const RESISTANCE_NFT_ADDRESS = "0xdD44d15f54B799e940742195e97A30165A1CD285";

// Define the supported NFT classes
export type NFTClass = 'Sentinel' | 'Survivor' | 'Bounty Hunter' | 'Unknown';

// Define the ResistanceNFT type
export interface ResistanceNFT {
  tokenId: string;
  class: NFTClass;
  name: string;
  description?: string;
  image?: string;
  animation_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

// Helper function to validate attribute structure
function isValidAttribute(attr: any): attr is { trait_type: string; value: string } {
  return (
    typeof attr === 'object' &&
    attr !== null &&
    'trait_type' in attr &&
    'value' in attr &&
    typeof attr.trait_type === 'string' &&
    typeof attr.value === 'string'
  );
}

// Initialize Alchemy SDK
const settings = {
  apiKey: "iTtNiAAH4RhVb4DGHCF4RgQ6xWCPLDN7",
  network: Network.MATIC_MAINNET
};

const alchemy = new Alchemy(settings);

// Create Viem client
const client = createPublicClient({
  chain: polygon,
  transport: http("https://polygon-mainnet.g.alchemy.com/v2/iTtNiAAH4RhVb4DGHCF4RgQ6xWCPLDN7"),
});

/**
 * Determines the NFT class from metadata attributes
 * @param attributes NFT metadata attributes
 * @returns The NFT class
 */
export const getNFTClassFromAttributes = (attributes: Array<{trait_type: string, value: string}>): NFTClass => {
  const classAttribute = attributes.find(attr => attr.trait_type === "Class");
  if (!classAttribute) return 'Unknown';
  
  switch (classAttribute.value) {
    case "Sentinel": return 'Sentinel';
    case "Survivor": return 'Survivor';
    case "Bounty Hunter": return 'Bounty Hunter';
    default: return 'Unknown';
  }
};

/**
 * Fetches all NFTs owned by an address
 * @param address Owner address
 * @returns Array of ResistanceNFT objects
 */
export const fetchNFTsForAddress = async (address: string): Promise<ResistanceNFT[]> => {
  try {
    console.log(`Fetching NFTs for address: ${address}`);
    
    const nftsResponse = await alchemy.nft.getNftsForOwner(address, {
      contractAddresses: [RESISTANCE_NFT_ADDRESS]
    });

    const nfts: ResistanceNFT[] = nftsResponse.ownedNfts.map(nft => {
      const rawAttributes = nft.rawMetadata?.attributes || [];
      const validAttributes = Array.isArray(rawAttributes) 
        ? rawAttributes.filter(isValidAttribute)
        : [];
      
      return {
        tokenId: nft.tokenId,
        class: getNFTClassFromAttributes(validAttributes),
        name: nft.title || `Resistance NFT #${nft.tokenId}`,
        description: nft.description,
        image: nft.media[0]?.gateway || undefined,
        animation_url: nft.media[1]?.gateway,
        attributes: validAttributes
      };
    });

    console.log(`Found ${nfts.length} NFTs for address ${address}`);
    return nfts;
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return [];
  }
};

/**
 * Checks if an address owns any Resistance NFTs
 * @param address Owner address
 * @returns boolean indicating ownership
 */
export const checkNFTOwnership = async (address: string): Promise<boolean> => {
  try {
    const nfts = await fetchNFTsForAddress(address);
    return nfts.length > 0;
  } catch (error) {
    console.error("Error checking NFT ownership:", error);
    return false;
  }
};

/**
 * Gets all roles an address has based on their NFTs
 * @param address Owner address
 * @returns Object with role boolean flags
 */
export const getAllRoles = async (address: string): Promise<{
  isSentinel: boolean;
  isSurvivor: boolean;
  isBountyHunter: boolean;
}> => {
  try {
    const nfts = await fetchNFTsForAddress(address);
    
    return {
      isSentinel: nfts.some(nft => nft.class === 'Sentinel'),
      isSurvivor: nfts.some(nft => nft.class === 'Survivor'),
      isBountyHunter: nfts.some(nft => nft.class === 'Bounty Hunter')
    };
  } catch (error) {
    console.error("Error getting roles:", error);
    return {
      isSentinel: false,
      isSurvivor: false,
      isBountyHunter: false
    };
  }
};

/**
 * Gets the primary role of an address based on their NFTs
 * @param address Owner address
 * @returns The primary NFT class
 */
export const getPrimaryRole = async (address: string): Promise<NFTClass> => {
  try {
    const nfts = await fetchNFTsForAddress(address);
    
    if (nfts.length === 0) return 'Unknown';
    
    // Priority: Sentinel > Bounty Hunter > Survivor
    if (nfts.some(nft => nft.class === 'Sentinel')) return 'Sentinel';
    if (nfts.some(nft => nft.class === 'Bounty Hunter')) return 'Bounty Hunter';
    if (nfts.some(nft => nft.class === 'Survivor')) return 'Survivor';
    
    return 'Unknown';
  } catch (error) {
    console.error("Error getting primary role:", error);
    return 'Unknown';
  }
};

/**
 * Gets the NFT balance for a specific contract
 * @param address Owner address
 * @param contractAddress NFT contract address
 * @returns Number of NFTs owned
 */
export const getNFTBalanceByContract = async (
  address: string, 
  contractAddress: string
): Promise<number> => {
  try {
    const nftsResponse = await alchemy.nft.getNftsForOwner(address, {
      contractAddresses: [contractAddress]
    });
    return nftsResponse.totalCount;
  } catch (error) {
    console.error("Error getting NFT balance:", error);
    return 0;
  }
};

/**
 * Process settlements with role-based permissions
 * @param settlements Array of settlements to process
 * @param userRole User's primary role
 * @returns Settlements with added permission flags
 */
export const processSettlementPermissions = (
  settlements: any[], 
  userRole: NFTClass
): any[] => {
  return settlements.map(settlement => {
    // Clone the settlement to avoid mutating the original
    const processedSettlement = { ...settlement };
    
    // Apply role-based permissions
    processedSettlement.canInvest = userRole === 'Sentinel';
    processedSettlement.canPropose = ['Sentinel', 'Survivor'].includes(userRole);
    processedSettlement.canVote = userRole !== 'Unknown';
    
    return processedSettlement;
  });
};
