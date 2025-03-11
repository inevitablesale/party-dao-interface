
import React, { useState } from 'react';
import { useNFTRoles } from '@/hooks/useNFTRoles';
import { useJobs } from '@/hooks/useJobs';
import { JobsList } from './JobsList';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const JobsDashboard = () => {
  const { primaryRole } = useNFTRoles();
  const { 
    jobs, 
    isLoadingJobs, 
    createJob, 
    applyToJob,
    userRole 
  } = useJobs();
  const [activeTab, setActiveTab] = useState('browse');

  // Map jobs from the hook to include an ID property
  const formattedJobs = jobs.map(job => ({
    ...job,
    id: job.id || `job-${Math.random().toString(36).substr(2, 9)}`
  }));

  // Filter jobs for "My Jobs" tab (jobs created by the user or jobs applied to)
  const myJobs = formattedJobs.filter(job => 
    (job.creator && job.creator === userRole) || 
    (job.applicants && job.applicants.includes(userRole))
  );

  // Check if user is a Settlement Owner (Sentinel)
  const isSettlementOwner = primaryRole === 'Sentinel';

  return (
    <div className="container mx-auto p-4 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settlement Jobs</h1>
          <p className="text-gray-600">Find work or post jobs for settlement activities</p>
        </div>
        
        {isSettlementOwner && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0">Post a New Job</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create a New Job</DialogTitle>
                <DialogDescription>
                  Post a job for your settlement. Define the requirements, rewards, and terms.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Job creation form would go here */}
                <p className="text-center text-muted-foreground">
                  Job creation form will be implemented in a follow-up task
                </p>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="browse" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="browse">Browse Jobs</TabsTrigger>
          <TabsTrigger value="my-jobs">My Jobs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="space-y-4">
          <JobsList 
            jobs={formattedJobs} 
            userRole={primaryRole} 
            isLoading={isLoadingJobs} 
            onApply={applyToJob}
          />
        </TabsContent>
        
        <TabsContent value="my-jobs" className="space-y-4">
          <JobsList 
            jobs={myJobs} 
            userRole={primaryRole} 
            isLoading={isLoadingJobs} 
            onApply={applyToJob}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
