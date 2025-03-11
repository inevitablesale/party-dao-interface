import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { shortenAddress, getTokenTransferStatusMessage, getTokenTransferProgress } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import type { TokenTransferStatus } from '@/lib/utils';

interface TokenTransferStatusProps {
  status: TokenTransferStatus;
  currentAmount: string;
  targetAmount: string;
  holdingAddress: string;
  missingTokens?: string[];
  onVerify?: () => void;
  onActivate?: () => void;
}

const TokenTransferStatusDisplay: React.FC<TokenTransferStatusProps> = ({
  status,
  currentAmount,
  targetAmount,
  holdingAddress,
  missingTokens = [],
  onVerify,
  onActivate
}) => {
  const statusMessage = getTokenTransferStatusMessage(status);
  const progress = getTokenTransferProgress(Number(currentAmount), Number(targetAmount));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Token Transfer Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          {status === 'verifying' || status === 'awaiting_tokens' ? (
            <Spinner />
          ) : status === 'completed' ? (
            <CheckCircle2 className="text-green-500 h-6 w-6" />
          ) : (
            <AlertCircle className="text-red-500 h-6 w-6" />
          )}
          <p>{statusMessage}</p>
        </div>
        <Progress value={progress} className="mt-2" />
        <p className="text-sm text-muted-foreground mt-1">
          {currentAmount} / {targetAmount}
        </p>
        {missingTokens.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium">Missing Tokens:</p>
            <ul className="list-disc pl-4 text-sm text-red-500">
              {missingTokens.map((token, index) => (
                <li key={index}>{token}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            Holding Address: {shortenAddress(holdingAddress)}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {onVerify && status !== 'completed' && (
          <Button onClick={onVerify} disabled={status === 'verifying'}>
            {status === 'verifying' ? 'Verifying...' : 'Verify Tokens'}
          </Button>
        )}
        {onActivate && status === 'completed' && (
          <Button onClick={onActivate}>
            Activate Bounty <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TokenTransferStatusDisplay;
