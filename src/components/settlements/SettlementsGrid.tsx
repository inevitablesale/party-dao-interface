
import React, { useEffect, useState } from 'react';
import { SettlementCard } from './SettlementCard';
import { ProposalEvent } from '@/types/proposals';
import { Settlement, convertProposalsToSettlements } from '@/utils/settlementConversion';
import { useNFTRoles } from '@/hooks/useNFTRoles';
import { processSettlementPermissions } from '@/services/alchemyService';

interface SettlementsGridProps {
  settlements: ProposalEvent[] | Settlement[];
  isLoading?: boolean;
  title?: string;
  formatUSDAmount?: (amount: string) => string;
  className?: string;
}

export const SettlementsGrid: React.FC<SettlementsGridProps> = ({ 
  settlements, 
  isLoading = false,
  title = "Active Settlements",
  formatUSDAmount = (amount) => `$${parseFloat(amount).toLocaleString()}`,
  className = ""
}) => {
  const { primaryRole, isLoading: isLoadingRoles } = useNFTRoles();
  const [processedSettlements, setProcessedSettlements] = useState<Settlement[]>([]);
  
  useEffect(() => {
    // Convert ProposalEvent[] to Settlement[] if needed
    const settlementData = Array.isArray(settlements) && settlements.length > 0 && 'tokenId' in settlements[0] 
      ? convertProposalsToSettlements(settlements as ProposalEvent[], primaryRole)
      : settlements as Settlement[];
    
    // Process settlements with role-based permissions
    const processed = processSettlementPermissions(settlementData, primaryRole);
    setProcessedSettlements(processed);
  }, [settlements, primaryRole]);

  if (isLoading || isLoadingRoles) {
    return (
      <div className={`bg-black/60 p-6 rounded-xl border border-toxic-neon/30 ${className}`}>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-toxic-neon/20 rounded-md w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-toxic-neon/10 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!processedSettlements || processedSettlements.length === 0) {
    return (
      <div className={`bg-black/60 p-6 rounded-xl border border-toxic-neon/30 text-center py-12 ${className}`}>
        <h3 className="text-xl text-toxic-neon mb-2">No Settlements Found</h3>
        <p className="text-white/60">There are no active settlements at this time.</p>
      </div>
    );
  }

  return (
    <div className={`bg-black/60 p-6 rounded-xl border border-toxic-neon/30 ${className}`}>
      <h2 className="text-2xl font-mono text-toxic-neon mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processedSettlements.map((settlement) => (
          <SettlementCard 
            key={settlement.id}
            settlement={settlement}
            formatUSDAmount={formatUSDAmount}
          />
        ))}
      </div>
    </div>
  );
};
