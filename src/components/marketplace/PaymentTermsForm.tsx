
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, Calendar, CreditCard } from "lucide-react";

interface PaymentTermsFormProps {
  durationType: 'short-term' | 'long-term' | '';
}

export function PaymentTermsForm({ durationType }: PaymentTermsFormProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-white mb-2">Payment Terms</h3>
        <p className="text-white/60">Define the payment structure and requirements for this service</p>
      </div>

      <div className="grid gap-8">
        {/* Payment Amount */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-white">Payment Amount</label>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Input
                type="number"
                placeholder="0.00"
                className="pl-8 bg-white/5 border-white/10 text-white"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">$</span>
            </div>
            <Select defaultValue="hour">
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hour">Per Hour</SelectItem>
                <SelectItem value="day">Per Day</SelectItem>
                <SelectItem value="week">Per Week</SelectItem>
                <SelectItem value="month">Per Month</SelectItem>
                <SelectItem value="project">Per Project</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Payment Schedule */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-white">Payment Schedule</label>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-4 p-4 rounded-lg border border-white/10 bg-white/5">
              <div className="h-10 w-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-teal-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-white">Regular Payments</h4>
                <p className="text-sm text-white/60">Set up recurring payment schedule</p>
              </div>
              <Select defaultValue="biweekly">
                <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-white">Accepted Payment Methods</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-4 rounded-lg border border-white/10 bg-white/5">
              <div className="h-10 w-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-teal-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">Crypto</h4>
                <p className="text-sm text-white/60">Accept cryptocurrency payments</p>
              </div>
              <Button variant="ghost" className="ml-auto text-white/60 hover:text-white">
                Configure
              </Button>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg border border-white/10 bg-white/5">
              <div className="h-10 w-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-teal-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">Fiat</h4>
                <p className="text-sm text-white/60">Accept traditional payments</p>
              </div>
              <Button variant="ghost" className="ml-auto text-white/60 hover:text-white">
                Configure
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
