
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, DollarSign } from "lucide-react";
import { SimpleListingForm } from "./marketplace/SimpleListingForm";

interface CreateClientListingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateClientListingOverlay({ isOpen, onClose }: CreateClientListingOverlayProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl w-full bg-[#0a0a0a] border-none p-0 overflow-hidden">
        <DialogTitle className="sr-only">Create Work Opportunity</DialogTitle>
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-gradient-to-r from-teal-500/5 via-teal-500/10 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-teal-500/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-teal-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Post Work Opportunity</h2>
                <p className="text-sm text-white/60">Get help by paying in LGR tokens</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white/60 hover:text-white"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <SimpleListingForm onClose={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
