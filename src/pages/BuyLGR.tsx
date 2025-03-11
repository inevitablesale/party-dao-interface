import { useState, useEffect } from 'react';
import { useCustomWallet } from '@/hooks/useCustomWallet';
import { getWorkingProvider, getRdTokenContract } from '@/services/presaleContractService';
import { ethers } from 'ethers';

const BuyLGR = () => {
  const { address } = useCustomWallet();
  const [rdBalance, setRdBalance] = useState<string>("0");

  useEffect(() => {
    const fetchData = async () => {
      if (!address) return;
      
      try {
        const provider = await getWorkingProvider();
        const rdContract = await getRdTokenContract(provider);
        const balance = await rdContract.balanceOf(address);
        setRdBalance(ethers.utils.formatUnits(balance, 6));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [address]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Buy RD Tokens</h1>
      <div className="bg-gray-800 rounded-lg p-6">
        <p className="text-xl mb-4">Your RD Balance: {Number(rdBalance).toLocaleString()} RD</p>
        <div className="grid gap-4">
          <div className="p-4 bg-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Token Information</h2>
            <ul className="space-y-2">
              <li>Token Symbol: RD</li>
              <li>Price: $0.10 USD per RD</li>
              <li>Payment Method: USDC</li>
              <li>Network: Polygon (MATIC)</li>
            </ul>
          </div>
          
          <div className="p-4 bg-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">How to Buy</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Connect your wallet using the button in the top right</li>
              <li>Ensure you have USDC tokens on the Polygon network</li>
              <li>Use the floating widget in the bottom right to make your purchase</li>
              <li>Approve the USDC spend in your wallet</li>
              <li>Confirm the transaction to receive your RD tokens</li>
            </ol>
          </div>
          
          <div className="p-4 bg-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Need Help?</h2>
            <p>If you need assistance with purchasing RD tokens or have any questions, please contact our support team or visit our documentation for detailed guides.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyLGR;
