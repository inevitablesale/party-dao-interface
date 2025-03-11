
import { ethers } from "ethers";

export class GasOptimizationService {
  public async optimizeGasLimit(
    estimatedGas: ethers.BigNumber
  ): Promise<ethers.BigNumber> {
    // Add 50% buffer for complex transactions
    return estimatedGas.mul(150).div(100);
  }

  public async getOptimizedGasPrice(
    provider: ethers.providers.Provider
  ): Promise<{ maxFeePerGas: ethers.BigNumber; maxPriorityFeePerGas: ethers.BigNumber }> {
    try {
      const feeData = await provider.getFeeData();
      
      // Use network values if available, otherwise use our increased defaults
      const baseGasPrice = feeData.lastBaseFeePerGas || ethers.utils.parseUnits('50', 'gwei');
      const priorityFee = feeData.maxPriorityFeePerGas || ethers.utils.parseUnits('5', 'gwei');

      // For complex transactions like contract deployments, we increase the priority fee
      const isComplexTransaction = true; // We can make this dynamic later if needed
      const adjustedPriorityFee = isComplexTransaction 
        ? priorityFee.mul(2) 
        : priorityFee;

      // maxFeePerGas = (baseFee * 2) + priorityFee as per EIP-1559
      const maxFeePerGas = baseGasPrice.mul(2).add(adjustedPriorityFee);

      console.log('Optimized gas parameters:', {
        baseFee: ethers.utils.formatUnits(baseGasPrice, 'gwei'),
        priorityFee: ethers.utils.formatUnits(adjustedPriorityFee, 'gwei'),
        maxFee: ethers.utils.formatUnits(maxFeePerGas, 'gwei')
      });

      return {
        maxFeePerGas,
        maxPriorityFeePerGas: adjustedPriorityFee
      };
    } catch (error) {
      console.error('Error optimizing gas price:', error);
      // Fallback to higher default values if fee data fetch fails
      return {
        maxFeePerGas: ethers.utils.parseUnits('100', 'gwei'),
        maxPriorityFeePerGas: ethers.utils.parseUnits('10', 'gwei')
      };
    }
  }
}

export const gasOptimizer = new GasOptimizationService();
