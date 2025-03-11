
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { getAllMintedNFTs } from "@/services/contractService";
import NFTCollectionCard from "@/components/NFTCollectionCard";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const GovernanceVoting = () => {
  const { primaryWallet } = useDynamicContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [nfts, setNfts] = useState<Awaited<ReturnType<typeof getAllMintedNFTs>>>([]);

  useEffect(() => {
    const checkWallet = async () => {
      if (!primaryWallet || !(await primaryWallet.isConnected())) {
        navigate('/');
      }
    };
    checkWallet();
  }, [primaryWallet, navigate]);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!primaryWallet) return;
      
      try {
        setIsLoading(true);
        const walletClient = await primaryWallet.getWalletClient();
        const mintedNFTs = await getAllMintedNFTs(walletClient);
        setNfts(mintedNFTs);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
        toast({
          title: "Error Loading NFTs",
          description: "Failed to load the NFT collection. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTs();
  }, [primaryWallet, toast]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-white to-polygon-primary bg-clip-text text-transparent">
            Governance Board Elections
          </h1>
          <p className="text-center text-gray-400 mt-4">
            As a LedgerFren NFT holder, you can now vote for members to join the governance board.
            Below are all the NFTs in the collection representing our community members.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-xl bg-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : nfts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {nfts.map((nft) => (
              <NFTCollectionCard
                key={nft.tokenId}
                tokenId={nft.tokenId}
                owner={nft.owner}
                metadata={nft.metadata}
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center p-8 rounded-xl bg-white/5 border border-white/10">
            <p className="text-gray-400">
              No NFTs have been minted in the collection yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GovernanceVoting;
