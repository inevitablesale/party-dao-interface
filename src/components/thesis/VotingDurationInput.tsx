
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

interface VotingDurationInputProps {
  value: number;
  onChange: (value: number[]) => void;
  error?: string[];
}

const MIN_VOTING_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds
const MAX_VOTING_DURATION = 90 * 24 * 60 * 60; // 90 days in seconds

export const VotingDurationInput = ({
  value,
  onChange,
  error
}: VotingDurationInputProps) => {
  const getDurationText = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    if (days === 7) return "1 week";
    if (days === 14) return "2 weeks";
    if (days === 30) return "1 month";
    if (days === 60) return "2 months";
    if (days === 90) return "3 months";
    return `${days} days`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-lg font-medium text-white flex items-center gap-2">
            Voting Duration
            <HelpCircle className="h-4 w-4 text-gray-400" />
          </Label>
          <p className="text-sm text-gray-400">Set how long the community can vote on your thesis</p>
        </div>
        <motion.div 
          className="text-right"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          key={value}
        >
          <span className="text-2xl font-bold text-white">
            {getDurationText(value)}
          </span>
        </motion.div>
      </div>
      <Slider
        value={[value]}
        min={MIN_VOTING_DURATION}
        max={MAX_VOTING_DURATION}
        step={24 * 60 * 60} // 1 day steps
        className="w-full"
        onValueChange={onChange}
        defaultValue={[MAX_VOTING_DURATION]} // Set default to 90 days
      />
      <div className="flex justify-between text-sm text-gray-400">
        <span>7 days (min)</span>
        <span>90 days (max)</span>
      </div>
      {error && (
        <p className="text-sm text-red-500">{error[0]}</p>
      )}
    </div>
  );
};
