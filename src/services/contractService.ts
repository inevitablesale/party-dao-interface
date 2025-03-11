import { ethers } from "ethers";
import { uploadMetadataToPinata } from "./pinataService";
import { getGovernanceImageCID } from "@/utils/governancePowerMapping";

const CONTRACT_ADDRESS = "0x6527b171AF1c61AE43bf405ABe53861b0487A369";
const CONTRACT_ABI = [
  "function safeMint(address to, string memory metadataCID) public payable returns (uint256)",
  "function updateMetadataCID(uint256 tokenId, string memory newCID)",
  "function mintPrice() public view returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "event MetadataURIUpdated(uint256 indexed tokenId, string newURI)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

const PINATA_GATEWAY = "https://blue-shaggy-halibut-668.mypinata.cloud/ipfs/";
const PINATA_GATEWAY_TOKEN = "LxW7Vt1WCzQk4x7VPUWYizgTK5BXllL4JMUQVXMeZEPqSokovWPXI-jmwcFsZ3hs";

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
}

export const checkNFTOwnership = async (walletClient: any, address: string) => {
  try {
    console.log('Checking NFT ownership for address:', address);
    
    const provider = new ethers.providers.Web3Provider(walletClient, {
      name: 'unknown',
      chainId: 137 // Polygon Mainnet
    });
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    const balance = await contract.balanceOf(address);
    console.log('NFT balance:', balance.toString());
    
    return balance.gt(0);
  } catch (error) {
    console.error('Error checking NFT ownership:', error);
    return false;
  }
};

export const getMintPrice = async (walletClient: any) => {
  try {
    const provider = new ethers.providers.Web3Provider(walletClient, {
      name: 'unknown',
      chainId: 137
    });
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    const price = await contract.mintPrice();
    return price;
  } catch (error) {
    console.error('Error getting mint price:', error);
    throw error;
  }
};

export const mintNFT = async (walletClient: any, address: string, metadata: any) => {
  try {
    console.log('Starting NFT minting process with metadata:', metadata);
    
    const governancePowerAttr = metadata.attributes.find(
      (attr: { trait_type: string; value: string }) => 
      attr.trait_type === "Governance Power"
    );
    
    if (!governancePowerAttr) {
      throw new Error('Governance Power not found in metadata attributes');
    }

    const provider = new ethers.providers.Web3Provider(walletClient, {
      name: 'unknown',
      chainId: 137
    });
    
    // Enhanced image URL handling
    let imageUrl;
    if (metadata.profilePicCID) {
      console.log('Using LinkedIn profile picture with CID:', metadata.profilePicCID);
      imageUrl = `${PINATA_GATEWAY}${metadata.profilePicCID}?pinataGatewayToken=${PINATA_GATEWAY_TOKEN}`;
    } else {
      console.log('No profile picture found, using governance power image');
      const governanceImageCID = getGovernanceImageCID(governancePowerAttr.value);
      imageUrl = `${PINATA_GATEWAY}${governanceImageCID}?pinataGatewayToken=${PINATA_GATEWAY_TOKEN}`;
    }
    console.log('Final image URL:', imageUrl);

    const nftMetadata: NFTMetadata = {
      name: `${metadata.fullName}'s Professional NFT`,
      description: `This NFT represents the governance power level of ${metadata.fullName} based on their professional experience and qualifications.`,
      image: imageUrl,
      attributes: metadata.attributes
    };
    
    console.log('Preparing to upload metadata:', nftMetadata);
    const metadataUri = await uploadMetadataToPinata(nftMetadata);
    console.log('Metadata uploaded to IPFS:', metadataUri);
    
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    // Get mint price
    const mintPrice = await contract.mintPrice();
    console.log('Current mint price:', mintPrice.toString());

    // Extract CID from the IPFS URI (remove 'ipfs://' prefix)
    const metadataCid = metadataUri.replace('ipfs://', '');
    
    console.log('Minting NFT for address:', address);
    console.log('Using metadata CID:', metadataCid);

    // Mint with metadata CID and handle potential mint price
    const tx = await contract.safeMint(address, metadataCid, {
      value: mintPrice
    });
    console.log('Minting transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('Minting confirmed:', receipt);
    
    // Get tokenId from the Transfer event
    const mintEvent = receipt.events?.find(e => e.event === 'Transfer');
    const tokenId = mintEvent?.args?.tokenId;
    
    if (!tokenId) {
      throw new Error('Failed to get tokenId from minting event');
    }
    
    return { success: true, tokenId, tokenURI: metadataUri };
  } catch (error) {
    console.error('Minting failed:', error);
    throw error;
  }
};

interface MintedNFT {
  tokenId: string;
  owner: string;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: {
      trait_type: string;
      value: string;
    }[];
    experiences?: {
      title: string;
      company: string;
      duration: string;
      location: string;
    }[];
  };
}

