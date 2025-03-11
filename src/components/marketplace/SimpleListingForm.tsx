import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { BookOpen, Calculator, Clock, Calendar, DollarSign } from "lucide-react";

export function SimpleListingForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [rdAmount, setRdAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  
  const { toast } = useToast();
  const { isConnected, connect } = useWalletConnection();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to post opportunities",
        variant: "destructive"
      });
      connect();
      return;
    }

    // TODO: Will implement on-chain listing creation here
    toast({
      title: "Success",
      description: "Your work opportunity has been posted",
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <Label className="text-lg text-white">What needs to be done?</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Review Q4 Tax Returns"
          className="bg-white/5 border-white/10 text-white text-lg"
          required
        />
      </div>

      <div className="space-y-4">
        <Label className="text-lg text-white">Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide details about the work required..."
          className="bg-white/5 border-white/10 text-white min-h-[120px] text-lg"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label className="text-lg text-white">Category</Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'tax_prep', label: 'Tax Preparation', icon: BookOpen },
              { value: 'bookkeeping', label: 'Bookkeeping', icon: Calculator },
              { value: 'audit', label: 'Audit', icon: Clock },
              { value: 'advisory', label: 'Advisory', icon: Calendar }
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setCategory(value)}
                className={`p-4 rounded-xl border ${
                  category === value
                    ? 'border-teal-500 bg-teal-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20'
                } transition-colors flex flex-col items-center gap-2`}
              >
                <Icon className="w-6 h-6" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-lg text-white">Payment Details</Label>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-white/60">RD Token Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <Input
                  type="number"
                  value={rdAmount}
                  onChange={(e) => setRdAmount(e.target.value)}
                  placeholder="Amount in RD"
                  className="pl-10 bg-white/5 border-white/10 text-white"
                  required
                  min="1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white/60">Deadline</Label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="text-white/60 hover:text-white"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
        >
          Post Opportunity
        </Button>
      </div>
    </form>
  );
}
