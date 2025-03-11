
import { Database, Link, Shield, Server } from "lucide-react";
import { LoadingState } from "@/types/loading";

export const loadingStates: LoadingState[] = [
  {
    message: "Connecting to Blockchain",
    subtitle: "Accessing Smart Contract",
    progress: 20,
    icon: Database
  },
  {
    message: "Loading Proposal Details",
    subtitle: "Fetching from IPFS",
    progress: 40,
    icon: Link
  },
  {
    message: "Verifying Investment Data",
    subtitle: "Checking On-Chain Status",
    progress: 60,
    icon: Shield
  },
  {
    message: "Syncing Secure Wallet",
    subtitle: "Calculating Commitments",
    progress: 80,
    icon: Server
  },
  {
    message: "Finalizing Details",
    subtitle: "Almost Ready",
    progress: 100,
    icon: Database
  }
];
