
import { useState } from 'react';
import { Users } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const NewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email }]);

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Successfully subscribed!",
        description: "Welcome to the LedgerFund community.",
      });
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Subscription failed",
        description: error.message === 'duplicate key value violates unique constraint "newsletter_subscriptions_email_key"' 
          ? "This email is already subscribed."
          : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white/5 rounded-lg p-8 backdrop-blur-sm border border-white/10">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-yellow-500/10 rounded-lg">
          <Users className="w-8 h-8 text-yellow-500" />
        </div>
        <div className="text-left">
          <h3 className="text-2xl font-semibold text-white">Subscribe to Our Newsletter</h3>
          <p className="text-white/70">Join 1,550+ accountants building the future of practice ownership</p>
        </div>
      </div>
      
      {isSuccess ? (
        <div className="flex items-center gap-3 bg-green-500/10 px-6 py-3 rounded-lg border border-green-500/20">
          <p className="text-green-400">Thank you for joining our community! 🎉</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email" 
            disabled={isLoading}
            className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            required
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-yellow-500/10 text-yellow-500 rounded-lg border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      )}
    </div>
  );
};
