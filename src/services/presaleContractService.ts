
import { ethers } from "ethers";

export const RD_TOKEN_CONTRACT_ADDRESS = "0x81137573408bCD23f801A56D68268cc0CE5206B5";
export const USDC_CONTRACT_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Polygon USDC

// Simplified ABI for the new contract
export const RD_SALE_ABI = [
  "function buyTokens(uint256 usdcAmount) external",
  "function USDC() public view returns (address)",
  "function RD() public view returns (address)",
  "function treasury() public view returns (address)"
];

// ERC20 Interface for token balance checks
const ERC20_ABI = [
  "function balanceOf(address account) public view returns (uint256)",
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)",
  "function decimals() public view returns (uint8)"
];

// Array of RPC endpoints for redundancy
export const RPC_ENDPOINTS = [
  "https://polygon-rpc.com",
  "https://rpc-mainnet.matic.network",
  "https://matic-mainnet.chainstacklabs.com",
  "https://rpc-mainnet.maticvigil.com",
  "https://rpc-mainnet.matic.quiknode.pro"
];

export const getWorkingProvider = async () => {
  for (const rpc of RPC_ENDPOINTS) {
    try {
      const provider = new ethers.providers.JsonRpcProvider(rpc);
      await provider.getNetwork();
      return provider;
    } catch (error) {
      console.warn(`RPC ${rpc} failed, trying next one...`);
      continue;
    }
  }
  throw new Error("All RPC endpoints failed");
};

export const getRdTokenContract = async (provider: ethers.providers.Provider) => {
  return new ethers.Contract(RD_TOKEN_CONTRACT_ADDRESS, ERC20_ABI, provider);
};

export const getUsdcContract = async (provider: ethers.providers.Provider) => {
  return new ethers.Contract(USDC_CONTRACT_ADDRESS, ERC20_ABI, provider);
};

export const purchaseTokens = async (signer: ethers.Signer, usdcAmount: string) => {
  try {
    console.log('Starting token purchase with USDC amount:', usdcAmount);
    
    const usdcContract = await getUsdcContract(signer.provider!);
    
    // Convert USDC amount to wei (USDC has 6 decimals)
    const usdcAmountWei = ethers.utils.parseUnits(usdcAmount, 6);
    
    // First approve USDC spending
    console.log('Approving USDC...');
    const approveTx = await usdcContract.connect(signer).approve(RD_TOKEN_CONTRACT_ADDRESS, usdcAmountWei);
    await approveTx.wait();
    console.log('USDC approved');
    
    // Execute purchase transaction
    const contract = new ethers.Contract(RD_TOKEN_CONTRACT_ADDRESS, RD_SALE_ABI, signer);
    const tx = await contract.buyTokens(usdcAmountWei, {
      gasLimit: 500000
    });
    
    console.log('Purchase transaction submitted:', tx.hash);
    const receipt = await tx.wait();
    console.log('Purchase confirmed in block:', receipt.blockNumber);
    
    return {
      success: true,
      txHash: tx.hash,
      amount: ethers.utils.formatUnits(usdcAmountWei, 6)
    };
  } catch (error) {
    console.error('Error purchasing tokens:', error);
    throw error;
  }
};
