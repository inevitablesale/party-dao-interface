
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from 'date-fns';
import { JobMetadata } from '@/utils/settlementConversion';
import { JobCategoryIcon } from './JobCategoryIcon';

interface JobCardProps {
  job: JobMetadata & { id: string };
  userRole: string;
  onApply?: (jobId: string) => Promise<boolean>;
  isApplying?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  userRole, 
  onApply,
  isApplying = false
}) => {
  const handleApply = async () => {
    if (onApply) {
      await onApply(job.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500';
      case 'filled': return 'bg-blue-500';
      case 'completed': return 'bg-purple-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDeadline = () => {
    if (!job.deadline) return 'No deadline';
    return formatDistance(new Date(job.deadline), new Date(), { addSuffix: true });
  };

  const canApply = userRole === 'Bounty Hunter' && job.status === 'open';

  return (
    <Card className="overflow-hidden border border-slate-200 h-full flex flex-col hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <JobCategoryIcon category={job.category as any} className="h-8 w-8 text-primary" />
          <Badge className={`${getStatusColor(job.status || 'open')} text-white`}>
            {job.status || 'Open'}
          </Badge>
        </div>
        <CardTitle className="text-xl">{job.title}</CardTitle>
        <CardDescription className="flex justify-between items-center">
          <span>Reward: {job.reward}</span>
          <span className="text-sm text-muted-foreground">Deadline: {formatDeadline()}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-slate-600 line-clamp-4">{job.description}</p>
        {job.referralReward && (
          <div className="mt-2 text-sm text-purple-600">
            Referral reward: {job.referralReward}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t bg-slate-50 p-4">
        <div className="w-full flex justify-between items-center">
          <span className="text-xs text-slate-500">
            Created by: {job.creator ? job.creator.substring(0, 6) + '...' + job.creator.substring(job.creator.length - 4) : 'Unknown'}
          </span>
          {canApply && (
            <Button 
              onClick={handleApply} 
              disabled={isApplying}
              className="bg-primary hover:bg-primary/90"
            >
              {isApplying ? 'Applying...' : 'Apply'}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
