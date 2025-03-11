
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";
import { useWalletProvider } from "./useWalletProvider";
import { uploadToIPFS } from "@/services/ipfsService";

// Contract addresses on Polygon
const NFT_CONTRACT_ADDRESS = "0xd3F9cA9d44728611dA7128ec71E40D0314FCE89C";
const USDC_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const MINT_PRICE = ethers.utils.parseUnits("50", 6); // 50 USDC with 6 decimals

const NFT_ABI = [
  "function mintNFT(string calldata tokenURI) external",
  "function safeMint(address recipient, string memory tokenURI) public",
  "function bulkMint(address[] calldata recipients, string[] calldata tokenURIs) external",
  "function owner() view returns (address)",
  "function tokenCounter() view returns (uint256)",
  "function MINT_PRICE() view returns (uint256)",
  "function treasury() view returns (address)",
  "function USDC_TOKEN() view returns (address)",
  "function balanceOf(address owner) view returns (uint256)",
  "event NFTMinted(address indexed recipient, uint256 indexed tokenId, string tokenURI)"
];

const USDC_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

export const useNFTMinting = () => {
  const [isApproving, setIsApproving] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const { toast } = useToast();
  const { getProvider } = useWalletProvider();

  // Memoized owner check function that doesn't set state
  const checkOwnerStatus = useCallback(async () => {
    try {
      const provider = await getProvider();
      if (!provider?.provider) return false;

      const signer = provider.provider.getSigner();
      const address = await signer.getAddress();
      
      const nftContract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_ABI,
        provider.provider
      );
      
      const ownerAddress = await nftContract.owner();
      return address.toLowerCase() === ownerAddress.toLowerCase();
    } catch (error) {
      console.error("Error checking owner:", error);
      return false;
    }
  }, [getProvider]);

  // Effect to update isOwner state once
  useEffect(() => {
    let mounted = true;

    const updateOwnerStatus = async () => {
      const status = await checkOwnerStatus();
      if (mounted) {
        setIsOwner(status);
      }
    };

    updateOwnerStatus();

    return () => {
      mounted = false;
    };
  }, [checkOwnerStatus]);

  const checkUSDCApproval = async (address: string): Promise<boolean> => {
    try {
      const provider = await getProvider();
      if (!provider?.provider) return false;

      const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, provider.provider);
      const allowance = await usdcContract.allowance(address, NFT_CONTRACT_ADDRESS);
      return allowance.gte(MINT_PRICE);
    } catch (error) {
      console.error("Error checking USDC approval:", error);
      return false;
    }
  };

  const getUSDCBalance = async (address: string): Promise<string> => {
    try {
      const provider = await getProvider();
      if (!provider?.provider) return "0";

      const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, provider.provider);
      const balance = await usdcContract.balanceOf(address);
      return ethers.utils.formatUnits(balance, 6);
    } catch (error) {
      console.error("Error getting USDC balance:", error);
      return "0";
    }
  };

  const approveUSDC = async () => {
    setIsApproving(true);
    try {
      const provider = await getProvider();
      if (!provider?.provider) throw new Error("No provider available");

      const usdcContract = new ethers.Contract(
        USDC_ADDRESS,
        USDC_ABI,
        provider.provider.getSigner()
      );

      const tx = await usdcContract.approve(NFT_CONTRACT_ADDRESS, MINT_PRICE);
      await tx.wait();
      
      return true;
    } catch (error) {
      console.error("Error approving USDC:", error);
      toast({
        title: "Approval Failed",
        description: "Failed to approve USDC spending. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsApproving(false);
    }
  };

  const createNFTMetadata = async (isCoreTeam: boolean) => {
    const metadata = {
      contentSchema: "nft-1.0.0",
      contentType: "nft",
      title: "Resistance DAO Member NFT",
      description: "Exclusive NFT for Resistance DAO members. Grants access to DAO governance, voting rights, and 2.5% shared rewards from all launched projects.",
      content: JSON.stringify({
        name: "Resistance DAO Member",
        image: "https://gateway.pinata.cloud/ipfs/bafybeifpkqs6hubctlfnk7fv4v27ot4rrr4szmgr7p5alwwiisylfakpbi",
        external_link: "http://resistancedao.xyz/",
        seller_fee_basis_points: 250,
        fee_recipient: "0x386f47AE974255c9486A2D4B91a3694E95A1EE81",
        attributes: [
          {
            trait_type: "Member Type",
            value: isCoreTeam ? "Core Member" : "Member"
          },
          {
            trait_type: "Join Date",
            value: new Date().toISOString().split('T')[0]
          },
          {
            trait_type: "Collection",
            value: "Resistance DAO Genesis"
          }
        ]
      }),
      metadata: {
        author: "Resistance DAO",
        publishedAt: Date.now(),
        version: 1,
        language: "en",
        tags: ["membership", "dao", "nft"],
        coverImage: "https://gateway.pinata.cloud/ipfs/bafybeifpkqs6hubctlfnk7fv4v27ot4rrr4szmgr7p5alwwiisylfakpbi"
      }
    };

    console.log('Uploading NFT metadata to IPFS:', JSON.stringify(metadata, null, 2));
    const ipfsHash = await uploadToIPFS(metadata);
    console.log('Metadata uploaded to IPFS with hash:', ipfsHash);
    return `ipfs://${ipfsHash}`;
  };

  const ownerMint = async (recipient: string) => {
    setIsMinting(true);
    try {
      const provider = await getProvider();
      if (!provider?.provider) throw new Error("No provider available");

      const signer = provider.provider.getSigner();
      const nftContract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_ABI,
        signer
      );

      const metadataUri = await createNFTMetadata(true);
      console.log("Owner minting with metadata URI:", metadataUri);
      
      const tx = await nftContract.safeMint(recipient, metadataUri);
      const receipt = await tx.wait();
      
      const mintEvent = receipt.events?.find((e: any) => e.event === 'NFTMinted');
      if (!mintEvent) {
        throw new Error('Mint event not found in transaction receipt');
      }

      return true;
    } catch (error) {
      console.error("Error in owner mint:", error);
      throw error;
    } finally {
      setIsMinting(false);
    }
  };

  const mintNFT = async () => {
    setIsMinting(true);
    try {
      const provider = await getProvider();
      if (!provider?.provider) throw new Error("No provider available");

      const signer = provider.provider.getSigner();
      const address = await signer.getAddress();
      
      // Use the cached owner status instead of checking again
      if (isOwner) {
        console.log("Using cached owner status - Owner detected, using safeMint");
        return await ownerMint(address);
      }

      console.log("Regular user, proceeding with USDC payment mint");
      const nftContract = new ethers.Contract(
        NFT_CONTRACT_ADDRESS,
        NFT_ABI,
        signer
      );

      const metadataUri = await createNFTMetadata(false);
      console.log("Minting with metadata URI:", metadataUri);
      
      const tx = await nftContract.mintNFT(metadataUri);
      const receipt = await tx.wait();
      
      const mintEvent = receipt.events?.find((e: any) => e.event === 'NFTMinted');
      if (!mintEvent) {
        throw new Error('Mint event not found in transaction receipt');
      }

      return true;
    } catch (error) {
      console.error("Error minting NFT:", error);
      throw error;
    } finally {
      setIsMinting(false);
    }
  };

  return {
    isApproving,
    isMinting,
    isOwner,
    checkUSDCApproval,
    getUSDCBalance,
    approveUSDC,
    mintNFT,
    ownerMint,
    MINT_PRICE: "50",
  };
};
