import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Briefcase, DollarSign, Filter, TrendingUp, BookOpen, Calculator, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { Input } from "@/components/ui/input";

const MOCK_LISTINGS = [
  {
    id: '1',
    title: 'Tax Return Review Needed',
    description: 'Need experienced CPA to review 25 individual tax returns before filing deadline.',
    category: 'tax_prep',
    rdAmount: 500,
    durationType: 'short-term',
    timeframe: '2 weeks',
    skills: ['Tax Review', '1040 Forms', 'Individual Returns'],
    urgent: true
  },
  {
    id: '2',
    title: 'Monthly Bank Reconciliation',
    description: 'Looking for help with QuickBooks bank reconciliation for small retail business.',
    category: 'bookkeeping',
    rdAmount: 200,
    durationType: 'short-term',
    timeframe: '3 days',
    skills: ['QuickBooks', 'Bank Reconciliation'],
    trending: true
  },
  {
    id: '3',
    title: 'Audit Support - Manufacturing',
    description: 'Need assistance with preparing audit documentation for manufacturing client.',
    category: 'audit',
    rdAmount: 1000,
    durationType: 'short-term',
    timeframe: '1 week',
    skills: ['Audit Prep', 'Manufacturing', 'Documentation'],
    urgent: true,
    trending: true
  }
];

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case 'tax_prep':
      return <BookOpen className="w-5 h-5" />;
    case 'bookkeeping':
      return <Calculator className="w-5 h-5" />;
    case 'audit':
      return <Briefcase className="w-5 h-5" />;
    default:
      return <Briefcase className="w-5 h-5" />;
  }
};

export function MarketplaceListings() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();
  const { isConnected, connect } = useWalletConnection();

  const handleInterested = (listingId: string) => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to express interest in opportunities",
        variant: "destructive"
      });
      connect();
      return;
    }

    toast({
      title: "Interest Registered",
      description: "The client will be notified of your interest",
    });
  };

  const filteredListings = MOCK_LISTINGS.filter(listing => {
    if (selectedCategory && listing.category !== selectedCategory) return false;
    if (search && !listing.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4 items-center bg-white/5 p-4 rounded-xl border border-white/10">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search opportunities..."
            className="pl-9 bg-white/5 border-white/10 text-white"
          />
        </div>
        <div className="flex gap-2">
          {['tax_prep', 'bookkeeping', 'audit'].map(category => (
            <Button
              key={category}
              variant="ghost"
              className={`flex items-center gap-2 ${
                selectedCategory === category 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
            >
              <CategoryIcon category={category} />
              {category.replace('_', ' ')}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map(listing => (
          <div 
            key={listing.id}
            className="group relative bg-white/5 rounded-xl border border-white/10 hover:border-teal-500/50 
              transition-all duration-200 overflow-hidden animate-fade-in"
          >
            <div className="absolute top-4 left-4 flex gap-2">
              {listing.urgent && (
                <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-none">
                  Urgent
                </Badge>
              )}
              {listing.trending && (
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-none">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending
                </Badge>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 text-white/60 mb-4">
                <CategoryIcon category={listing.category} />
                <span className="capitalize">{listing.category.replace('_', ' ')}</span>
              </div>

              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-teal-400 
                transition-colors line-clamp-2"
              >
                {listing.title}
              </h3>

              <p className="text-white/60 mb-4 line-clamp-2">
                {listing.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {listing.skills.map(skill => (
                  <Badge 
                    key={skill}
                    variant="secondary"
                    className="bg-white/5 text-white/80 border-none"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="flex items-end justify-between pt-4 border-t border-white/5">
                <div>
                  <div className="flex items-center gap-2 text-white/60 mb-2">
                    <Clock className="w-4 h-4" />
                    <span>{listing.timeframe}</span>
                  </div>
                  <div className="flex items-center gap-2 text-2xl font-bold text-teal-400">
                    <DollarSign className="w-5 h-5" />
                    <span>{listing.rdAmount} RD</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleInterested(listing.id)}
                  className="bg-teal-500 hover:bg-teal-600"
                >
                  I'm Interested
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
