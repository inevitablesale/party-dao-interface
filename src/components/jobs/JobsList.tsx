
import React, { useState } from 'react';
import { JobCard } from './JobCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { JobMetadata } from '@/utils/settlementConversion';

interface JobsListProps {
  jobs: (JobMetadata & { id: string })[];
  userRole: string;
  isLoading: boolean;
  onApply: (jobId: string) => Promise<boolean>;
}

export const JobsList: React.FC<JobsListProps> = ({ 
  jobs, 
  userRole, 
  isLoading, 
  onApply 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [applyingJob, setApplyingJob] = useState<string | null>(null);

  const handleApply = async (jobId: string) => {
    setApplyingJob(jobId);
    try {
      const result = await onApply(jobId);
      return result;
    } finally {
      setApplyingJob(null);
    }
  };

  const categories = [...new Set(jobs.map(job => job.category))];
  
  const filteredJobs = jobs.filter(job => {
    // Search filter
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    
    // Category filter
    const matchesCategory = filterCategory === 'all' || job.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <Input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="filled">Filled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-48">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-medium">No jobs found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              userRole={userRole} 
              onApply={handleApply}
              isApplying={applyingJob === job.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};
