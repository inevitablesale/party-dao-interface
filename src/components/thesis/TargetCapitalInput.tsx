
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";
import { ethers } from "ethers";

interface TargetCapitalInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string[];
}

// Constants for validation
const MIN_TARGET_CAPITAL = 1000;
const MAX_TARGET_CAPITAL = 25000000;

// Helper to ensure the value fits in uint128
const MAX_UINT128 = ethers.BigNumber.from(2).pow(128).sub(1);

export const convertToWei = (amount: string): ethers.BigNumber => {
  if (!amount || isNaN(parseFloat(amount))) {
    throw new Error("Invalid amount");
  }
  
  const value = parseFloat(amount);
  const wholeAmount = Math.floor(value);
  
  if (wholeAmount < MIN_TARGET_CAPITAL) {
    throw new Error(`Minimum target capital is $${MIN_TARGET_CAPITAL.toLocaleString()}`);
  }
  if (wholeAmount > MAX_TARGET_CAPITAL) {
    throw new Error(`Maximum target capital is $${MAX_TARGET_CAPITAL.toLocaleString()}`);
  }
  
  try {
    const weiValue = ethers.utils.parseUnits(wholeAmount.toString(), 18);
    
    if (weiValue.gt(MAX_UINT128)) {
      console.error("Value exceeds uint128 max:", {
        weiValue: weiValue.toString(),
        maxUint128: MAX_UINT128.toString()
      });
      throw new Error("Amount too large for contract (exceeds uint128)");
    }

    console.log("Target capital conversion:", {
      inputAmount: amount,
      wholeAmount,
      weiValue: weiValue.toString(),
      weiValueHex: weiValue.toHexString(),
      fits_uint128: weiValue.lte(MAX_UINT128)
    });

    return weiValue;
  } catch (error) {
    console.error("Error converting to wei:", error);
    throw error;
  }
};

export const TargetCapitalInput = ({
  value,
  onChange,
  error
}: TargetCapitalInputProps) => {
  const formatValue = (val: string) => {
    // Remove all non-numeric characters except decimal point
    const numericValue = val.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    if (parts.length > 2) return value;
    // No decimals allowed
    if (parts.length > 1) {
      return parts[0];
    }
    return numericValue;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatValue(e.target.value);
    onChange(formattedValue);
  };

  const getHelperText = () => {
    if (!value) return "";
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "Please enter a valid number";
    if (numValue < MIN_TARGET_CAPITAL) {
      return `Minimum target capital is $${MIN_TARGET_CAPITAL.toLocaleString()}`;
    }
    if (numValue > MAX_TARGET_CAPITAL) {
      return `Maximum target capital is $${MAX_TARGET_CAPITAL.toLocaleString()}`;
    }
    return "";
  };

  const formatUSD = (val: string) => {
    const num = parseInt(val);
    if (isNaN(num)) return "";
    return `$${num.toLocaleString()}`;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-medium text-white mb-2 flex items-center gap-2">
          Target Capital
          <HelpCircle className="h-4 w-4 text-gray-400" />
        </Label>
        <div className="text-sm text-gray-400">
          {value && `Target: ${formatUSD(value)}`}
        </div>
      </div>
      <div className="relative">
        <Input
          type="text"
          placeholder="Enter target amount"
          className={cn(
            "bg-black/50 border-white/10 text-white placeholder:text-gray-500 pl-12",
            error ? "border-red-500" : ""
          )}
          value={value}
          onChange={handleChange}
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
      </div>
      {(error || getHelperText()) && (
        <p className="text-sm text-red-500">
          {error?.[0] || getHelperText()}
        </p>
      )}
    </div>
  );
};
