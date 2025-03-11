
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, Loader2, Building2, DollarSign, 
  ChevronRight, Handshake, Clock, Shield, MapPin
} from 'lucide-react';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { CreateClientListingOverlay } from "@/components/CreateClientListingOverlay";

// Mock data for client listings
const MOCK_LISTINGS = [
  {
    id: '1',
    title: 'Manufacturing Client Portfolio',
    publisher: '0x1234567890123456789012345678901234567890',
    category: 'Manufacturing',
    contentType: 'client',
    annual_revenue: '$2.5M - $5M',
    location: 'Northeast US',
    client_since: '2018',
    service_mix: ['Tax Planning', 'Audit', 'Advisory'],
    royalty_terms: '5% Year 1, 3% Year 2',
    transition_period: '6 months'
  }
];

export default function KnowledgeBase() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { isConnected, address } = useWalletConnection();
  const { toast } = useToast();
  const [showListingOverlay, setShowListingOverlay] = useState(false);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem('has_visited_marketplace');
    if (!hasVisited) {
      startOnboarding();
      localStorage.setItem('has_visited_marketplace', 'true');
    }
  }, []);

  const startOnboarding = () => {
    setTimeout(() => {
      toast({
        title: "Welcome to the Marketplace",
        description: "Find and structure service arrangements with other accounting firms.",
        duration: 5000,
      });
    }, 1000);

    setTimeout(() => {
      toast({
        title: "Clear Terms & Structure",
        description: "Use our templates to create well-defined service arrangements.",
        duration: 5000,
      });
    }, 6000);

    setTimeout(() => {
      toast({
        title: "Getting Started",
        description: "Browse available templates or create your own service arrangement.",
        duration: 5000,
      });
    }, 11000);
  };

  const filteredListings = MOCK_LISTINGS.filter(listing =>
    searchQuery === '' || 
    listing.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20">
        <motion.div 
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 0% 0%, #00ff87 0%, transparent 50%)",
              "radial-gradient(circle at 100% 100%, #00ff87 0%, transparent 50%)",
              "radial-gradient(circle at 0% 100%, #00ff87 0%, transparent 50%)",
              "radial-gradient(circle at 100% 0%, #00ff87 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <motion.h1 
              className="text-6xl font-bold bg-gradient-to-r from-teal-400 via-emerald-400 to-green-400 text-transparent bg-clip-text mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Accounting Service Marketplace
            </motion.h1>
            <motion.p 
              className="text-xl text-white/60 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Create structured service arrangements and connect with other accounting firms to expand your service offerings.
            </motion.p>
          </div>

          <motion.div 
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-white/40" />
              <Input
                type="search"
                placeholder="Search by industry, revenue range, or location..."
                className="w-full pl-12 py-6 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-white/40 hover:border-white/20 transition-colors focus:border-teal-500/50 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="text-center py-12">
          <h3 className="text-2xl font-semibold text-white/80 mb-4">Create Your Service Arrangement</h3>
          <p className="text-white/60 mb-8">Use our templates to structure clear and effective transitions</p>
          
          <div className="max-w-3xl mx-auto">
            <div onClick={() => setShowListingOverlay(true)} className="cursor-pointer">
              <Card className="p-6 bg-white/5 border-white/10 hover:border-teal-400/50 transition-all duration-300">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-teal-400/10 rounded-xl flex items-center justify-center mx-auto">
                    <Handshake className="w-6 h-6 text-teal-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">Design Your Service Arrangement</h4>
                  <p className="text-sm text-white/60">
                    Create a structured agreement for your service partnership
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="text-lg font-semibold text-white/80 mb-2">Service Arrangement Template</div>
            <div className="text-sm text-white/60">Use this template to structure your service partnership</div>
          </div>
          {filteredListings.map((listing) => (
            <Link
              key={listing.id}
              to={`/marketplace/client/${listing.id}`}
              className="group block"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full bg-gray-800/50 border-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden backdrop-blur-xl group-hover:transform group-hover:scale-[1.02]">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0" />
                  <div className="relative p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                        <Building2 className="w-5 h-5 text-teal-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-teal-400 transition-colors line-clamp-2">
                          {listing.title}
                        </h3>
                        <p className="text-sm text-white/60 mt-1">
                          {listing.category}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <DollarSign className="w-4 h-4" />
                        <span>{listing.annual_revenue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <MapPin className="w-4 h-4" />
                        <span>{listing.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Clock className="w-4 h-4" />
                        <span>Since {listing.client_since}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Shield className="w-4 h-4" />
                        <span>{listing.transition_period}</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Partnership Terms:</span>
                        <span className="text-teal-400 font-medium">{listing.royalty_terms}</span>
                      </div>
                    </div>

                    <div className="absolute bottom-4 right-4 text-white/40 group-hover:text-white/60 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      <CreateClientListingOverlay 
        isOpen={showListingOverlay}
        onClose={() => setShowListingOverlay(false)}
      />
    </div>
  );
}
