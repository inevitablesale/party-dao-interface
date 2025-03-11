
import { useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useWalletConnection } from "@/hooks/useWalletConnection";

export const WalletConnectionOverlay = () => {
  const { isConnected } = useWalletConnection();
  const location = useLocation();
  const pathArray = location.pathname.split('/');
  const isThesisRelatedPage = pathArray.includes('thesis');

  // Don't show overlay on any thesis-related pages or when connected
  if (isThesisRelatedPage || isConnected) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 space-y-4 text-center">
        <h2 className="text-2xl font-semibold text-white">Connect Wallet</h2>
        <p className="text-gray-400">
          Please connect your wallet to continue creating your proposal.
        </p>
        <Button variant="outline" className="w-full">
          Connect Wallet
        </Button>
        <button
          className="text-sm text-gray-500 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
