
import { z } from "zod";
import { MIN_VOTING_DURATION, MAX_VOTING_DURATION } from "@/lib/constants";

export const settlementSchema = z.object({
  title: z.string().min(2, {
    message: "Thesis title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  category: z.string().min(2, {
    message: "Category must be at least 2 characters.",
  }),
  external_url: z.string().url({
    message: "Please enter a valid project URL.",
  }),
  image: z.string().min(1, {
    message: "Project image is required.",
  }),
  investment: z.object({
    targetCapital: z.string().min(1, {
      message: "Target capital is required."
    }),
    description: z.string().min(10, {
      message: "Investment description must be at least 10 characters.",
    }),
  }),
  fundingBreakdown: z.array(z.object({
    category: z.string(),
    amount: z.string()
  })).optional(),
  team: z.array(z.object({
    name: z.string(),
    role: z.string(),
    linkedin: z.string().url().optional(),
    github: z.string().url().optional(),
  })).optional(),
  votingDuration: z.number().min(MIN_VOTING_DURATION, {
    message: "Voting duration must be at least 7 days.",
  }).max(MAX_VOTING_DURATION, {
    message: "Voting duration cannot exceed 90 days.",
  }),
  linkedInURL: z.string().url({
    message: "Please enter a valid LinkedIn URL.",
  }),
  blockchain: z.array(z.string()).optional(),
  socials: z.object({
    twitter: z.string().url().optional(),
    discord: z.string().url().optional(),
    telegram: z.string().url().optional(),
  }).optional(),

  // Party specific fields
  partyName: z.string().min(5, {
    message: "Party name must be at least 5 characters.",
  }),
  allowPublicProposals: z.boolean().default(true),
  minContribution: z.string().min(1, {
    message: "Minimum contribution is required."
  }),
  maxContribution: z.string().min(1, {
    message: "Maximum contribution is required."
  }),
  crowdfundDuration: z.number().min(1 * 24 * 60 * 60, {
    message: "Crowdfund duration must be at least 1 day."
  }),
  passThresholdBps: z.number().min(1000, {
    message: "Threshold must be at least 10%."
  }).max(9000, {
    message: "Threshold cannot exceed 90%."
  })
});

export type SettlementFormValues = z.infer<typeof settlementSchema>;
