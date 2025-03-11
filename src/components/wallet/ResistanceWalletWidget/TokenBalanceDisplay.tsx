
import { Coins } from "lucide-react";

interface TokenBalanceDisplayProps {
  symbol: string;
  balance: string;
  iconUrl?: string;
  className?: string;
}

export const TokenBalanceDisplay = ({ symbol, balance, iconUrl, className = "" }: TokenBalanceDisplayProps) => {
  const formattedBalance = Number(balance).toLocaleString(undefined, { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  });

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
          {iconUrl ? (
            <img 
              src={iconUrl}
              alt={symbol}
              className="w-5 h-5"
            />
          ) : (
            <Coins className="w-5 h-5 text-blue-400" />
          )}
        </div>
        <span className="text-white">{symbol}</span>
      </div>
      <div className="text-right">
        <div className="text-white font-medium">
          {formattedBalance} {symbol}
        </div>
        {symbol === 'RD' && (
          <div className="text-sm text-gray-400">
            ${formattedBalance} USD
          </div>
        )}
      </div>
    </div>
  );
};
