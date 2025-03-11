
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { X, BookOpen, ChevronRight } from "lucide-react";

interface CreateArticleOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateArticleOverlay({ isOpen, onClose }: CreateArticleOverlayProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[80vh] bg-black/95 border-white/10 text-white p-0 overflow-hidden">
        <div className="absolute right-4 top-4 z-10">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white/60 hover:text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-white/10 bg-gradient-to-r from-teal-500/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Create Article NFT</h2>
                <p className="text-sm text-white/60">Share your professional insights with the community</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-lg font-medium mb-6">What kind of article would you like to create?</h3>
                
                <div className="space-y-4">
                  {[
                    {
                      title: "Technical Analysis",
                      description: "Deep dive into accounting principles, methods, and best practices",
                      icon: "📊"
                    },
                    {
                      title: "Industry Insights",
                      description: "Share your perspective on industry trends and developments",
                      icon: "💡"
                    },
                    {
                      title: "Case Study",
                      description: "Present real-world examples and their solutions",
                      icon: "📋"
                    },
                    {
                      title: "How-to Guide",
                      description: "Step-by-step tutorials and practical guidance",
                      icon: "📝"
                    }
                  ].map((type) => (
                    <Button
                      key={type.title}
                      variant="outline"
                      className="w-full p-4 h-auto flex items-center justify-between bg-white/5 border-white/10 hover:border-teal-500/50 hover:bg-white/10"
                      onClick={() => {/* Will implement in next step */}}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{type.icon}</div>
                        <div className="text-left">
                          <div className="font-medium">{type.title}</div>
                          <div className="text-sm text-white/60">{type.description}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/40" />
                    </Button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
