
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, Calendar, Clock, MapPin } from "lucide-react";

export function ShortTermForm() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-semibold text-white mb-4">
          Short-Term Service Details
        </h3>
        <p className="text-white/60">
          Define the parameters of your short-term service arrangement
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Project Title</Label>
            <Input 
              placeholder="e.g., Q4 2024 Audit Support"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Industry</Label>
            <Select>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="financial">Financial Services</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Project Duration</Label>
            <div className="grid grid-cols-2 gap-4">
              <Select>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-month">1 Month</SelectItem>
                  <SelectItem value="3-months">3 Months</SelectItem>
                  <SelectItem value="6-months">6 Months</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <Input 
                type="date"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Location</Label>
            <Select>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="on-site">On-site</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Required Service Hours</Label>
            <Select>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select hours" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="part-time">Part-time (20hrs/week)</SelectItem>
                <SelectItem value="full-time">Full-time (40hrs/week)</SelectItem>
                <SelectItem value="custom">Custom Hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Project Description</Label>
            <Textarea 
              placeholder="Describe the project scope and requirements..."
              className="bg-white/5 border-white/10 text-white min-h-[120px]"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-teal-500/10">
              <DollarSign className="w-5 h-5 text-teal-400" />
            </div>
            <Label className="text-white">Budget Range</Label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              placeholder="Min"
              className="bg-white/5 border-white/10 text-white"
            />
            <Input 
              placeholder="Max"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-teal-500/10">
              <Clock className="w-5 h-5 text-teal-400" />
            </div>
            <Label className="text-white">Response Time</Label>
          </div>
          <Select>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select response time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Within 24 hours</SelectItem>
              <SelectItem value="48h">Within 48 hours</SelectItem>
              <SelectItem value="1w">Within 1 week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