export const getAllMintedNFTs = async (walletClient: any): Promise<MintedNFT[]> => {
  try {
    console.log('Fetching all minted NFTs...');
    
    const provider = new ethers.providers.Web3Provider(walletClient, {
      name: 'unknown',
      chainId: 137
    });
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    
    const filter = contract.filters.Transfer(
      '0x0000000000000000000000000000000000000000',
      null,
      null
    );
    
    console.log('Fetching Transfer events...');
    const events = await contract.queryFilter(filter);
    console.log(`Found ${events.length} minted NFTs`);
    
    const nfts: MintedNFT[] = await Promise.all(
      events.map(async (event) => {
        try {
          const tokenId = event.args?.tokenId.toString();
          const owner = await contract.ownerOf(tokenId);
          const tokenUri = await contract.tokenURI(tokenId);
          
          // Convert IPFS URI to Pinata gateway URL with authentication
          const ipfsHash = tokenUri.replace('ipfs://', '');
          const metadataUrl = `${PINATA_GATEWAY}${ipfsHash}?pinataGatewayToken=${PINATA_GATEWAY_TOKEN}`;
          
          console.log(`Fetching metadata for token ${tokenId} from ${metadataUrl}`);
          
          const response = await fetch(metadataUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch metadata: ${response.statusText}`);
          }

          const contentType = response.headers.get('content-type');
          let metadata;

          if (contentType?.includes('image/')) {
            console.log(`Token ${tokenId} URI points to an image, creating synthetic metadata`);
            // Create base metadata for image-only tokens
            metadata = {
              name: `LedgerFren NFT #${tokenId}`,
              description: "A Professional NFT in the LedgerFren Collection",
              image: metadataUrl,
              attributes: [
                {
                  trait_type: "Experience Level",
                  value: "Level 1"
                },
                {
                  trait_type: "Years in Practice",
                  value: "1-3 years"
                },
                {
                  trait_type: "Specialty",
                  value: "General Practice"
                },
                {
                  trait_type: "Client Base",
                  value: "Small Business"
                },
                {
                  trait_type: "Service Line Expertise",
                  value: "Tax"
                },
                {
                  trait_type: "Governance Power",
                  value: "Governance-Power-1"
                }
              ]
            };
          } else {
            metadata = await response.json();
            console.log(`Fetched metadata for token ${tokenId}:`, metadata);

            // Validate and ensure all required attributes are present with actual values
            const requiredAttributes = [
              "Experience Level",
              "Years in Practice",
              "Specialty",
              "Client Base",
              "Service Line Expertise",
              "Governance Power"
            ];

            // Add any missing attributes with "Unspecified" value
            metadata.attributes = metadata.attributes || [];
            requiredAttributes.forEach(attr => {
              if (!metadata.attributes.some(a => a.trait_type === attr)) {
                const defaultValue = attr === "Governance Power" ? "Governance-Power-1" : "Level 1";
                metadata.attributes.push({
                  trait_type: attr,
                  value: defaultValue
                });
              }
            });

            // Ensure image URL uses Pinata gateway
            if (metadata.image && metadata.image.startsWith('ipfs://')) {
              const imageHash = metadata.image.replace('ipfs://', '');
              metadata.image = `${PINATA_GATEWAY}${imageHash}?pinataGatewayToken=${PINATA_GATEWAY_TOKEN}`;
            }
          }
          
          return {
            tokenId,
            owner,
            metadata
          };
        } catch (error) {
          console.error(`Error processing token ${event.args?.tokenId.toString()}:`, error);
          // Return minimal metadata with default values
          return {
            tokenId: event.args?.tokenId.toString(),
            owner: await contract.ownerOf(event.args?.tokenId.toString()),
            metadata: {
              name: `LedgerFren NFT #${event.args?.tokenId.toString()}`,
              description: "Metadata temporarily unavailable",
              image: `${PINATA_GATEWAY}${getGovernanceImageCID("Governance-Power-1")}?pinataGatewayToken=${PINATA_GATEWAY_TOKEN}`,
              attributes: [
                {
                  trait_type: "Experience Level",
                  value: "Level 1"
                },
                {
                  trait_type: "Years in Practice",
                  value: "1-3 years"
                },
                {
                  trait_type: "Specialty",
                  value: "General Practice"
                },
                {
                  trait_type: "Client Base",
                  value: "Small Business"
                },
                {
                  trait_type: "Service Line Expertise",
                  value: "Tax"
                },
                {
                  trait_type: "Governance Power",
                  value: "Governance-Power-1"
                }
              ]
            }
          };
        }
      })
    );
    
    console.log('Successfully fetched all NFT data:', nfts);
    return nfts;
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    throw error;
  }
};
