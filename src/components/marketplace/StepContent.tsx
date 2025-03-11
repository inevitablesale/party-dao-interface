
import { useState } from 'react';
import { MintNFTForm } from './MintNFTForm';
import { useWalletConnection } from '@/hooks/useWalletConnection';

export const StepContent = () => {
  const [durationType, setDurationType] = useState<"" | "short-term" | "long-term">("");
  const { primaryWallet } = useWalletConnection();

  return (
    <div>
      <MintNFTForm wallet={primaryWallet} durationType={durationType} />
    </div>
  );
};
