
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PARTY_PROTOCOL } from "@/lib/constants";

interface PartySettingsSectionProps {
  register: any;
  watch: any;
  errors: any;
}

export const PartySettingsSection = ({ register, watch, errors }: PartySettingsSectionProps) => {
  return (
    <div className="bg-[#111] rounded-xl border border-white/5 p-6">
      <div className="flex items-center gap-2 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
          <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7H2Z"></path>
        </svg>
        <h2 className="text-lg font-medium">Party Settings</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="partyName">Settlement Party Name</Label>
          <Input
            id="partyName"
            {...register("partyName")}
            placeholder="Enter your settlement party name"
            className="mt-2 bg-black/50 border-white/10"
          />
          {errors.partyName && (
            <p className="text-red-400 text-sm mt-1">{errors.partyName.message}</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minContribution">Minimum Contribution (ETH)</Label>
            <Input
              id="minContribution"
              {...register("minContribution")}
              placeholder="0.1"
              className="mt-2 bg-black/50 border-white/10"
            />
            {errors.minContribution && (
              <p className="text-red-400 text-sm mt-1">{errors.minContribution.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="maxContribution">Maximum Contribution (ETH)</Label>
            <Input
              id="maxContribution"
              {...register("maxContribution")}
              placeholder="100"
              className="mt-2 bg-black/50 border-white/10"
            />
            {errors.maxContribution && (
              <p className="text-red-400 text-sm mt-1">{errors.maxContribution.message}</p>
            )}
          </div>
        </div>
        
        <div>
          <Label htmlFor="crowdfundDuration">Crowdfund Duration (days)</Label>
          <Input
            id="crowdfundDuration"
            type="number"
            {...register("crowdfundDuration", { 
              valueAsNumber: true,
              setValueAs: (v: string) => parseInt(v) * 24 * 60 * 60 // Convert days to seconds
            })}
            placeholder="14"
            className="mt-2 bg-black/50 border-white/10"
          />
          {errors.crowdfundDuration && (
            <p className="text-red-400 text-sm mt-1">{errors.crowdfundDuration.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="passThresholdBps">Governance Approval Threshold (%)</Label>
          <Input
            id="passThresholdBps"
            type="number"
            defaultValue={PARTY_PROTOCOL.PASS_THRESHOLD_BPS / 100}
            {...register("passThresholdBps", { 
              valueAsNumber: true,
              setValueAs: (v: string) => parseInt(v) * 100 // Convert percentage to basis points
            })}
            placeholder="50"
            className="mt-2 bg-black/50 border-white/10"
          />
          <p className="text-gray-400 text-xs mt-1">
            Percentage of votes required for a proposal to pass
          </p>
          {errors.passThresholdBps && (
            <p className="text-red-400 text-sm mt-1">{errors.passThresholdBps.message}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="allowPublicProposals"
            {...register("allowPublicProposals")}
            className="h-4 w-4"
          />
          <Label htmlFor="allowPublicProposals">
            Allow public proposals (anyone can propose actions)
          </Label>
        </div>
      </div>
    </div>
  );
};
