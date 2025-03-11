
import { Shield, FileText, Users, Check } from "lucide-react";
import { useProposalStats } from "@/hooks/useProposalStats";

interface GovernanceStatsProps {
  settlementId: string;
  compact?: boolean;
}

export const GovernanceStats = ({ settlementId, compact = false }: GovernanceStatsProps) => {
  const { data: stats, isLoading } = useProposalStats();
  
  if (isLoading) {
    return (
      <div className="animate-pulse flex space-x-2">
        <div className="h-4 bg-gray-700 rounded w-12"></div>
        <div className="h-4 bg-gray-700 rounded w-12"></div>
        <div className="h-4 bg-gray-700 rounded w-12"></div>
      </div>
    );
  }
  
  return (
    <div className={`grid ${compact ? 'grid-cols-2 gap-2' : 'grid-cols-4 gap-4'} mt-3`}>
      <div className={`bg-black/30 p-2 rounded flex items-center gap-2 ${compact ? 'text-xs' : 'text-sm'}`}>
        <Shield className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} text-blue-400`} />
        <div>
          <div className={`font-medium ${compact ? 'text-xs' : 'text-sm'}`}>{stats.totalHolders}</div>
          <div className={`text-gray-400 ${compact ? 'text-xs' : 'text-sm'}`}>Sentinels</div>
        </div>
      </div>
      
      <div className={`bg-black/30 p-2 rounded flex items-center gap-2 ${compact ? 'text-xs' : 'text-sm'}`}>
        <FileText className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} text-blue-400`} />
        <div>
          <div className={`font-medium ${compact ? 'text-xs' : 'text-sm'}`}>{stats.activeProposals}</div>
          <div className={`text-gray-400 ${compact ? 'text-xs' : 'text-sm'}`}>Active Props</div>
        </div>
      </div>
      
      <div className={`bg-black/30 p-2 rounded flex items-center gap-2 ${compact ? 'text-xs' : 'text-sm'} ${compact ? 'col-span-2' : ''}`}>
        <Check className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} text-green-400`} />
        <div>
          <div className={`font-medium ${compact ? 'text-xs' : 'text-sm'}`}>{stats.successRate.toFixed(0)}%</div>
          <div className={`text-gray-400 ${compact ? 'text-xs' : 'text-sm'}`}>Success Rate</div>
        </div>
      </div>
      
      {!compact && (
        <div className="bg-black/30 p-2 rounded flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-blue-400" />
          <div>
            <div className="font-medium text-sm">${stats.totalLockedValue.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Total Value</div>
          </div>
        </div>
      )}
    </div>
  );
};
