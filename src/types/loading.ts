
import { type LucideIcon } from "lucide-react";

export interface LoadingState {
  message: string;
  subtitle: string;
  progress: number;
  icon: LucideIcon;
}
