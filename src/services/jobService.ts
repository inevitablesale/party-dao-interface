
import { uploadToIPFS } from "./ipfsService";
import { ethers } from "ethers";
import { IPFSContent } from "@/types/content";
import { JobMetadata, mapJobStatusToProposalStatus } from "@/types/jobs";
import { ProposalMetadata } from "@/types/proposals";

// Mock job data for testing
const mockJobs: { id: string; metadata: JobMetadata }[] = [
  {
    id: "job-1",
    metadata: {
      title: "Resource Gathering Mission",
      description: "Collect valuable resources from the wasteland for our settlement.",
      category: "resource-gathering",
      reward: "0.5 ETH",
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days from now
      status: "open",
      creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      settlement: "NewHaven",
      requirements: "Experience in navigating dangerous territory and identifying valuable resources.",
      location: "Eastern Wasteland",
      referralReward: "0.05 ETH",
      applicants: []
    }
  },
  {
    id: "job-2",
    metadata: {
      title: "Settlement Security Detail",
      description: "Provide security for our growing settlement against wasteland threats.",
      category: "security",
      reward: "0.3 ETH",
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days from now
      status: "open",
      creator: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      settlement: "FortHope",
      requirements: "Combat experience and security background required.",
      location: "FortHope Settlement",
      applicants: []
    }
  },
  {
    id: "job-3",
    metadata: {
      title: "Technology Salvage Operation",
      description: "Salvage pre-war technology from an abandoned research facility.",
      category: "technology",
      reward: "0.8 ETH",
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days from now
      status: "open",
      creator: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      settlement: "TechHaven",
      requirements: "Knowledge of pre-war technology and careful extraction methods.",
      location: "Abandoned Research Facility",
      referralReward: "0.08 ETH",
      applicants: []
    }
  },
  {
    id: "job-4",
    metadata: {
      title: "Protocol Development Task",
      description: "Help develop our settlement's communication protocol for secure messaging.",
      category: "protocol-development",
      reward: "0.6 ETH",
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days from now
      status: "open",
      creator: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      settlement: "DataSanctuary",
      requirements: "Coding experience and understanding of encryption protocols.",
      location: "Remote",
      applicants: []
    }
  }
];

/**
 * Fetch all available jobs
 */
export const fetchJobs = async (): Promise<{ id: string; metadata: JobMetadata }[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockJobs;
};

/**
 * Apply to a job
 * @param jobId - The ID of the job to apply to
 * @param applicantAddress - The address of the applicant
 */
export const applyToJob = async (
  jobId: string,
  applicantAddress: string
): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Find the job
  const job = mockJobs.find(j => j.id === jobId);
  if (!job) {
    console.error(`Job with ID ${jobId} not found`);
    return false;
  }
  
  // Check if already applied
  if (job.metadata.applicants?.includes(applicantAddress)) {
    console.error('You have already applied to this job');
    return false;
  }
  
  // Add applicant to the job
  if (!job.metadata.applicants) {
    job.metadata.applicants = [];
  }
  job.metadata.applicants.push(applicantAddress);
  
  return true;
};

/**
 * Create a new job
 * @param jobMetadata - The metadata for the new job
 * @param creatorAddress - The address of the job creator
 */
export const createJob = async (
  jobMetadata: JobMetadata,
  creatorAddress: string
): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create a new job ID
  const jobId = `job-${Date.now()}`;
  
  // Set the creator address
  jobMetadata.creator = creatorAddress;
  
  // Set default status if not provided
  if (!jobMetadata.status) {
    jobMetadata.status = "open";
  }
  
  // Initialize empty applicants array
  if (!jobMetadata.applicants) {
    jobMetadata.applicants = [];
  }
  
  // Add the job to mock data
  mockJobs.push({
    id: jobId,
    metadata: jobMetadata
  });
  
  return jobId;
};

/**
 * Upload job data to IPFS
 * @param jobMetadata - The job metadata to upload
 */
export const uploadJobToIPFS = async (
  jobMetadata: JobMetadata
): Promise<string> => {
  try {
    // Convert JobMetadata to ProposalMetadata format for IPFS
    const convertedMetadata: ProposalMetadata = {
      title: jobMetadata.title,
      description: jobMetadata.description,
      category: jobMetadata.category,
      votingDuration: 0, // Default value, not applicable for jobs
      linkedInURL: "", // Default value, not applicable for jobs
      status: mapJobStatusToProposalStatus(jobMetadata.status || "open"),
      submissionTimestamp: Date.now(),
      submitter: jobMetadata.creator,
    };
    
    // Create IPFS content structure
    const content: IPFSContent = {
      contentSchema: "job-v1",
      contentType: "job",
      title: jobMetadata.title,
      content: jobMetadata.description || "",
      metadata: {
        ...jobMetadata,
        // Add any additional metadata for IPFS storage
      },
    };
    
    // Upload to IPFS
    const ipfsHash = await uploadToIPFS(content);
    return ipfsHash;
  } catch (error) {
    console.error("Error uploading job to IPFS:", error);
    throw error;
  }
};

/**
 * Update job status
 * @param jobId - The ID of the job to update
 * @param status - The new status
 */
export const updateJobStatus = async (
  jobId: string,
  status: "open" | "filled" | "completed" | "cancelled"
): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Find the job
  const job = mockJobs.find(j => j.id === jobId);
  if (!job) {
    console.error(`Job with ID ${jobId} not found`);
    return false;
  }
  
  // Update status
  job.metadata.status = status;
  
  return true;
};

/**
 * Get job details
 * @param jobId - The ID of the job to retrieve
 */
export const getJobDetails = async (
  jobId: string
): Promise<{ id: string; metadata: JobMetadata } | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Find the job
  const job = mockJobs.find(j => j.id === jobId);
  if (!job) {
    console.error(`Job with ID ${jobId} not found`);
    return null;
  }
  
  return job;
};
