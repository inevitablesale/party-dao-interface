
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Clock, Users } from "lucide-react";
import { CreateClientListingOverlay } from "@/components/CreateClientListingOverlay";
import { MarketplaceListings } from "@/components/marketplace/MarketplaceListings";

const MOCK_STATS = {
  totalLgrLocked: "125,000",
  activeOpportunities: "48",
  avgCompletionTime: "3.5 days",
  totalEarners: "256"
};

export function Marketplace() {
  const [showCreateListing, setShowCreateListing] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-purple-500/10 to-pink-500/10 animate-gradient" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in">
              Earn LGR Tokens
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto animate-fade-in">
              Join the decentralized accounting marketplace. Complete tasks, earn tokens, 
              and build your reputation.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-teal-500/50 transition-colors">
              <TrendingUp className="w-8 h-8 text-teal-400 mb-2" />
              <div className="text-2xl font-bold text-white mb-1">{MOCK_STATS.totalLgrLocked} LGR</div>
              <div className="text-sm text-white/60">Total LGR Locked</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-colors">
              <Plus className="w-8 h-8 text-purple-400 mb-2" />
              <div className="text-2xl font-bold text-white mb-1">{MOCK_STATS.activeOpportunities}</div>
              <div className="text-sm text-white/60">Active Opportunities</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-pink-500/50 transition-colors">
              <Clock className="w-8 h-8 text-pink-400 mb-2" />
              <div className="text-2xl font-bold text-white mb-1">{MOCK_STATS.avgCompletionTime}</div>
              <div className="text-sm text-white/60">Avg. Completion Time</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-orange-500/50 transition-colors">
              <Users className="w-8 h-8 text-orange-400 mb-2" />
              <div className="text-2xl font-bold text-white mb-1">{MOCK_STATS.totalEarners}</div>
              <div className="text-sm text-white/60">Active Earners</div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center mb-12">
            <Button 
              onClick={() => setShowCreateListing(true)}
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 
                text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl 
                transition-all duration-200 animate-fade-in"
            >
              <Plus className="w-5 h-5 mr-2" />
              Post New Work Opportunity
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <MarketplaceListings />
      </div>

      <CreateClientListingOverlay 
        isOpen={showCreateListing} 
        onClose={() => setShowCreateListing(false)} 
      />
    </div>
  );
}
