
import { useState, useEffect } from 'react';
import { useCustomWallet } from '@/hooks/useCustomWallet';
import { getWorkingProvider, getRdTokenContract } from '@/services/presaleContractService';
import { ethers } from 'ethers';

export const LGRWalletDisplay = () => {
  const { address } = useCustomWallet();
  const [rdBalance, setRdBalance] = useState<string>("0");

  useEffect(() => {
    const fetchBalances = async () => {
      if (!address) return;
      
      try {
        const provider = await getWorkingProvider();
        const rdContract = await getRdTokenContract(provider);
        const balance = await rdContract.balanceOf(address);
        setRdBalance(ethers.utils.formatUnits(balance, 6));
      } catch (error) {
        console.error("Error fetching RD balance:", error);
      }
    };

    fetchBalances();
    const interval = setInterval(fetchBalances, 30000);
    return () => clearInterval(interval);
  }, [address]);

  return (
    <div className="text-white">
      <span>RD Balance: {Number(rdBalance).toLocaleString()} RD</span>
    </div>
  );
};
