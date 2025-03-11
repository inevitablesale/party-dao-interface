
export type JobStatus = 'open' | 'filled' | 'completed' | 'cancelled';

export type JobCategory = 
  | 'settlement-building' 
  | 'resource-gathering' 
  | 'security' 
  | 'technology' 
  | 'governance' 
  | 'scouting' 
  | 'trading' 
  | 'protocol-development' 
  | 'waste-management' 
  | 'other';

export interface JobMetadata {
  title: string;
  description?: string;
  category: JobCategory;
  reward: string;
  deadline?: string;
  status?: JobStatus;
  creator?: string;
  settlement?: string;
  requirements?: string;
  location?: string;
  referralReward?: string;
  applicants?: string[];
}

export interface JobApplication {
  jobId: string;
  applicantAddress: string;
  timestamp: number;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
}

// Maps job status to proposal status for compatibility with the ProposalMetadata type
export const mapJobStatusToProposalStatus = (
  jobStatus: JobStatus
): 'active' | 'completed' | 'funded' | 'failed' => {
  switch (jobStatus) {
    case 'open':
      return 'active';
    case 'filled':
      return 'funded';
    case 'completed':
      return 'completed';
    case 'cancelled':
      return 'failed';
    default:
      return 'active';
  }
};

// Maps proposal status to job status for compatibility
export const mapProposalStatusToJobStatus = (
  proposalStatus: 'active' | 'completed' | 'funded' | 'failed'
): JobStatus => {
  switch (proposalStatus) {
    case 'active':
      return 'open';
    case 'funded':
      return 'filled';
    case 'completed':
      return 'completed';
    case 'failed':
      return 'cancelled';
    default:
      return 'open';
  }
};
